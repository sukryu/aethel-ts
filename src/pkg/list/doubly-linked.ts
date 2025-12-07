import { ICollection } from "../interfaces/collection.inteface";
import { IIterable } from "../interfaces/iterable.interface";
import { EqualityFn, defaultEquality } from '../../types.js';

/**
 * Node in a doubly linked list.
 */
class DoublyLinkedListNode<T> {
  constructor(
    public value: T,
    public prev: DoublyLinkedListNode<T> | null = null,
    public next: DoublyLinkedListNode<T> | null = null
  ) {}
}

/**
 * A high-performance doubly linked list implementation.
 * 
 * Performance Characteristics:
 * - addFirst/addLast: O(1)
 * - removeFirst/removeLast: O(1)
 * - get(index): O(n)
 * - remove(index): O(n)
 * 
 * Memory: O(n) where n is the number of elements
 */
export class DoublyLinkedList<T> implements ICollection<T>, IIterable<T> {
  private head: DoublyLinkedListNode<T> | null = null;
  private tail: DoublyLinkedListNode<T> | null = null;
  private _size = 0;
  private equalityFn: EqualityFn<T>;

  constructor(equalityFn: EqualityFn<T> = defaultEquality) {
    this.equalityFn = equalityFn;
  }

  /**
   * Returns the number of elements in the list.
   */
  get size(): number {
    return this._size;
  }

  /**
   * Checks if the list is empty.
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Adds an element to the beginning of the list.
   * Time Complexity: O(1)
   */
  addFirst(value: T): void {
    const newNode = new DoublyLinkedListNode(value);
    
    if (this.head === null) {
      this.head = this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    
    this._size++;
  }

  /**
   * Adds an element to the end of the list.
   * Time Complexity: O(1)
   */
  addLast(value: T): void {
    const newNode = new DoublyLinkedListNode(value);
    
    if (this.tail === null) {
      this.head = this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    
    this._size++;
  }

  /**
   * Removes and returns the first element.
   * Time Complexity: O(1)
   */
  removeFirst(): T | undefined {
    if (this.head === null) return undefined;
    
    const value = this.head.value;
    this.head = this.head.next;
    
    if (this.head === null) {
      this.tail = null;
    } else {
      this.head.prev = null;
    }
    
    this._size--;
    return value;
  }

  /**
   * Removes and returns the last element.
   * Time Complexity: O(1)
   */
  removeLast(): T | undefined {
    if (this.tail === null) return undefined;
    
    const value = this.tail.value;
    this.tail = this.tail.prev;
    
    if (this.tail === null) {
      this.head = null;
    } else {
      this.tail.next = null;
    }
    
    this._size--;
    return value;
  }

  /**
   * Returns the first element without removing it.
   */
  peekFirst(): T | undefined {
    return this.head?.value;
  }

  /**
   * Returns the last element without removing it.
   */
  peekLast(): T | undefined {
    return this.tail?.value;
  }

  /**
   * Gets the element at the specified index.
   * Time Complexity: O(n)
   */
  get(index: number): T | undefined {
    if (index < 0 || index >= this._size) return undefined;
    
    const node = this.getNodeAt(index);
    return node?.value;
  }

  /**
   * Removes the element at the specified index.
   * Time Complexity: O(n)
   */
  removeAt(index: number): T | undefined {
    if (index < 0 || index >= this._size) return undefined;
    
    if (index === 0) return this.removeFirst();
    if (index === this._size - 1) return this.removeLast();
    
    const node = this.getNodeAt(index);
    if (!node) return undefined;
    
    const value = node.value;
    
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    
    this._size--;
    return value;
  }

  /**
   * Checks if the list contains the specified element.
   */
  contains(element: T): boolean {
    let current = this.head;
    while (current !== null) {
      if (this.equalityFn(current.value, element)) return true;
      current = current.next;
    }
    return false;
  }

  /**
   * Removes all elements from the list.
   * Explicitly breaks circular references to prevent memory leaks.
   */
  clear(): void {
    // Break all node references to help garbage collection
    let current = this.head;
    while (current !== null) {
      const next = current.next;
      // Clear references
      current.prev = null;
      current.next = null;
      current = next;
    }

    this.head = this.tail = null;
    this._size = 0;
  }

  /**
   * Converts the list to an array.
   */
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current !== null) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  /**
   * Iterator implementation for for...of loops.
   */
  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;
    while (current !== null) {
      yield current.value;
      current = current.next;
    }
  }

  /**
   * Executes a callback for each element.
   */
  forEach(callback: (element: T, index: number) => void): void {
    let current = this.head;
    let index = 0;
    while (current !== null) {
      callback(current.value, index);
      current = current.next;
      index++;
    }
  }

  /**
   * Maps elements to a new array.
   */
  map<U>(callback: (element: T, index: number) => U): U[] {
    const result: U[] = [];
    let current = this.head;
    let index = 0;
    while (current !== null) {
      result.push(callback(current.value, index));
      current = current.next;
      index++;
    }
    return result;
  }

  /**
   * Filters elements based on a predicate.
   */
  filter(predicate: (element: T, index: number) => boolean): T[] {
    const result: T[] = [];
    let current = this.head;
    let index = 0;
    while (current !== null) {
      if (predicate(current.value, index)) {
        result.push(current.value);
      }
      current = current.next;
      index++;
    }
    return result;
  }

  /**
   * Tests if at least one element satisfies the predicate.
   */
  some(predicate: (element: T, index: number) => boolean): boolean {
    let current = this.head;
    let index = 0;
    while (current !== null) {
      if (predicate(current.value, index)) return true;
      current = current.next;
      index++;
    }
    return false;
  }

  /**
   * Tests if all elements satisfy the predicate.
   */
  every(predicate: (element: T, index: number) => boolean): boolean {
    let current = this.head;
    let index = 0;
    while (current !== null) {
      if (!predicate(current.value, index)) return false;
      current = current.next;
      index++;
    }
    return true;
  }

  /**
   * Helper method to get node at specific index.
   * Optimizes by starting from head or tail depending on index.
   */
  private getNodeAt(index: number): DoublyLinkedListNode<T> | null {
    if (index < 0 || index >= this._size) return null;
    
    // Optimize by starting from the closer end
    if (index < this._size / 2) {
      let current = this.head;
      for (let i = 0; i < index; i++) {
        current = current!.next;
      }
      return current;
    } else {
      let current = this.tail;
      for (let i = this._size - 1; i > index; i--) {
        current = current!.prev;
      }
      return current;
    }
  }
}