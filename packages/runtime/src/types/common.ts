/* eslint-disable @typescript-eslint/no-explicit-any */
import { vElementNode } from "./elementTypes";
import { vFragmentNode } from "./fragmentTypes";
import { vTextNode } from "./textTypes";

export type VNode = vTextNode | vElementNode | vFragmentNode;
export type VoidFunctionType = () => void;
export type ValueType = string | number | null;
export type EventHandlerType = (event: Event) => void;
export type ArraysDiffSequenceOp = {
  op: string;
  from: number;
  index: number;
  item: any | undefined;
};
