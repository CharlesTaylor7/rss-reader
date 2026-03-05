import { define, type QueryFunc } from "@/server/define.ts";
import Article, { type ArticleProps } from "@/islands/Article.tsx";

type View = "default" | "read" | "ignored" | "favorite";

function viewQueryFragment(sql: QueryFunc, view: View) {
  if (view == "default") {
    return sql`
      where p.ignored = false
      order by p.read, p.published_at DESC NULLS LAST
    `;
  } else if (view == "read") {
    return sql`
      where p.read = true
      order by p.published_at desc NULLS LAST
    `;
  } else if (view == "ignored") {
    return sql`
      where p.ignored = true
      order by p.published_at desc NULLS LAST
    `;
  } else if (view == "favorite") {
    return sql`
      where p.favorite = true
      order by p.published_at desc NULLS LAST
    `;
  }
}

export default define.page(async function (ctx) {
  const view = (ctx.url.searchParams.get("view") ?? "default") as View;
  const posts = (await ctx.state.sql`
    select p.id, p.title, p.url, b.title as author,  p.thumbnail, 
      COALESCE(
        to_char(p.published_at, 'YYYY-MM-DD'),
        p.published_at_text
      ) as published_at
    from posts p
    inner join blogs b on b.id = p.blog_id
    ${viewQueryFragment(ctx.state.sql, view)}
    limit 15
  `) as ArticleProps[];

  return (
    <div class="flex flex-col items-start justify-start">
      {posts.map((p) => (
        <Article key={p.id} {...p} />
      ))}
    </div>
  );
});
