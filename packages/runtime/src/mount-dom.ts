import { DOM_TYPES } from "./consts";
import { vElementNode, vFragmentNode, vTextNode } from "./types";
import { setAttributes } from "./attributes";
import { addEventListeners } from "./events";

/**
 * Mounts the virtual DOM to the actual DOM
 * Lets the DOM know what to actually render to the screen
 * @param vDOM the Virtual DOM
 * @param parentEl the parent element to render
 */
export const mountDOM = (vDOM, parentEl) => {
  switch (vDOM.type) {
    case DOM_TYPES.TEXT: {
      createTextNode(vDOM, parentEl);
      break;
    }
    case DOM_TYPES.ELEMENT: {
      createElementNode(vDOM, parentEl);
      break;
    }
    case DOM_TYPES.FRAGMENT: {
      createFragmentNodes(vDOM, parentEl);
      break;
    }
    default: {
      throw new Error(`Can't mount DOM of type: ${vDOM.type}`);
    }
  }
};

/**
 * Creates a Text node in the DOM
 * @param vDOM the virtual DOM node
 * @param parentEl
 */
const createTextNode = (vDOM: vTextNode, parentEl) => {
  const { value } = vDOM;

  const textNode = document.createTextNode(value);
  vDOM.el = textNode;

  parentEl.append(textNode);
};

/**
 * Creates a Fragment from the Virtual DOM representation
 * @param vDOM the virtual DOM fragment
 * @param parentEl
 */
const createFragmentNodes = (vDOM: vFragmentNode, parentEl) => {
  const { children } = vDOM;
  vDOM.el = parentEl;

  children.forEach((child) => mountDOM(child, parentEl));
};

/**
 * Creates an HTMLElement from the Virtual DOM representation
 * @param vDOM the virtual DOM element node
 * @param parentEl
 */
const createElementNode = (vDOM: vElementNode, parentEl) => {
  const { tag, props, children } = vDOM;

  const element = document.createElement(tag);
  addProps(element, props, vDOM);
  vDOM.el = element;

  children.forEach((child) => mountDOM(child, element));
  parentEl.append(element);
};

/**
 * Attaches props to the Element Node
 * @param el
 * @param props
 * @param vDOM
 */
const addProps = (el, props, vDOM) => {
  const { on: events, ...attrs } = props;

  vDOM.listeners = addEventListeners(events, el);
  setAttributes(el, attrs);
};
