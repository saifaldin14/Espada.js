import { removeEventListeners } from "../node-properties/events";
import { DOM_TYPES } from "../utils/consts";
import { VNode } from "../types/common";
import { assert } from "../utils/assert";
import { vTextNode } from "../types/textTypes";
import { vElementNode } from "../types/elementTypes";
import { vFragmentNode } from "../types/fragmentTypes";

/**
 * Unmounts the DOM nodes for a virtual DOM tree recursively.
 *
 * Removes all `el` references from the vDOM tree and removes all the event
 * listeners from the DOM.
 *
 * @param {VNode} vDOM the virtual DOM node to destroy
 */
export const destroyDOM = (vDOM: VNode) => {
  const { type, el } = vDOM;
  assert(!!el, "Can only destroy DOM nodes that have been mounted");

  switch (type) {
    case DOM_TYPES.TEXT: {
      removeTextNode(vDOM as vTextNode);
      break;
    }

    case DOM_TYPES.ELEMENT: {
      removeElementNode(vDOM as vElementNode);
      break;
    }

    case DOM_TYPES.FRAGMENT: {
      removeFragmentNodes(vDOM as vFragmentNode);
      break;
    }

    default: {
      throw new Error(`Can't destroy DOM of type: ${type}`);
    }
  }

  delete vDOM.el;
};

/**
 * Destroys a Text node
 * @param {vTextNode} vDOM
 */
const removeTextNode = (vDOM: vTextNode) => {
  const { el } = vDOM;
  if (el) el.remove();
};

/**
 * Destroys an HTMLElement node and removes its children
 * recursively as well as its Event handlers
 * @param {vElementNode} vDOM
 */
const removeElementNode = (vDOM: vElementNode) => {
  const { el, children, listeners } = vDOM;

  if (el) {
    el.remove();
    children.forEach(destroyDOM);

    if (listeners) {
      removeEventListeners(listeners, el);
      delete vDOM.listeners;
    }
  }
};

/**
 * Destroys a Fragment
 * Recursively loops through its children deletes them separately
 * @param {vFragmentNode} vDOM
 */
const removeFragmentNodes = (vDOM: vFragmentNode) => {
  const { children } = vDOM;
  children.forEach(destroyDOM);
};
