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
    <div class="h-screen flex flex-col">
      <h1 class="w-full text-center flex-none p-3 bg-base-200">
        Blogs ({blogs.length})
      </h1>

      <div class="flex-1 overflow-y-scroll flex flex-col items-start justify-start gap-3">
        {blogs.map((b) => (
          <Blog key={b.id} {...b} />
        ))}
      </div>
    </div>
  );
});
