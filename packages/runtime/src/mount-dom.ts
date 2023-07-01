import { DOM_TYPES } from "./consts";
import { setAttributes } from "./attributes";
import { addEventListeners } from "./events";
import { VNode } from "./types/common";
import { ElementNodePropsType, vElementNode } from "./types/elementTypes";
import { vTextNode } from "./types/textTypes";
import { vFragmentNode } from "./types/fragmentTypes";

/**
 * Creates the DOM nodes for a virtual DOM tree, mounts them in the DOM, and
 * modifies the vDOM tree to include the corresponding DOM nodes and event listeners.
 *
 * If an index is given, the created DOM node is inserted at that index in the parent element.
 * Otherwise, it is appended to the parent element.
 *
 * @param {VNode} vDOM the virtual DOM node to mount
 * @param {HTMLElement} parentEl the host element to mount the virtual DOM node to
 * @param {number} [index] the index at the parent element to mount the virtual DOM node to
 */
export const mountDOM = (
  vDOM: VNode,
  parentEl: HTMLElement,
  index: number | null
) => {
  if (!index) index = -1;
  switch (vDOM.type) {
    case DOM_TYPES.TEXT: {
      createTextNode(vDOM as vTextNode, parentEl, index);
      break;
    }

    case DOM_TYPES.ELEMENT: {
      createElementNode(vDOM as vElementNode, parentEl, index);
      break;
    }

    case DOM_TYPES.FRAGMENT: {
      createFragmentNodes(vDOM as vFragmentNode, parentEl, index);
      break;
    }

    default: {
      throw new Error(`Can't mount DOM of type: ${vDOM.type}`);
    }
  }
};

/**
 * Creates the text node for a virtual DOM text node.
 * The created `Text` is added to the `el` property of the vDOM.
 *
 * Note that `Text` is a subclass of `CharacterData`, which is a subclass of `Node`,
 * but not of `Element`. Methods like `append()`, `prepend()`, `before()`, `after()`,
 * or `remove()` are not available on `Text` nodes.
 *
 * @param {vTextNode} vDOM the virtual DOM node of type "text"
 * @param {Element} parentEl the host element to mount the virtual DOM node to
 * @param {number} [index] the index at the parent element to mount the virtual DOM node to
 */
function createTextNode(vDOM: vTextNode, parentEl: Element, index: number) {
  const { value } = vDOM;

  const textNode = document.createTextNode(value);
  vDOM.el = textNode;

  insert(textNode as unknown as Element, parentEl, index);
}

/**
 * Creates the nodes for the children of a virtual DOM fragment node and appends them to the
 * parent element.
 *
 * @param {vFragmentNode} vDOM the virtual DOM node of type "fragment"
 * @param {Element} parentEl the host element to mount the virtual DOM node to
 * @param {number} [index] the index at the parent element to mount the virtual DOM node to
 */
function createFragmentNodes(
  vDOM: vFragmentNode,
  parentEl: Element,
  index: number
) {
  const { children } = vDOM;
  vDOM.el = parentEl as unknown as DocumentFragment;

  children.forEach((child, i) =>
    mountDOM(child, parentEl as HTMLElement, index ? index + i : null)
  );
}

/**
 * Creates the HTML element for a virtual DOM element node and its children recursively.
 * The created `Element` is added to the `el` property of the vDOM.
 *
 * If the vDOM includes event listeners, these are added to the vDOM object, under the
 * `listeners` property.
 *
 * @param {vElementNode} vDOM the virtual DOM node of type "element"
 * @param {Element} parentEl the host element to mount the virtual DOM node to
 * @param {number} [index] the index at the parent element to mount the virtual DOM node to
 */
function createElementNode(
  vDOM: vElementNode,
  parentEl: Element,
  index: number
) {
  const { tag, props, children } = vDOM;

  const element = document.createElement(tag);
  addProps(element, props, vDOM);
  vDOM.el = element;

  children.forEach((child) => mountDOM(child, element, null));
  insert(element, parentEl, index);
}

/**
 * Adds the attributes and event listeners to an element.
 *
 * @param {Element} el The element to add the attributes to
 * @param {ElementNodePropsType} props The props to add
 * @param {vElementNode} vDOM The vDOM node
 */
function addProps(
  el: Element,
  props: ElementNodePropsType,
  vDOM: vElementNode
) {
  const { on: events, ...attrs } = props;

  vDOM.listeners = addEventListeners(events, el);
  setAttributes(el as HTMLElement, attrs);
}

/**
 * Inserts `el` into `parentEl` at `index`.
 * If `index` is `null`, the element is appended to the end.
 *
 * @param {Element} el the element to be inserted
 * @param {Element} parentEl the host element
 * @param {number} [index] the index at which the element should be inserted. If null or undefined, it will be appended
 */
function insert(el: Element, parentEl: Element, index: number) {
  // If index is null or undefined, simply append. Note the usage of `==` instead of `===`.
  if (index == null) {
    parentEl.append(el);
    return;
  }

  if (index < 0) {
    throw new Error(`Index must be a positive integer, got ${index}`);
  }

  const children = parentEl.childNodes;

  if (index >= children.length) {
    parentEl.append(el);
  } else {
    parentEl.insertBefore(el, children[index]);
  }
}
