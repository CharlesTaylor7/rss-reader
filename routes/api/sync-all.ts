import { define } from "@/server/define.ts";
import { sync } from "@/server/sync.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const blogs = await ctx.state.sql`
      select b.id 
      from blogs b
      left join feeds f on b.id = f.blog_id
      order by f.last_successful_sync
    `;
    for (const b of blogs) {
      try {
        await sync(ctx.state.sql, b.id);
      } catch (e) {
        console.error(e);
      }
    }
    return new Response(`Done`);
  },
});
