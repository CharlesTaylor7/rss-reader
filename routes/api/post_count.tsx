import { define } from "@/utils.ts";
export const handler = define.handlers({
  async GET(ctx) {
    using conn = await ctx.state.db.connect()
    const result = await conn.queryArray("Select COUNT(*) from posts");
    return new Response(
      `${result.rows[0]} posts`
    );
  },
});
