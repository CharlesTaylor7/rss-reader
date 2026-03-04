import { define } from "@/server/define.ts";

type Request = {
  post_id: number;
  read: boolean;
};
export const handler = define.handlers({
  async POST(ctx) {
    const json = (await ctx.req.json()) as Request;
    console.log(json);
    await ctx.state.sql`
        update posts p
        set read = ${json.read}
        where p.id = ${json.post_id} 
      `;
    return new Response(``);
  },
});
