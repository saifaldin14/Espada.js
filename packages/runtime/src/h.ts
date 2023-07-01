import {
  DomNodeType,
  HyperTextChildNodeType,
  HyperTextNodeType,
  HyperTextPropsType,
} from "./types";
import { withoutNulls } from "./utils/arrays";

/**
 * Defines the Virtual DOM tree node types
 * Text: for empty or value based nodes
 * Element: Most HTML nodes (div, p, button, ul, etc.)
 * Fragment: Empty tags <></> used to house other elements within it
 */
export const DOM_TYPES: DomNodeType = {
  TEXT: "text",
  ELEMENT: "element",
  FRAGMENT: "fragment",
};

/**
 * Defines HTML Element Nodes
 * h() hyperscript method
 * @param tag string, tag of the node
 * @param props HyperTextPropsType, the props of the element
 * @param children HyperTextChildNodeType[], the children nodes
 * @returns HyperTextNodeType, the HTML Element
 */
export const h = (
  tag: string,
  props: HyperTextPropsType = {},
  children: HyperTextChildNodeType[] = []
): HyperTextNodeType => {
  return {
    type: DOM_TYPES.ELEMENT,
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
  };
};

/**
 * Filters NULL nodes within the children
 * Used for conditional rendering where we don't want to render empty nodes
 * NULL nodes shouldn't be added to the DOM
 * @param children HyperTextChildNodeType[], the child nodes to evaluate
 * @returns a filtered array of child nodes
 */
export const mapTextNodes = (children: HyperTextChildNodeType[]) => {
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
