import { QueryFunc } from "@/server/define.ts";
import { md5 } from "@takker/md5";
import { encodeHex } from "jsr:@std/encoding@1/hex";
import { parseXmlStream, type XmlEventCallbacks } from "@std/xml";

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
  const body = await fetchFeed(sql, feed);
  if (body == null) return;

  await updatePosts(sql, blogId, body);
}

async function fetchFeed(sql: QueryFunc, feed: Feed): Promise<string | null> {
  console.log(feed.xml_url);
  if (!Deno.env.get("DENO_DEPLOY")) {
    try {
      return await Deno.readTextFile(`debug/${feed.blog_id}.xml`);
    } catch {
      const response = await fetch(feed.xml_url);
      const body = await response.text();
      await Deno.writeTextFile(`debug/${feed.blog_id}.xml`, body);
      console.log(feed.blog_id);
      return body;
    }
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

  const hash = encodeHex(md5(body));
  feed.hash = hash;
  feed.etag = response.headers.get("etag") ?? feed.etag;
  feed.last_modified =
    response.headers.get("last-modified") ?? feed.last_modified;

  await sql`
    insert into feeds(blog_id, hash, etag, last_modified)
    values (${feed.blog_id}, ${feed.hash}, ${feed.etag}, ${feed.last_modified})
    on conflict(blog_id) do update set
      hash = excluded.hash,
      etag = excluded.etag,
      last_modified = excluded.last_modified
  `;

  // no updates on a not modified
  if (response.status === 304 || feed.hash === hash) {
    return null;
  }

  return body;
}

type Post = {
  title: string;
  url: string;
  published_at_text: string;
  thumbnail: string;
};

const set = new Set();

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
      if (!set.has(name)) {
        console.log(name);
        set.add(name);
      }
      el = name;
      if (name == "entry" || name == "item") {
        post = {};
      } else if (name == "link") {
        for (let i = 0; i < attributes.count; i++) {
          if (attributes.getName(i) == "href") {
            post.url = attributes.getValue(i);
          }
        }
      } else if (name == "image" || name == "media:thumbnail") {
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

      if (el == "title" || el == "media:title") {
        post.title = trimmed;
      } else if (el == "link" || el == "atom:link") {
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
          values (${blogId}, ${post.title}, ${post.url}, ${
            post.published_at_text ?? null
          }, ${post.thumbnail ?? null})
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
