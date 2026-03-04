import { neon } from "@neon/serverless";
import { sync } from "@/server/sync.ts";

// run setup that depends on `Deno` module, which is not available when vite is doing its initial scan

Deno.cron("sync feeds", "17 14 * * *", async function () {
  const databaseUrl = Deno.env.get("POSTGRES_URL")!;
  const sql = neon(databaseUrl);
  const blogs = await sql`
    select b.id 
    from blogs b
    order by last_successful_sync desc
  `;
  for (const blog of blogs) {
    await sync(sql, blog.id);
  }
});
