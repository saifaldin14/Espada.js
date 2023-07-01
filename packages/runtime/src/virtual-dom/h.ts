/* eslint-disable @typescript-eslint/no-explicit-any */
import { DOM_TYPES } from "../utils/consts";
import { VNode } from "../types/common";
import { ElementNodePropsType, vElementNode } from "../types/elementTypes";
import { vFragmentNode } from "../types/fragmentTypes";
import { vTextNode } from "../types/textTypes";
import { withoutNulls } from "../utils/arrays";

/**
 * Hypertext function: creates a virtual node representing an element with
 * the passed in tag.
 *
 * The props are added to the element as attributes.
 * There are some special props:
 * - `on`: an object containing event listeners to add to the element
 * - `class`: a string or array of strings to add to the element's class list
 * - `style`: an object containing CSS properties to add to the element's style
 *
 * The children are added to the element as child nodes.
 * If a child is a string, it is converted to a text node using `hString()`.
 *
 * @param {string} tag the tag name of the element
 * @param {ElementNodePropsType} props the props to add to the element
 * @param {VNode[]} children the children to add to the element
 * @returns {vElementNode} the virtual node
 */
export const h = (
  tag: string,
  props: ElementNodePropsType = {},
  children: unknown[] = []
): vElementNode => {
  return {
    type: DOM_TYPES.ELEMENT,
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
  };
};

/**
 * Transforms strings into text virtual nodes
 * @param {VNode[]} children list of child nodes
 * @returns transformed array of child nodes with text virtual nodes
 */
export const mapTextNodes = (children: VNode[]) => {
  return children.map((child) =>
    typeof child === "string" ? hString(child) : child
  );
};

/**
 * Creates a text virtual node.
 *
 * @param {string} str the text to add to the text node
 * @returns {vTextNode} the virtual node
 */
export const hString = (val: string): vTextNode => {
  return { type: DOM_TYPES.TEXT, value: val };
};

/**
 * Wraps the virtual nodes in a fragment.
 *
 * If a child is a string, it is converted to a text node using `hString()`.
 *
 * @param {VNode[]} vNodes the virtual nodes to wrap in a fragment
 * @returns {vFragmentNode} the virtual node
 */
export const hFragment = (vNodes: VNode[]): vFragmentNode => {
  return {
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNulls(vNodes)),
  };
};

/**
 * Extracts the children of a virtual node. If one of the children is a
 * fragment, its children are extracted and added to the list of children.
 * In other words, the fragments are replaced by their children.
 *
 * @param {vFragmentNode} vDOM
 * @returns {VNode[]} the children of the virtual node
 */
export function extractChildren(vDOM: vFragmentNode): VNode[] {
  if (vDOM.children == null) {
    return [];
  }

  const children: any = [];

  for (const child of vDOM.children) {
    if (child.type === DOM_TYPES.FRAGMENT) {
      children.push(...extractChildren(child as vFragmentNode), children);
    } else {
      children.push(child);
    }
  }

  return children;
}

/**
 * Takes in a number, and returns a virtual DOM
 * consisting of a fragment with as many paragraphs
 * as the number passed
 * @param num string, Number of paragraphs
 * @returns fragment node with all of the paragraphs
 */
export const lipsum = (num: number) => {
  const paragraph =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return hFragment(Array(num).fill(h("p", {}, [paragraph])));
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
): vElementNode => {
  const cssClass = `message--${level}`;
  return h("div", { class: cssClass }, [message]);
};
