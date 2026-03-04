import { define } from "@/server/define.ts";
import { force_sync } from "@/server/sync.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const blogs = await ctx.state.sql`
      select * from blogs 
    `;
    for (const b of blogs) {
      console.log(`syncing: ${b.xml_url}`);
      try {
        await force_sync(ctx.state.sql, b.id);
      } catch (e) {
        console.error(e);
      }
    }
    return new Response(`Done`);
  },
});
