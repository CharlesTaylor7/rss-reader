import { useSignal } from "@preact/signals";
import { define } from "@/server/define.ts";
import Article from "@/islands/Article.tsx";
import Login from "@/islands/Login.tsx";

export default define.page(function Home(ctx) {
  const count = useSignal(3);

  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center gap-3">
        <Article
          title="title 1"
          description="description 1"
          url="https://www.youtube.com"
        />
        <Login />
      </div>
    </div>
  );
});
