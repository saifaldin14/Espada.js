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

export type HyperTextNodeType = {
  type: string;
  tag: string;
  props: HyperTextPropsType;
  children: HyperTextChildNodeType[];
};
