import { vElementNode } from "./elementTypes";
import { vFragmentNode } from "./fragmentTypes";
import { vTextNode } from "./textTypes";

export type VNode = vTextNode | vElementNode | vFragmentNode;
export type VoidFunctionType = () => void;
