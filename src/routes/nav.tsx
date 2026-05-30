import { define } from "@/server/define.ts";

export default define.page(function () {
  return (
    <nav>
      <ul class="flex flex-col gap-2">
        <li>
          <a href="/blogs">Blogs</a>
        </li>
        <li>
          <a href="/import">Import</a>
        </li>
        <li>
          <a href="/posts">Posts</a>
        </li>
      </ul>
    </nav>
  );
});
