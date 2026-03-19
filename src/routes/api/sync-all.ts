import { define } from "@/server/define.ts";
import { sync } from "@/server/sync.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (Deno.env.get("DENO_DEPLOY")) return new Response();

    const sql = ctx.state.sql;
    const blogs = await sql`
        select b.id
        from blogs b 
        left join feeds f on f.blog_id = b.id
        order by f.last_successful_sync desc
      `;
    for (const blog of blogs) {
      await sync(sql, blog.id);
    }
    return new Response();
  },
});
