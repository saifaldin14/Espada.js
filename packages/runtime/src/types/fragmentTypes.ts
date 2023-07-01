import { VNode } from "./common";

export type FragmentNodeType = {
  type: string;
  children: unknown;
};

export type vFragmentNode = {
  type: string;
  children: VNode[];
  el: DocumentFragment;
  parentFragment: vFragmentNode;
};
