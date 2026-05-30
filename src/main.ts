import { App, staticFiles } from "fresh";
import { type QueryFunc, type State } from "@/server/define.ts";
import { neon } from "@neon/serverless";
import "@/crons.ts";

function redirect(path: string): Response {
  return new Response("", {
    status: 301,
    headers: { Location: path },
  });
}

const databaseUrl = Deno.env.get("POSTGRES_URL")!;
let sql: QueryFunc;
try {
  sql = neon(databaseUrl);
} catch (e) {
  console.error(e);
}

const debugSql: QueryFunc = (t, ...args) => {
  console.log(t);
  console.log(args);
  return sql(t, ...args);
};

export const app = new App<State>();
app.get("/", () => redirect("/articles"));
app.use(staticFiles());
// all middlewares inline
app.use(async (ctx) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`);
  ctx.state.sql = sql;
  const response = await ctx.next();
  response.headers.set("Cache-Control", "no-store");
  return response;
});
app.fsRoutes();
