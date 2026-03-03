import { define } from "@/server/define.ts";
import { sync } from "@/server/sync.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const ids = await ctx.state.sql`
      select b.id
      from blogs b
      where b.archived = false
    `;
    for (const b of ids) {
      await sync(ctx.state.sql, b);
    }
    return new Response(`Done`);
  },
});
