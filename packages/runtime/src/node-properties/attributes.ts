import { ValueType } from "../types/common";
import { ElementNodePropsType } from "../types/elementTypes";

/**
 * Sets the attributes of an element.
 *
 * It doesn't remove attributes that are not present in the new attributes,
 * except in the case of the `class` attribute.
 *
 * @param {HTMLElement} el target element
 * @param {ElementNodePropsType} attrs attributes to set
 */
export const setAttributes = (el: HTMLElement, attrs: ElementNodePropsType) => {
  const { class: className, style, ...otherAttrs } = attrs;

  if (className) {
    setClass(el, className);
  }

  if (style) {
    Object.entries(style).forEach(([prop, value]) => {
      setStyle(el, prop, value);
    });
  }

  for (const [name, value] of Object.entries(otherAttrs)) {
    setAttribute(el, name, value.value ? value.value : "");
  }
};

/**
 * Sets the class attribute
 * @param el
 * @param className
 */
const setClass = (el, className) => {
  el.className = "";

  // The DOM Element doesn't have a class property
  // Instead it has className and classList
  // Allows users to set the class attribute in two ways:
  // Either as a string or as an array of string items
  if (typeof className === "string") {
    el.className = className; // Detect single className and add it
  }

  if (Array.isArray(className)) {
    el.classList.add(...className); // Detects that className is an array and adds it to classList
  }
};

/**
 * Sets user-defined style on the DOM element
 * @param el
 * @param name
 * @param value
 */
export const setStyle = (el, name, value) => {
  el.style[name] = value;
};

/**
 * Removes user-defined style from the DOM element
 * @param el
 * @param name
 */
export const removeStyle = (el, name) => {
  el.style[name] = null;
};

/**
 * Sets the attribute on the element.
 *
 * @param {Element} el The element to add the attribute to
 * @param {string} name The name of the attribute
 * @param {ValueType} value The value of the attribute
 */
export const setAttribute = (el: Element, name: string, value: ValueType) => {
  if (value == null) {
    // Null value, remove it from the DOM
    removeAttribute(el, name);
  } else if (name.startsWith("data-")) {
    el.setAttribute(name, "" + value);
  } else {
    el[name] = value;
  }
};

/**
 * Removes the attribute from the element.
 *
 * @param {Element} el the element where the attribute is set
 * @param {string} name name of the attribute
 */
export const removeAttribute = (el: Element, name: string): void => {
  el[name] = null;
  el.removeAttribute(name);
};
