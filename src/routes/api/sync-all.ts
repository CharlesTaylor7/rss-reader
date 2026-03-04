import { define } from "@/server/define.ts";

export const handler = define.handlers({
  async POST(ctx) {
    return new Response(`Done`);
  },
});
