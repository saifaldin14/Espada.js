import {
  DomNodeType,
  HyperTextChildNodeType,
  ElementNodeType,
  HyperTextPropsType,
  TextNodeType,
  FragmentNodeType,
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
): ElementNodeType => {
  return {
    type: DOM_TYPES.ELEMENT,
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
  };
};

/**
 * Transforms strings into text virtual nodes
 * @param children HyperTextChildNodeType[], list of child nodes
 * @returns transformed array of child nodes with text virtual nodes
 */
export const mapTextNodes = (children: HyperTextChildNodeType[]) => {
  return children.map((child) =>
    typeof child === "string" ? hString(child) : child
  );
};

/**
 * Transforms text to text virtual nodes
 * @param str string, text to transform
 * @returns Text node
 */
export const hString = (val: string): TextNodeType => {
  return { type: DOM_TYPES.TEXT, value: val };
};

/**
 * Creates fragment virtual nodes
 * @param vNodes
 * @returns
 */
export const hFragment = (vNodes): FragmentNodeType => {
  return {
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNulls(vNodes)),
  };
};
