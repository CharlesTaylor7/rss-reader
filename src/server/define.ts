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

export const define = createDefine<State>();
