import { useSignal } from "@preact/signals";
import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import Counter from "@/islands/Counter.tsx";
import Article from "@/islands/Article.tsx";

export default define.page(function Home(ctx) {
  const count = useSignal(3);

  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center gap-3">
        <Article
          title="title 1"
          description="description 1"
          url="www.google.com"
        />
        <Article title="title 2" description="description 2" />
      </div>
    </div>
  );
});
