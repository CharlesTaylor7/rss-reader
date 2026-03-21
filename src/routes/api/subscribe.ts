import { define } from "@/server/define.ts";
import { DOMParser } from "linkedom";
function parse(html: string) {
  return new DOMParser().parseFromString(html, "text/html");
}

export const handler = define.handlers({
  async POST(ctx) {
    // Get the form data from the request
    const formData: FormData = await ctx.req.formData();
    const siteUrl = new URL(formData.get("url")!.toString()!);
    const response = await fetch(siteUrl);
    const contentType = response.headers.get("content-type");
    // TODO:
    // parse the html and look for a link tag that points to the rss feed
    let rssUrl: URL;

    if (contentType?.includes("text/xml")) {
      rssUrl = siteUrl;
    } else if (contentType?.includes("text/html")) {
      const doc = parse(await response.text());

      const links = doc.querySelectorAll("head>link[rel='alternate']");
      const feedUrl = links
        .filter((link: HTMLElement) =>
          link.getAttribute("type")!.includes("xml"),
        )[0]
        .getAttribute("href")!;
      const parsedUrl = new URL(feedUrl, siteUrl);

      rssUrl = parsedUrl;
    } else {
      throw new Error();
    }

    await ctx.state.sql`
      insert into blogs (xml_url) values (${rssUrl.toString()})
    `;

    // parse the rss feed and look for the title of the blog, and its author.
    return new Response(`Successfully subscribed`);
  },
});
