import { QueryFunc } from "@/server/define.ts";
import { md5 } from "@takker/md5";
import { encodeHex } from "jsr:@std/encoding@1/hex";
import { parseXmlStream, type XmlEventCallbacks } from "@std/xml";

type Feed = {
  xml_url: string;
  etag?: string;
  last_modified?: string;
  hash?: string;
};

export async function sync(sql: QueryFunc, blogId: number): Promise<void> {
  const feed: Feed = (
    await sql`
    select b.xml_url, f.etag, f.last_modified, f.hash
    from blogs b 
    left join feeds f on b.id = f.blog_id
    where b.id = ${blogId}
  `
  )[0] as unknown as Feed;
  console.log(feed);
  if (feed.xml_url == undefined) {
    console.error("no blog found!");
    return;
  }

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
  // no updates on a not modified
  if (response.status === 304) {
    return;
  }

  const hash = encodeHex(md5(body));
  const shouldUpdatePosts = feed.hash != hash;
  feed.hash = hash;
  feed.etag = response.headers.get("etag")!;
  feed.last_modified = response.headers.get("last-modified")!;
  await sql`
    insert into feeds(blog_id, hash, etag, last_modified)
    values (${blogId}, ${feed.hash}, ${feed.etag}, ${feed.last_modified})
    on conflict(blog_id) do update set
      hash = excluded.hash,
      etag = excluded.etag,
      last_modified = excluded.last_modified
  `;

  if (shouldUpdatePosts) {
    await updatePosts(sql, blogId, body);
  }
}

type Post = {
  title: string;
  url: string;
  published_at_text: string;
  thumbnail: string;
};

export async function force_sync(
  sql: QueryFunc,
  blogId: number,
): Promise<void> {
  const feed = (
    await sql`
    select b.xml_url
    from blogs b 
    where b.id = ${blogId}
  `
  )[0].xml_url as string;
  const response = await fetch(feed);
  const body = await response.text();
  await updatePosts(sql, blogId, body);
}

async function updatePosts(sql: QueryFunc, blogId: number, body: string) {
  const posts: Array<Post> = [];
  let post: Partial<Post> = {};
  let el: string = "";

  const xmlCallbacks: XmlEventCallbacks = {
    onEndElement(name) {
      if (name == "entry" || name == "item") {
        posts.push(post as Post);
      }
    },

    onStartElement(name, _, __, attributes) {
      el = name;
      if (name == "entry" || name == "item") {
        post = {};
      } else if (name == "link") {
        for (let i = 0; i < attributes.count; i++) {
          if (attributes.getName(i) == "href") {
            post.url = attributes.getValue(i);
          }
        }
      } else if (name == "thumbnail") {
        for (let i = 0; i < attributes.count; i++) {
          if (attributes.getName(i) == "url") {
            post.thumbnail = attributes.getValue(i).trim();
          }
        }
      }
    },

    onText(text) {
      const trimmed = text.trim();
      if (trimmed === "") return;

      if (el == "title") {
        post.title = trimmed;
      } else if (el == "link") {
        post.url = trimmed;
      } else if (el == "published" || el == "pubDate") {
        post.published_at_text = trimmed;
      }
    },
  };

  await parseXmlStream(intoStream(body), xmlCallbacks);

  for (const post of posts) {
    if (post.title == null) {
      console.error(post);
      return;
    }
    try {
      await sql`
          insert into posts(blog_id, title, url, published_at_text, thumbnail)
          values (${blogId}, ${post.title}, ${post.url}, ${post.published_at_text ?? null}, ${post.thumbnail ?? null})
          on conflict (url) do update
          set 
            title=excluded.title,
            published_at_text=excluded.published_at_text,
            thumbnail=excluded.thumbnail
        `;
    } catch (e) {
      console.error(e);
      console.log(post);
    }
  }
}

async function* intoStream(body: string) {
  yield body;
}
