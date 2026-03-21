import { parseFeed } from "@/server/sync.ts";

for (const entry of Deno.readDirSync("./debug")) {
  Deno.test(`debug ${entry.name}.xml`, async () => {
    const body = await Deno.readTextFile(`./debug/${entry.name}`);

    const posts = await parseFeed(body);
    console.log(posts);
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];

      const assertNotEmpty = (text: string | null | undefined) => {
        if (text == null || text == "")
          throw new Error(`Blog ${entry.name}, post ${i}`);
      };
      assertNotEmpty(post.url);
      assertNotEmpty(post.title);
      assertNotEmpty(post.published_at_text);
    }
  });
}
