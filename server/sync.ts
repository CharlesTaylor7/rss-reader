import { NeonQueryHandle } from "@/server/define.ts";
import { md5 } from "@takker/md5";
import { encodeHex } from "jsr:@std/encoding@1/hex";

type Feed = {
  xml_url: string;
  etag?: string;
  last_modified?: string;
  hash?: string;
};

export default async function (
  sql: NeonQueryHandle,
  blogId: number,
): Promise<void> {
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

  const response = await fetch(feed.xml_url, {
    method: "GET",
    headers: {
      "If-None-Match": feed.etag,
      "If-Modified-Since": feed.last_modified,
    },
  });

  const body = await response.text();
  const hash = encodeHex(md5(body));
  const shouldUpdateFeed = feed.hash != hash;
  feed.hash = hash;
  feed.etag = response.headers.get("etag")!;
  feed.last_modified = response.headers.get("last-modified")!;
  await sql`
    insert into feeds(blog_id, hash, etag, last_modified)
    values ${feed.hash} ${feed.etag} ${feed.last_modified}
    on conflict(blog_id) do update set
      hash = excluded.hash,
      etag = excluded.etag,
      last_modified = excluded.last_modified
  `;

  if (shouldUpdateFeed) {
    updatePosts(sql, blogId, body);
  }
}
