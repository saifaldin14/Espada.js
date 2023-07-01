import { destroyDOM } from "./virtual-dom/destroy-dom";
import { Dispatcher } from "./node-properties/dispatcher";
import { mountDOM } from "./virtual-dom/mount-dom";
import { patchDOM } from "./virtual-dom/patch-dom";
import { VNode } from "./types/common";
/**
 * Creates an application with the given top-level view, initial state and reducers.
 * A reducer is a function that takes the current state and a payload and returns
 * the new state.
 *
 * @param {object} config the configuration object, containing the view, reducers and initial state
 * @returns {object} the app object
 */
export function createApp({ state, view, reducers = {} }) {
  let parentEl: HTMLElement | null = null;
  let vDOM: VNode | null = null;

  const dispatcher = new Dispatcher();
  const subscriptions = [dispatcher.afterEveryCommand(renderApp)];

  function emit(eventName, payload) {
    dispatcher.dispatch(eventName, payload);
  }

  // Attach reducers
  // Reducer = f(state, payload) => state
  for (const actionName in reducers) {
    const reducer = reducers[actionName];

    const subs = dispatcher.subscribe(actionName, (payload) => {
      state = reducer(state, payload);
    });
    subscriptions.push(subs);
  }

  /**
   * Renders the application, by reconciling the new and previous virtual DOM
   * trees and doing the necessary DOM updates.
   */
  function renderApp() {
    const newVDOM = view(state, emit);
    if (vDOM) vDOM = patchDOM(vDOM, newVDOM, parentEl);
  }

  return {
    /**
     * Mounts the application to the given host element.
     *
     * @param {Element} _parentEl the host element to mount the virtual DOM node to
     * @returns {object} the application object
     */
    mount(_parentEl: Element) {
      parentEl = _parentEl as HTMLElement;
      vDOM = view(state, emit);
      if (vDOM) mountDOM(vDOM, parentEl as HTMLElement, null);

      return this;
    },

    /**
     * Unmounts the application from the host element by destroying the associated
     * DOM and unsubscribing all subscriptions.
     */
    unmount() {
      if (vDOM) destroyDOM(vDOM);
      vDOM = null;
      subscriptions.forEach((unsubscribe) => unsubscribe());
    },

    /**
     * Emits an event to the application.
     *
     * @param {string} eventName the name of the event to emit
     * @param {any} payload the payload to pass to the event listeners
     */
    emit(eventName: string, payload) {
      emit(eventName, payload);
    },
  };
}
