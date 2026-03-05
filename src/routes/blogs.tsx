import { define } from "@/server/define.ts";
import Blog, { BlogProps } from "@/islands/Blog.tsx";
export default define.page(async function (ctx) {
  const sql = ctx.state.sql;
  const query = ctx.url.searchParams.get("q");

  const likeQuery = `%${query}%`;
  const filter = sql`where b.title ilike ${likeQuery}`;
  const blogs = (await sql`
    select id, title, xml_url, html_url 
    from blogs b
    ${query ? filter : sql``}
    order by sort_order desc
  `) as BlogProps[];

  return (
    <div class="flex flex-col items-start justify-start gap-3">
      {blogs.map((b) => (
        <Blog key={b.id} {...b} />
      ))}
    </div>
  );
});
