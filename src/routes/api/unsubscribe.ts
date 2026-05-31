import { define } from "@/server/define.ts";

export const handler = define.handlers({
  async POST(ctx) {
    // Get the form data from the request
    const formData: FormData = await ctx.req.formData();
    const blogId = parseInt(formData.get("blogId")!.toString(), 10);

    await ctx.state.sql`
      update blogs
      set archived = true 
      where id = ${blogId}
    `;

    // parse the rss feed and look for the title of the blog, and its author.
    return new Response(`Successfully unsubscribed`);
  },
});
