import { define } from "@/server/define.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const result = await ctx.state.sql`select count(*) from posts`;
    console.log(result);
    return new Response(`${result[0].count} posts`);
  },
});
