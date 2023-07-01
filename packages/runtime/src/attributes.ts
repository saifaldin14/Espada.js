/**
 * Extracts the attributes that require special handling
 * (the style and class attributes) from the rest of the
 * attributes and then call the setStyle() and setClass()
 * functions to set those attributes, rest are passed to
 * setAttribute()
 * @param el
 * @param attrs
 */
export const setAttributes = (el, attrs) => {
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
    setAttribute(el, name, value);
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
 * Handles setting the attributes for everything other than
 * classes and styles
 * @param el
 * @param name
 * @param value
 */
export const setAttribute = (el, name, value) => {
  if (value == null) {
    // Null value, remove it from the DOM
    removeAttribute(el, name);
  } else if (name.startsWith("data-")) {
    el.setAttribute(name, value);
  } else {
    el[name] = value;
  }
};

/**
 * Removes the attribute from the DOM Element if the value is NULL
 * @param el
 * @param name
 */
export const removeAttribute = (el, name) => {
  el[name] = null;
  el.removeAttribute(name);
};
