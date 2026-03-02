import { define } from "@/server/define.ts";
import importOpml from "@/server/import.ts";

export const handler = define.handlers({
  async POST(ctx) {
    // Get the form data from the request
    const formData: FormData = await ctx.req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return new Response("File required but not provided.", { status: 400 });
    }

    console.log(
      `Received file: ${file.name} (Type: ${file.type}, Size: ${file.size} bytes)`,
    );

    // TODO: background task/queue? instead of blocking
    await importOpml(ctx.state.sql, file.stream().values());

    return new Response(`Successfully uploaded file: ${file.name}`);
  },
});
