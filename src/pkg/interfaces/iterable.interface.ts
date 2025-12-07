/**
 * Interface for collections that support iteration.
 * Enables use of for...of loops and spread operators.
 */
export interface IIterable<T> {
  /**
   * Returns an iterator over the elements in the collection.
   */
  [Symbol.iterator](): Iterator<T>;

  /**
   * Executes a provided function once for each element.
   * @param callback - Function to execute for each element
   */
  forEach(callback: (element: T, index: number) => void): void;

  /**
   * Creates a new array with the results of calling a provided function
   * on every element in the collection.
   * @param callback - Function that produces an element of the new array
   */
  map<U>(callback: (element: T, index: number) => U): U[];

  /**
   * Creates a new array with all elements that pass the test
   * implemented by the provided function.
   * @param predicate - Function to test each element
   */
  filter(predicate: (element: T, index: number) => boolean): T[];

  /**
   * Tests whether at least one element passes the test
   * implemented by the provided function.
   * @param predicate - Function to test each element
   */
  some(predicate: (element: T, index: number) => boolean): boolean;

  /**
   * Tests whether all elements pass the test
   * implemented by the provided function.
   * @param predicate - Function to test each element
   */
  every(predicate: (element: T, index: number) => boolean): boolean;
}