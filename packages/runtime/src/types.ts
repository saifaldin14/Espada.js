/* eslint-disable @typescript-eslint/no-explicit-any */
export type HyperTextChildNodeType = {
  type?: string;
  tag?: string;
  props?: any;
};

export type ElementNodeType = {
  type: string;
  tag: string;
  props: any;
  children: HyperTextChildNodeType[];
};

export type TextNodeType = {
  type: string;
  value: string;
};

export type FragmentNodeType = {
  type: string;
  children: unknown;
};

export type vTextNode = {
  type: string;
  value: string;
  el: Text;
};

export type vElementNode = {
  type: string;
  tag: string;
  props: any;
  children: any;
  el: HTMLElement;
};

export type vFragmentNode = {
  type: string;
  children: any;
  el: DocumentFragment;
};

export type VoidFunctionType = () => void;
