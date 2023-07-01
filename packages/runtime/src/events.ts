/**
 * Adds events since the element node is an instance of the EventTarget interface
 * Implemented by all the DOM nodes that can receive events
 * @param eventName
 * @param handler
 * @param el
 * @returns
 */
export const addEventListener = (eventName, handler, el) => {
  el.addEventListener(eventName, handler);
  return handler;
};

/**
 * Adds multiple event listeners in the form of an object to an element node
 * @param listeners
 * @param el
 * @returns
 */
export const addEventListeners = (listeners = {}, el) => {
  const addedListeners = {};

  Object.entries(listeners).forEach(([eventName, handler]) => {
    const listener = addEventListener(eventName, handler, el);
    addedListeners[eventName] = listener;
  });

  return addedListeners;
};

/**
 * Given the names of the event listeners,
 * removes them from the DOM Element
 * @param listeners
 * @param el
 */
export const removeEventListeners = (listeners = {}, el) => {
  Object.entries(listeners).forEach(([eventName, handler]) => {
    el.removeEventListener(eventName, handler);
  });
};
