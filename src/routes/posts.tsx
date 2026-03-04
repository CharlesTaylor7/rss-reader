import { define } from "@/server/define.ts";

export default define.page(async function (ctx) {
  const posts = await ctx.state.sql`
    select title
    from posts 
    order by published_at desc
    limit 10
  `;

  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center gap-3">
        {posts.length}
      </div>
    </div>
  );
});
