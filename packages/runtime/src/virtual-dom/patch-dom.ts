/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  removeAttribute,
  removeStyle,
  setAttribute,
  setStyle,
} from "../attributes";
import { ARRAY_DIFF_OP, DOM_TYPES } from "../consts";
import { destroyDOM } from "./destroy-dom";
import { addEventListener } from "../events";
import { extractChildren } from "../h";
import { mountDOM } from "./mount-dom";
import { areNodesEqual } from "../nodes-equal";
import { VNode } from "../types/common";
import { vElementNode } from "../types/elementTypes";
import { vFragmentNode } from "../types/fragmentTypes";
import { vTextNode } from "../types/textTypes";
import { arraysDiff, arraysDiffSequence } from "../utils/arrays";
import { objectsDiff } from "../utils/objects";
import { isNotBlankOrEmptyString } from "../utils/strings";

/**
 * Patches the DOM by comparing the `oldVdom` and `newVdom` virtual nodes and
 * finding the changes that need to be applied to the DOM.
 *
 * This function requires the `oldVdom` tree to have an `el` property set in
 * all its nodes, that is, the `oldVdom` tree must have been mounted before.
 *
 * The function sets the `el` property in the `newVdom` tree to the same
 * elements as in the `oldVdom` tree, but with the changes applied. If a node
 * in the new tree is new, it'll be mounted and its `el` property set.
 *
 * @param {VNode} oldVdom the old virtual dom
 * @param {VNode} newVdom the new virtual dom
 * @param {Node} parentEl the parent element
 * @returns {Element} the patched element
 */
export function patchDOM(oldVdom: VNode, newVdom: VNode, parentEl: any) {
  if (!areNodesEqual(oldVdom, newVdom)) {
    const index = Array.from(parentEl.childNodes).indexOf(oldVdom.el);
    destroyDOM(oldVdom);
    mountDOM(newVdom, parentEl, index);

    return newVdom;
  }

  newVdom.el = oldVdom.el;

  switch (newVdom.type) {
    case DOM_TYPES.TEXT: {
      patchText(oldVdom as vTextNode, newVdom as vTextNode);
      return newVdom;
    }

    case DOM_TYPES.ELEMENT: {
      patchElement(oldVdom as vElementNode, newVdom as vElementNode);
      break;
    }
  }

  patchChildren(oldVdom, newVdom);

  return newVdom;
}

/**
 * Patches a text virtual node.
 *
 * If the `newVdom.value` (its text content) is different from the `oldVdom.value`,
 * the `Text` node `nodeValue` property is updated with the new value.
 *
 * @param {vTextNode} oldVdom The old virtual node
 * @param {vTextNode} newVdom The new virtual node
 */
function patchText(oldVdom: vTextNode, newVdom: vTextNode) {
  const el = oldVdom.el;
  if (el) {
    const { value: oldText } = oldVdom;
    const { value: newText } = newVdom;

    if (oldText !== newText) {
      el.nodeValue = newText;
    }
  }
}

/**
 * Patches an element virtual node.
 *
 * Patching an element requires to patch its attributes, class, style and events.
 * (The element's children are patched separately.)
 *
 * @param {vElementNode} oldVdom the old virtual node
 * @param {vElementNode} newVdom the new virtual node
 */
function patchElement(oldVdom: vElementNode, newVdom: vElementNode) {
  const el = oldVdom.el;
  const {
    class: oldClass,
    style: oldStyle,
    on: oldEvents,
    ...oldAttrs
  } = oldVdom.props;
  const {
    class: newClass,
    style: newStyle,
    on: newEvents,
    ...newAttrs
  } = newVdom.props;
  const { listeners: oldListeners } = oldVdom;

  patchAttrs(el, oldAttrs, newAttrs);
  patchClasses(el, oldClass, newClass);
  patchStyles(el, oldStyle, newStyle);
  newVdom.listeners = patchEvents(el, oldListeners, oldEvents, newEvents);
}

/**
 * Patches the attributes of an element virtual node.
 *
 * The attributes are patched by removing the old attributes and setting the value
 * of the new and modified attributes.
 *
 * @param {Element} el the element to patch
 * @param {Object.<string, string>} oldAttrs the attributes of the old virtual node
 * @param {Object.<string, string>} newAttrs the attributes of the new virtual node
 */
function patchAttrs(el, oldAttrs, newAttrs) {
  const { added, removed, updated } = objectsDiff(oldAttrs, newAttrs);

  for (const attr of removed) {
    removeAttribute(el, attr);
  }

  for (const attr of added.concat(updated)) {
    setAttribute(el, attr, newAttrs[attr]);
  }
}

/**
 * Patches the class(es) of an element.
 *
 * The class(es) are patched by removing the old class(es) and adding the new
 * and modified class(es).
 *
 * @param {Node} el The element to patch
 * @param {string[]|string} [oldClass] the class(es) of the old virtual node
 * @param {string[]|string} [newClass] the class(es) of the new virtual node
 */
