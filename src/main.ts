import { App, staticFiles } from "fresh";
import { QueueMessage, type QueryFunc, type State } from "@/server/define.ts";
import { neon } from "@neon/serverless";
import { sync } from "@/server/sync.ts";

function redirect(path: string): Response {
  return new Response("", {
    status: 301,
    headers: { Location: path },
  });
}

const databaseUrl = Deno.env.get("POSTGRES_URL")!;
const sql = neon(databaseUrl);

const debugSql: QueryFunc = (t, ...args) => {
  console.log(t);
  console.log(args);
  return sql(t, ...args);
};

export const app = new App<State>();
app.get("/", () => redirect("/posts"));
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

async function startQueue() {
  const kv = await Deno.openKv();

  kv.listenQueue(async function (msg: QueueMessage) {
    if (msg.type == "sync-all") {
      const blogs = await sql`
      select b.id 
      from blogs b
      left join feeds f on b.id = f.blog_id
      order by f.last_successful_sync
    `;
      using kv = await Deno.openKv();
      for (const b of blogs) {
        await kv.enqueue({ sync_blog: b.id });
      }
    } else if (msg.type == "sync") {
      await sync(sql, msg.blog_id);
    }
  });
}
startQueue();
