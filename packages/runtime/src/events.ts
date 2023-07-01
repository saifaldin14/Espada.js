import { EventHandlerType } from "./types/common";

/**
 * Adds an event listener to an event target and returns the listener.
 *
 * @param {string} eventName the name of the event to listen to
 * @param {EventHandlerType} handler the event handler
 * @param {EventTarget} el the element to add the event listener to
 * @returns {EventHandlerType} the event handler
 */
export const addEventListener = (
  eventName: string,
  handler: EventHandlerType,
  el: EventTarget
): EventHandlerType => {
  el.addEventListener(eventName, handler);
  return handler;
};

/**
 * Adds event listeners to an event target and returns an object containing
 * the added listeners.
 *
 * @param {object} listeners The event listeners to add
 * @param {EventTarget} el The element to add the listeners to
 * @returns {object} The added listeners
 */
export const addEventListeners = (
  listeners: object = {},
  el: EventTarget
): object => {
  const addedListeners = {};

  Object.entries(listeners).forEach(([eventName, handler]) => {
    const listener = addEventListener(eventName, handler, el);
    addedListeners[eventName] = listener;
  });

  return addedListeners;
};

/**
 * Removes the event listeners from an event target.
 *
 * @param {object} listeners the event listeners to remove
 * @param {EventTarget} el the element to remove the event listeners from
 */
export const removeEventListeners = (
  listeners: object = {},
  el: EventTarget
) => {
  Object.entries(listeners).forEach(([eventName, handler]) => {
    el.removeEventListener(eventName, handler);
  });
};
