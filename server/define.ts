import { createDefine } from "fresh";
import { NeonQueryFunction } from "@neon/serverless";

export type NeonQueryHandle = NeonQueryFunction<false, false>;
export interface State {
  sql: NeonQueryHandle;
}

export const define = createDefine<State>();
