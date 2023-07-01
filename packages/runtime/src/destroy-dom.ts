import { removeEventListeners } from "./events";
import { DOM_TYPES } from "./consts";

/**
 * Destroys the DOM Elements
 * Handles Text, Fragment and Element nodes and removes them
 * @param vDOM
 */
export const destroyDOM = (vDOM) => {
  const { type } = vDOM;

  switch (type) {
    case DOM_TYPES.TEXT: {
      removeTextNode(vDOM);
      break;
    }

    case DOM_TYPES.ELEMENT: {
      removeElementNode(vDOM);
      break;
    }

    case DOM_TYPES.FRAGMENT: {
      removeFragmentNodes(vDOM);
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
 * @param vDOM
 */
const removeTextNode = (vDOM) => {
  const { el } = vDOM;
  el.remove();
};

/**
 * Destroys an HTMLElement node and removes its children
 * recursively as well as its Event handlers
 * @param vDOM
 */
const removeElementNode = (vDOM) => {
  const { el, children, listeners } = vDOM;

  el.remove();
  children.forEach(destroyDOM);

  if (listeners) {
    removeEventListeners(listeners, el);
    delete vDOM.listeners;
  }
};

/**
 * Destroys a Fragment
 * Recursively loops through its children deletes them separately
 * @param vDOM
 */
const removeFragmentNodes = (vDOM) => {
  const { children } = vDOM;
  children.forEach(destroyDOM);
};
