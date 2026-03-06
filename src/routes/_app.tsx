import Toaster from "@/islands/Toaster.tsx";
import { define } from "@/server/define.ts";
import { Partial } from "fresh/runtime";

interface PageNameProps {
  route: string | null;
}
function PageName({ route }: PageNameProps) {
  if (route === "/posts") return "Articles";
  if (route === "/blogs") return "Blogs";
  if (route === "/import") return "Import";
  if (route === "/login") return "Login";
}
export default define.page(function App({ Component, route }) {
  console.log(route);

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>RSS Reader</title>
        <link rel="manifest" href="manifest.json" />
      </head>
      <body f-client-nav>
        <div class="h-screen flex flex-col">
          <h1 class="w-full text-center flex-none p-3 bg-base-200">
            <PageName route={route} />
          </h1>

          <div class="flex-1 overflow-y-scroll overflow-x-hidden">
            <Partial name="body">
              <Component />
            </Partial>
          </div>
          <Toaster />
        </div>
      </body>
    </html>
  );
});
