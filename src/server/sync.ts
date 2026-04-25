import { QueryFunc } from "@/server/define.ts";
import { md5 } from "@takker/md5";
import { encodeHex } from "jsr:@std/encoding@1/hex";
import { parseXmlStream, type XmlEventCallbacks } from "@std/xml";
import { parseDate } from "./date.ts";

type Feed = {
  blog_id: number;
  xml_url: string;
  etag?: string;
  last_modified?: string;
  hash?: string;
};

export async function sync(sql: QueryFunc, blogId: number): Promise<void> {
  const feed: Feed = (
    await sql`
      select b.id as blog_id, b.xml_url, f.etag, f.last_modified, f.hash
      from blogs b 
      left join feeds f on b.id = f.blog_id
      where b.id = ${blogId}
    `
  )[0] as unknown as Feed;
  console.log("Fetching", feed.xml_url);
  const result = await fetchFeed(sql, feed);

  if (result == null) {
    console.log("No updates");
    return;
  }

  let success = false;
  try {
    await updateBlog(sql, blogId, result.body);
    success = true;
  } catch (e) {
    console.error(e);
  }
  if (success) {
    saveFeedMetadata(sql, result);
  }
}

async function fetchFeed(
  sql: QueryFunc,
  feed: Feed,
): Promise<FetchFeedResult | null> {
  const headers: HeadersInit = {};
  if (feed.etag) {
    headers["If-None-Match"] = feed.etag;
  }

  if (feed.last_modified) {
    headers["If-Modified-Since"] = feed.last_modified;
  }
  const response = await fetch(feed.xml_url, {
    method: "GET",
    headers,
  });

  const body = await response.text();

  const hash = encodeHex(md5(body));
  const etag = response.headers.get("etag") ?? feed.etag;
  const last_modified =
    response.headers.get("last-modified") ?? feed.last_modified;

  // no updates on a not modified
  if (response.status === 304 || hash === feed.hash) {
    saveFeedMetadata(sql, { blog_id: feed.blog_id, hash, etag, last_modified });
    return null;
  }

  return {
    blog_id: feed.blog_id,
    body,
    hash,
    etag,
    last_modified,
  };
}

interface FeedMeta {
  blog_id: number;
  hash: string;
  etag?: string;
  last_modified?: string;
}

interface FetchFeedResult extends FeedMeta {
  body: string;
}

async function saveFeedMetadata(sql, feed: FeedMeta) {
  await sql`
    insert into feeds(blog_id, hash, etag, last_modified, last_successful_sync)
    values (${feed.blog_id}, ${feed.hash}, ${feed.etag}, ${feed.last_modified}, now())
    on conflict(blog_id) do update set
      hash = excluded.hash,
      etag = excluded.etag,
      last_modified = excluded.last_modified,
      last_successful_sync = excluded.last_successful_sync
  `;
}

interface Post {
  title: string;
  url: string;
  published_at_text?: string;
  published_at?: Date | null;
  updated_at_text?: string;
  thumbnail?: string;
}
interface Blog {
  title: string;
  subtitle: string;
  posts: Post[];
}

interface XmlAttributes {
  count: number;
  getName(i: number): string;
  getValue(i: number): string;
}

function readAttrs(attributes: XmlAttributes): Record<string, string> {
  const attrs = {} as Record<string, string>;
  for (let i = 0; i < attributes.count; i++) {
    attrs[attributes.getName(i)] = attributes.getValue(i);
  }
  return attrs;
}

export async function parseBlog(body: string): Promise<Blog> {
  const blog: Partial<Blog> = { posts: [] };
  let post: Partial<Post> | null = null;
  let el: string | null = null;

  const xmlCallbacks: XmlEventCallbacks = {
    onEndElement(name) {
      if (el == "title") el = null;
      if (name == "entry" || name == "item") {
        post!.published_at = parseDate(
          post!.published_at_text ?? post!.updated_at_text,
        );
        blog.posts!.push(post as Post);
      }
    },

    onStartElement(name, _, __, attributes) {
      if (el != "title") {
        el = name;
      }

      // blog level tags
      if (name == "entry" || name == "item") {
        post = { title: "" };

        // post level tags
      } else if (post) {
        const attrs = readAttrs(attributes);
        if (name == "link") {
          // *shakes fist vaguely at tbray.org*
          if ("href" in attrs && attrs.rel != "replies") {
            post!.url = attrs.href;
          }
        } else if (name == "image" || name == "media:thumbnail") {
          if ("url" in attrs) {
            post!.thumbnail = attrs.url;
          }
        }
      }
    },

    onText(text) {
      const trimmed = text.trim();
      if (trimmed == "") return;

      if (!post) {
        if (el == "title") {
          blog.title = trimmed;
        } else if (el == "subtitle") {
          blog.subtitle = trimmed;
        }
      } else if (el == "title") {
        post!.title += trimmed;
      } else if (el == "link" || el == "atom:link") {
        post!.url = trimmed;
      } else if (el == "published" || el == "pubDate") {
        post!.published_at_text = trimmed;
      } else if (el == "updated") {
        post!.updated_at_text = trimmed;
      }
    },
  };

  await parseXmlStream(intoStream(body), xmlCallbacks, {
    coerceCDataToText: true,
    ignoreComments: true,
  });

  return blog as Blog;
}

async function updateBlog(
  sql: QueryFunc,
  blogId: number,
  body: string,
): Promise<void> {
  const blog = await parseBlog(body);
  console.log("Parsed title", blog.title);
  await sql`
    update blogs 
    set title = ${blog.title}
    where id = ${blogId} 
    and (title = '' or title is null)
  `;

  console.log("Parsed post count", blog.posts.length);
  console.log("Most Recent", blog.posts[0]);
  for (const post of blog.posts) {
    await sql`
        insert into posts(
          blog_id, 
          title, 
          url, 
          thumbnail,
          published_at_text,
          published_at
        )
        values (
          ${blogId}, 
          ${post.title ?? ""}, 
          ${post.url}, 
          ${post.thumbnail ?? null},
          ${post.published_at_text ?? null},
          ${post.published_at ?? null}
        )
        on conflict (url) do update
        set 
          title=excluded.title,
          published_at_text=excluded.published_at_text,
          published_at=excluded.published_at,
          thumbnail=excluded.thumbnail
      `;
  }
}

async function* intoStream(body: string) {
  yield body;
}
