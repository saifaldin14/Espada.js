export type DomNodeType = {
  TEXT: string;
  ELEMENT: string;
  FRAGMENT: string;
};

export type HyperTextPropsType = {
  type?: string;
  class?: string;
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
