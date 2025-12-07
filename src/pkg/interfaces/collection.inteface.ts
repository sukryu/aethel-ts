/**
 * Core collection interface that all data structures must implement.
 * Provides fundamental operations for managing elements.
 */
export interface ICollection<T> {
  /**
   * Returns the number of elements in the collection.
   */
  readonly size: number;

  /**
   * Checks if the collection is empty.
   */
  isEmpty(): boolean;

  /**
   * Removes all elements from the collection.
   */
  clear(): void;

  /**
   * Checks if the collection contains the specified element.
   * @param element - The element to search for
   */
  contains(element: T): boolean;

  /**
   * Converts the collection to an array.
   */
  toArray(): T[];
}