import { App, staticFiles } from "fresh";
import { type State } from "@/utils.ts";
import { Pool } from "@db/postgres";

export const app = new App<State>();
const db = new Pool({}, 100, true);

app.use(staticFiles());
app.use(async (ctx) => {
  ctx.state.db = db
  return await ctx.next();
});
app.use((ctx) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`);
  return ctx.next();
});
app.fsRoutes();
