/**
 * Modern event emitter to replace jQuery Callbacks
 * Provides a simple pub/sub mechanism for events
 */

type CallbackFunction<T = any> = (...args: T[]) => void

/**
 * Event emitter class - replacement for jQuery.Callbacks()
 */
export class EventEmitter<T = any> {
  private callbacks: CallbackFunction<T>[] = []

  /**
   * Add a callback function
   */
  add(callback: CallbackFunction<T>): void {
    if (!this.callbacks.includes(callback)) {
      this.callbacks.push(callback)
    }
  }

  /**
   * Remove a callback function
   */
  remove(callback: CallbackFunction<T>): void {
    const index = this.callbacks.indexOf(callback)
    if (index !== -1) {
      this.callbacks.splice(index, 1)
    }
  }

  /**
   * Fire/trigger all callbacks with given arguments
   */
  fire(...args: T[]): void {
    this.callbacks.forEach((callback) => {
      callback(...args)
    })
  }

  /**
   * Remove all callbacks
   */
  empty(): void {
    this.callbacks = []
  }

  /**
   * Check if there are any callbacks
   */
  has(): boolean {
    return this.callbacks.length > 0
  }
}

/**
 * Create a new event emitter (factory function for backward compatibility)
 */
export function createEventEmitter<T = any>(): EventEmitter<T> {
  return new EventEmitter<T>()
}
