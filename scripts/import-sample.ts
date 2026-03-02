import { neon } from "@neon/serverless";
import importOpml from "../server/import.ts";

async function* toAsyncIterable(bytes: Uint8Array): AsyncIterable<Uint8Array> {
  yield bytes;
}

const databaseUrl =
  "postgresql://neondb_owner:npg_lq8mxOcuDLF9@ep-spring-lab-aifwm0kx-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(databaseUrl);

const file = await Deno.readFile("./old/sample-feeds.xml");
importOpml(sql, toAsyncIterable(file));
