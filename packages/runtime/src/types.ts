/* eslint-disable @typescript-eslint/no-explicit-any */
export type HyperTextPropsType = {
  type?: string;
  class?: string;
  action?: string;
};

export type HyperTextChildPropsType = {
  type?: string;
  name?: string;
};

export type HyperTextChildNodeType = {
  type?: string;
  tag?: string;
  props?: HyperTextChildPropsType;
};

export type ElementNodeType = {
  type: string;
  tag: string;
  props: HyperTextPropsType;
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
  props: HyperTextPropsType;
  children: any;
  el: HTMLElement;
};

export type vFragmentNode = {
  type: string;
  children: any;
  el: DocumentFragment;
};
