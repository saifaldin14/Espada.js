import { DomNodeType, HyperTextNodeType, HyperTextPropsType } from "./types";
import { withoutNulls } from "./utils/arrays";

// Define the Virtual DOM HTML Elements
export const DOM_TYPES: DomNodeType = {
  TEXT: "text",
  ELEMENT: "element",
  FRAGMENT: "fragment",
};

export function h(
  tag: string,
  props: HyperTextPropsType = {},
  children = []
): HyperTextNodeType {
  return {
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
    type: DOM_TYPES.ELEMENT,
  };
}

export const mapTextNodes = (children) => {
  return children.map((child) =>
    typeof child === "string" ? hString(child) : child
  );
};

export const hString = (str: string) => {
  return { type: DOM_TYPES.TEXT, value: str };
};

export const hFragment = (vNodes) => {
  return {
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNulls(vNodes)),
  };
};
