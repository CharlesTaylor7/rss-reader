import { createDefine } from "fresh";
import { NeonQueryFunction } from "@neon/serverless";

export interface State {
  sql: NeonQueryFunction<false, false>;
}

export const define = createDefine<State>();
