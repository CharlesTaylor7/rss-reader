import { define } from "@/server/define.ts";

type Request = {
  post_id: number;
  ignore: boolean;
};
export const handler = define.handlers({
  async POST(ctx) {
    const json = (await ctx.req.json()) as Request;
    await ctx.state.sql`
        update posts p
        set ignored = ${json.ignore}
        where p.id = ${json.post_id} 
      `;
    return new Response(``);
  },
});
