import { createDefine } from "fresh";
import { Pool } from "@db/postgres";

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
  db: Pool;
}

export const define = createDefine<State>();
