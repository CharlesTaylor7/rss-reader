import { define } from "@/server/define.ts";
import Sync from "@/islands/Sync.tsx";

export default define.page(function App({ Component }) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>RSS Reader</title>
        <link rel="manifest" href="manifest.json" />
      </head>
      <body>
        <Component />
        <Sync />
      </body>
    </html>
  );
});
