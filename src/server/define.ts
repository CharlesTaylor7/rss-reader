import { createDefine } from "fresh";
import { NeonQueryFunction, NeonQueryPromise } from "@neon/serverless";

export type NeonQueryHandle = NeonQueryFunction<false, false>;
export type QueryFunc = (
  strings: TemplateStringsArray,
  ...params: any[]
) => NeonQueryPromise<false, false, any>;

export interface State {
  sql: QueryFunc;
}
export type QueueMessage =
  | { type: "sync-all" }
  | { type: "sync"; blog_id: number };

export const define = createDefine<State>();
