import { neon } from "@neon/serverless";
import { sync } from "@/server/sync.ts";

Deno.cron("sync feeds", "17 14 * * *", async function () {
  const databaseUrl = Deno.env.get("POSTGRES_URL")!;
  const sql = neon(databaseUrl);

  const blogs = await sql`
    select b.id
    from blogs b 
    left join feeds f on f.blog_id = b.id
    order by last_successful_sync DESC NULLS FIRST
  `;
  for (const blog of blogs) {
    await sync(sql, blog.id);
  }
});
