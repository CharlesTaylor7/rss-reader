import { define } from "@/server/define.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const blogs = await ctx.state.sql`
      select b.id 
      from blogs b
      left join feeds f on b.id = f.blog_id
      order by f.last_successful_sync
    `;
    using kv = await Deno.openKv();
    for (const b of blogs) {
      kv.enqueue({ sync_blog: b.id });
    }
    return new Response(`Done`);
  },
});
