import { VNode } from "./common";

/* eslint-disable @typescript-eslint/ban-types */
type PropsStyleType = {
  prop1: string;
  prop2: string;
};

export type ElementFunctionType = {
  value?: string;
  func?: Function;
};

export type ElementNodePropsType = {
  on?: ElementFunctionType;
  class?: string | string[];
  style?: PropsStyleType;
};

export type ElementNodeType = {
  type: string;
  tag: string;
  props: ElementNodePropsType;
  children: VNode[];
};

export type vElementNode = {
  type: string;
  tag: string;
  props: ElementNodePropsType;
  children: VNode[];
  el?: HTMLElement;
  listeners?: ElementFunctionType;
};
