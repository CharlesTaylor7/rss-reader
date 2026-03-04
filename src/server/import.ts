import { QueryFunc } from "@/server/define.ts";
import { parseXmlStreamFromBytes, type XmlEventCallbacks } from "@std/xml";

type Blog = Partial<{ title: string; xml_url: string; html_url: string }>;
export default async function (
  sql: QueryFunc,
  fileStream: AsyncIterable<Uint8Array>,
): Promise<void> {
  // Get the form data from the request

  const blogsToImport: Array<Blog> = [];
  let rawBlog: Map<string, string> = new Map();
  const xmlCallbacks: XmlEventCallbacks = {
    onStartElement(name, _colonIndex, _uri, attributes) {
      if (name != "outline") return;
      for (let i = 0; i < attributes.count; i++) {
        rawBlog.set(attributes.getName(i), attributes.getValue(i));
      }
      blogsToImport.push({
        title: rawBlog.get("title"),
        xml_url: rawBlog.get("xmlUrl"),
        html_url: rawBlog.get("htmlUrl"),
      });
      rawBlog = new Map();
    },
  };

  await parseXmlStreamFromBytes(fileStream, xmlCallbacks);

  for (const blog of blogsToImport) {
    await sql`
      insert into blogs(title, xml_url, html_url)
      values (${blog.title}, ${blog.xml_url}, ${blog.html_url})
      on conflict (xml_url) do update
      set 
        title=excluded.title, 
        html_url=excluded.html_url
    `;
  }
}
