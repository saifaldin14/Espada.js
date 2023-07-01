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

/**
 * Takes in a number, and returns a virtual DOM
 * consisting of a fragment with as many paragraphs
 * as the number passed
 * @param num string, Number of paragraphs
 * @returns fragment node with all of the paragraphs
 */
export const lipsum = (num: number) => {
  const vNodes: TextNodeType[] = [];
  const paragraph =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  for (let i = 0; i < num; i++) {
    const hNode = hString(paragraph);
    vNodes.push(hNode);
  }

  return hFragment(vNodes);
};

type LevelType = "info" | "warning" | "error";

/**
 * Return a virtual DOM that represents a message box
 * with the message and the corresponding CSS class
 * depending on the level
 * @param level a string that can be either 'info', 'warning', or 'error'
 * @param message a string with the message to display
 * @returns
 */
export const MessageComponent = (
  level: LevelType,
  message: string
): ElementNodeType => {
  const cssClass = `message--${level}`;
  const textNode = hString(message);
  return {
    type: "element",
    tag: "div",
    props: { class: cssClass },
    children: [textNode],
  };
};
