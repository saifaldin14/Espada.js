import { removeEventListeners } from "./events";
import { DOM_TYPES } from "./consts";

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

const removeTextNode = (vDOM) => {
  const { el } = vDOM;
  el.remove();
};

const removeElementNode = (vDOM) => {
  const { el, children, listeners } = vDOM;

  el.remove();
  children.forEach(destroyDOM);

  if (listeners) {
    removeEventListeners(listeners, el);
    delete vDOM.listeners;
  }
};

const removeFragmentNodes = (vDOM) => {
  const { children } = vDOM;
  children.forEach(destroyDOM);
};