function patchClasses(el, oldClass, newClass) {
  const oldClasses = toClassList(oldClass);
  const newClasses = toClassList(newClass);

  const { added, removed } = arraysDiff(oldClasses, newClasses);

  if (removed.length > 0) {
    el.classList.remove(...removed);
  }
  if (added.length > 0) {
    el.classList.add(...added);
  }
}

/**
 * Extracts a list of classes from the given class string or array.
 * If the given class is undefined, an empty array is returned.
 *
 * @param {(string[]|string} [classes] the class string or array
 * @returns {string[]} the class list
 */
function toClassList(classes = "") {
  return Array.isArray(classes)
    ? classes.filter(isNotBlankOrEmptyString)
    : classes.split(/(\s+)/).filter(isNotBlankOrEmptyString);
}

/**
 * Patches the style of an element.
 *
 * The style is patched by removing the styles that were in the old virtual node
 * but not in the new virtual node, and by setting the value of the new and
 * modified styles.
 *
 * @param {Node} el the element to patch
 * @param {Object.<string, string>} [oldStyle] the style object of the old virtual node
 * @param {Object.<string, string>} [newStyle] the style object of the new virtual node
 */
function patchStyles(el, oldStyle = {}, newStyle = {}) {
  const { added, removed, updated } = objectsDiff(oldStyle, newStyle);

  for (const style of removed) {
    removeStyle(el, style);
  }

  for (const style of added.concat(updated)) {
    setStyle(el, style, newStyle[style]);
  }
}

/**
 * Patches the event listeners of an element.
 *
 * The events are patched by removing the event listeners that were removed or
 * modified in the new virtual node, and by adding the added and modified event
 * listeners.
 *
 * @param {Element} el the element to patch
 * @param {Object.<string, Function>} oldListeners the listeners added to the DOM
 * @param {Object.<string, Function>} oldEvents the events of the old virtual node
 * @param {Object.<string, Function>} newEvents the events of the new virtual node
 * @returns {Object.<string, Function>} the listeners that were added
 */
function patchEvents(el, oldListeners = {}, oldEvents = {}, newEvents = {}) {
  const { removed, added, updated } = objectsDiff(oldEvents, newEvents);

  for (const eventName of removed.concat(updated)) {
    el.removeEventListener(eventName, oldListeners[eventName]);
  }

  const addedListeners = {};

  for (const eventName of added.concat(updated)) {
    const listener = addEventListener(eventName, newEvents[eventName], el);
    addedListeners[eventName] = listener;
  }

  return addedListeners;
}

/**
 * Patches the children of a virtual node.
 *
 * To patch two virtual nodes' children, the `arraysDiffSequence` function
 * is used to compute a sequence of operations that transform the old
 * children array into the new children array. For each operation, the
 * corresponding DOM modification is performed:
 *
 * - `ARRAY_DIFF_OP.ADD`: the new child is mounted in the DOM at the given index
 * - `ARRAY_DIFF_OP.REMOVE`: the old child is removed from the DOM
 * - `ARRAY_DIFF_OP.MOVE`: the old child's element is moved to its new index and the nodes are passed to the `patchDOM` function
 * - `ARRAY_DIFF_OP.NOOP`: both virtual nodes are passed to the `patchDOM` function
 *
 * @param {VNode} oldVdom The old virtual node
 * @param {VNode} newVdom the new virtual node
 */
function patchChildren(oldVdom: VNode, newVdom: VNode) {
  const oldChildren = extractChildren(oldVdom as vFragmentNode);
  const newChildren = extractChildren(newVdom as vFragmentNode);
  const parentEl = oldVdom.el;

  if (parentEl) {
    const diffSeq = arraysDiffSequence(oldChildren, newChildren, areNodesEqual);

    for (const operation of diffSeq) {
      const { originalIndex, index, item } = operation;

      switch (operation.op) {
        case ARRAY_DIFF_OP.ADD: {
          mountDOM(item, parentEl as HTMLElement, index);
          break;
        }

        case ARRAY_DIFF_OP.REMOVE: {
          destroyDOM(item);
          break;
        }

        case ARRAY_DIFF_OP.MOVE: {
          const oldChild = oldChildren[originalIndex];
          const newChild = newChildren[index];
          const el = oldChild.el;
          const elAtTargetIndex = parentEl.childNodes[index];

          if (el) {
            parentEl.insertBefore(el, elAtTargetIndex);
            patchDOM(oldChild, newChild, parentEl);
          }

          break;
        }

        case ARRAY_DIFF_OP.NOOP: {
          patchDOM(oldChildren[originalIndex], newChildren[index], parentEl);
          break;
        }
      }
    }
  }
}
