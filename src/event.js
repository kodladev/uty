/**
  Event Listeners
  --------------------------------------------------------------------------------------------------
  A small and customizable event listener.
  --------------------------------------------------------------------------------------------------
*/

/**
 * Creates an event emitter object with methods to emit, listen to, and remove event listeners.
 * @returns {Object} - Event emitter object.
 */
export function event() {
  return {
    e: Object.create(null), // Event listeners by event name
    /**
     * Emits an event with the specified name and passes optional arguments to the listeners.
     * A listener added while the event is being emitted is called from the next emit on.
     * @param {string} event - The name of the event to emit.
     * @param  {...any} args - Optional arguments to pass to the event listeners.
     */
    emit(event, ...args) {
      const callbacks = this.e[event];
      if (!callbacks) return;
      for (let i = 0, c = callbacks.length; i < c; i++) callbacks[i](...args);
    },
    /**
     * Registers an event listener for the specified event.
     * @param {string} event - The name of the event to listen to.
     * @param {Function} callback - The callback function to execute when the event is emitted.
     * @returns {Function} - Function to remove the event listener.
     */
    on(event, callback) {
      const $ = this;
      // A new array on every change keeps an emit in progress on the list it started with
      $.e[event] = ($.e[event] || []).concat(callback);
      return () => {
        if ($.e[event]) $.e[event] = $.e[event].filter(i => callback !== i);
      };
    },
    /**
     * Removes all listeners for the specified event.
     * @param {string} event - The name of the event to remove listeners for.
     */
    off(event) {
      delete this.e[event];
    },
    /**
     * Registers an event listener for the specified event that will only be executed once.
     * @param {string} event - The name of the event to listen to.
     * @param {Function} callback - The callback function to execute when the event is emitted.
     * @returns {Function} - Function to remove the event listener.
     */
    once(event, callback) {
      const unbind = this.on(event, (...args) => {
        unbind();
        callback(...args);
      });
      return unbind;
    },
  };
}

// Global event listeners
const bus = event();

/**
 * Emits an event with the given arguments.
 *
 * @param {string} event - The event name to emit.
 * @param {...any} args - The arguments to pass to the event listeners.
 */
export const emit = (event, ...args) => bus.emit(event, ...args);

/**
 * Registers an event listener for the given event.
 *
 * @param {string} event - The event name to listen for.
 * @param {Function} callback - The callback function to invoke when the event is emitted.
 */
export const on = (event, callback) => bus.on(event, callback);

/**
 * Removes all listeners for the given event.
 *
 * @param {string} event - The event name to remove listeners for.
 */
export const off = event => bus.off(event);

/**
 * Registers an event listener for the given event that will be invoked only once.
 *
 * @param {string} event - The event name to listen for.
 * @param {Function} callback - The callback function to invoke when the event is emitted.
 */
export const once = (event, callback) => bus.once(event, callback);
