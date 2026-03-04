import { define } from "@/server/define.ts";
import { sync } from "@/server/sync.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const url = new URL(ctx.req.url);
    const blogId = Number(url.searchParams.get("blogId"));
    await sync(ctx.state.sql, blogId);
    return new Response(``);
  },
});
