/* eslint-disable @typescript-eslint/no-empty-function */
export class Dispatcher {
  #subs = new Map();

  /**
   * Registers an handler function that executes in response to a specific command
   * being dispatched and returns a function that un-registers the handler.
   *
   * @param {string} commandName the name of the command to register the handler for
   * @param {(any) => void} handler the handler of the command
   * @returns {() => void} a function that un-registers the handler
   */
  subscribe = (commandName: string, handler: (any) => void): (() => void) => {
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
}
