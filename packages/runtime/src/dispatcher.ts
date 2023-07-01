import { VoidFunctionType } from "./types";

/* eslint-disable @typescript-eslint/no-empty-function */
export class Dispatcher {
  #subs = new Map(); // Store the registered handlers by event name
  #afterHandlers: VoidFunctionType[] = [];

  /**
   * Registers an handler function that executes in response to a specific command
   * being dispatched and returns a function that un-registers the handler.
   *
   * @param {string} commandName the name of the command to register the handler for
   * @param {(any) => void} handler the handler of the command
   * @returns {() => void} a function that un-registers the handler
   */
  subscribe = (
    commandName: string,
    handler: (any) => void
  ): VoidFunctionType => {
    if (!this.#subs.has(commandName)) {
      this.#subs.set(commandName, []);
    }

    const handlers = this.#subs.get(commandName);
    if (handlers.includes(handler)) {
      return () => {};
    }

    handlers.push(handler);

    return () => {
      const idx = handlers.indexOf(handler);
      handlers.splice(idx, 1);
    };
  };

  /**
   * Registers a handler function that runs after each command and returns a
   * function that un-registers the handler.
   *
   * @param {() => void} handler a function that runs after each command
   * @returns {() => void} a function that un-registers the handler
   */
  afterEveryCommand = (handler: VoidFunctionType): VoidFunctionType => {
    this.#afterHandlers.push(handler);

    return () => {
      const idx = this.#afterHandlers.indexOf(handler);
      this.#afterHandlers.splice(idx, 1);
    };
  };
}
