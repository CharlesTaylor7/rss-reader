import { App, staticFiles } from "fresh";
import { type State } from "@/server/define.ts";
import { neon } from "@neon/serverless";

const databaseUrl = Deno.env.get("POSTGRES_URL")!;
const sql = neon(databaseUrl);

export const app = new App<State>();
app.get(
  "/",
  () =>
    new Response("", {
      status: 307,
      headers: { Location: "/posts" },
    }),
);

app.use(staticFiles());
app.use(async (ctx) => {
  ctx.state.sql = sql;
  return await ctx.next();
});
app.use((ctx) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`);
  return ctx.next();
});
app.fsRoutes();
