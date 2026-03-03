import { define } from "@/server/define.ts";
import SyncBlogButton from "@/islands/SyncBlogButton.tsx";

type Blog = {
  id: number;
  title: string;
  xml_url: string;
  html_url: string;
};
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
    limit 10
  `) as Blog[];

  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center gap-3">
        {blogs.map((b) => (
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">
                <a href={b.html_url}>{b.title}</a>
              </h2>
              <div class="card-actions justify-end">
                <SyncBlogButton blogId={b.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
