import Toaster from "@/islands/Toaster.tsx";
import { define } from "@/server/define.ts";
import ArticleFilterTab from "@/routes/partials/ArticleFilterTab.tsx";

export default define.page(function App({ Component, route, url }) {
  console.log("component", route);

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>RSS Reader</title>
        <link rel="manifest" href="manifest.json" />
      </head>
      <body>
        <div class="h-screen flex flex-col">
          <h1 class="w-full p-3 bg-base-200 flex gap-2 justify-between">
            {route === "/articles" ? <ArticleFilterTab url={url} /> : <div />}
            <button
              type="button"
              className="cursor-pointer"
              popoverTarget="popover-1"
              style={
                {
                  anchorName: "--anchor-1",
                } /* as React.CSSProperties */
              }
            >
              <svg
                class="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>
            </button>

            <ul
              className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
              popover="auto"
              id="popover-1"
              style={
                {
                  positionAnchor: "--anchor-1",
                } /* as React.CSSProperties */
              }
            >
              <li>
                <a class="link" href="/articles">Articles</a>
              </li>
              <li>
                <a class="link" href="/blogs">Blogs</a>
              </li>
              <li>
                <a class="link" href="/import">Import</a>
              </li>
              <li>
                <a class="link" href="/subscribe">Subscribe</a>
              </li>
            </ul>
          </h1>

          <div class="flex-1 overflow-y-scroll overflow-x-hidden">
            <Component />
          </div>
          <Toaster />
        </div>
      </body>
    </html>
  );
});
