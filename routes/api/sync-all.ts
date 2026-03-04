import { define } from "@/server/define.ts";
import { sync } from "@/server/sync.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const blogs = await ctx.state.sql`
      select * from blogs 
    `;
    for (const b of blogs) {
      await sync(ctx.state.sql, b.id);
    }
    return new Response(`Done`);
  },
});
