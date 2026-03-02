import { define } from "@/server/define.ts";

export default define.page(async function (ctx) {
  const blogs = await ctx.state.sql`
    select title, xml_url, html_url 
    from blogs 
    order by sort_order desc
    limit 10
  `;

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
                <button type="button" class="btn btn-primary">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
