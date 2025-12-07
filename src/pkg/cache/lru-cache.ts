import { ICollection } from "../interfaces"

/**
 * Node in the LRU cache doubly linked list.
 * Stores key-value pairs with prev/next pointers for O(1) reordering.
 */
class LRUNode<K, V> {
  constructor(
    public key: K,
    public value: V,
    public prev: LRUNode<K, V> | null = null,
    public next: LRUNode<K, V> | null = null
  ) {}
}

/**
 * High-performance LRU (Least Recently Used) Cache implementation.
 * 
 * Combines a doubly linked list with a hash map to achieve O(1) time complexity
 * for all operations: get, put, and delete.
 * 
 * Strategy:
 * - Most recently used items are kept at the HEAD
 * - Least recently used items are at the TAIL
 * - When capacity is exceeded, the TAIL node is evicted
 * 
 * Performance Characteristics:
 * - get(key): O(1)
 * - put(key, value): O(1)
 * - delete(key): O(1)
 * - All operations maintain cache consistency
 * 
 * Use Cases:
 * - API response caching
 * - Database query result caching
 * - Computed value memoization
 * - Session management
 * 
 * @example
 * ```typescript
 * const cache = new LRUCache<string, number>(3);
 * cache.put('a', 1);
 * cache.put('b', 2);
 * cache.put('c', 3);
 * cache.get('a'); // Returns 1, 'a' is now most recent
 * cache.put('d', 4); // Evicts 'b' (least recently used)
 * ```
 */
export class LRUCache<K, V> implements ICollection<V> {
  private capacity: number;
  private cache: Map<K, LRUNode<K, V>>;
  private head: LRUNode<K, V> | null = null;
  private tail: LRUNode<K, V> | null = null;
  private _size = 0;

  // Statistics for monitoring
  private _hits = 0;
  private _misses = 0;
  private _evictions = 0;

  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new Error('LRUCache capacity must be greater than 0');
    }
    this.capacity = capacity;
    this.cache = new Map();
  }

  /**
   * Returns the current number of items in the cache.
   */
  get size(): number {
    return this._size;
  }

  /**
   * Returns the maximum capacity of the cache.
   */
  get maxCapacity(): number {
    return this.capacity;
  }

  /**
   * Returns cache hit count (for monitoring).
   */
  get hits(): number {
    return this._hits;
  }

  /**
   * Returns cache miss count (for monitoring).
   */
  get misses(): number {
    return this._misses;
  }

  /**
   * Returns eviction count (for monitoring).
   */
  get evictions(): number {
    return this._evictions;
  }

  /**
   * Returns cache hit rate (0.0 to 1.0).
   */
  get hitRate(): number {
    const total = this._hits + this._misses;
    return total === 0 ? 0 : this._hits / total;
  }

  /**
   * Checks if the cache is empty.
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Checks if the cache is at full capacity.
   */
  isFull(): boolean {
    return this._size >= this.capacity;
  }

  /**
   * Retrieves a value from the cache.
   * Moves the accessed item to the head (most recently used).
   * Time Complexity: O(1)
   * 
   * @param key - The key to look up
   * @returns The cached value, or undefined if not found
   */
  get(key: K): V | undefined {
    const node = this.cache.get(key);
    
    if (!node) {
      this._misses++;
      return undefined;
    }

    this._hits++;
    
    // Move accessed node to head (most recently used)
    this.moveToHead(node);
    
    return node.value;
  }

  /**
   * Inserts or updates a key-value pair in the cache.
   * If the key exists, updates the value and moves to head.
   * If the cache is full, evicts the least recently used item.
   * Time Complexity: O(1)
   * 
   * @param key - The key to insert/update
   * @param value - The value to store
   * @returns The LRUCache instance for chaining
   */
  put(key: K, value: V): this {
    let node = this.cache.get(key);

    if (node) {
      // Update existing node
      node.value = value;
      this.moveToHead(node);
    } else {
      // Create new node
      node = new LRUNode(key, value);
      this.cache.set(key, node);
      this.addToHead(node);
      this._size++;

      // Evict if over capacity
      if (this._size > this.capacity) {
        this.evictTail();
      }
    }

    return this;
  }

  /**
   * Checks if a key exists in the cache.
   * Does NOT update access order.
   * Time Complexity: O(1)
   * 
   * @param key - The key to check
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * Removes a key-value pair from the cache.
   * Time Complexity: O(1)
   * 
   * @param key - The key to delete
   * @returns true if the key existed, false otherwise
   */
  delete(key: K): boolean {
    const node = this.cache.get(key);
    
    if (!node) return false;

    this.removeNode(node);
    this.cache.delete(key);
    this._size--;
    
    return true;
  }

  /**
   * Peeks at a value without updating access order.
   * Useful for inspection without affecting LRU ordering.
   * Time Complexity: O(1)
   * 
   * @param key - The key to peek at
   */
  peek(key: K): V | undefined {
    const node = this.cache.get(key);
    return node?.value;
  }

  /**
   * Returns the most recently used key-value pair.
   */
  getMostRecent(): [K, V] | undefined {
    if (!this.head) return undefined;
    return [this.head.key, this.head.value];
  }

  /**
   * Returns the least recently used key-value pair.
   */
  getLeastRecent(): [K, V] | undefined {
    if (!this.tail) return undefined;
    return [this.tail.key, this.tail.value];
  }

  /**
   * Removes all items from the cache.
   * Resets all statistics.
   */
  clear(): void {
    // Break circular references to prevent memory leaks
    let current = this.head;
    while (current !== null) {
      const next = current.next;
      current.prev = null;
      current.next = null;
      current = next;
    }

    this.cache.clear();
    this.head = null;
    this.tail = null;
    this._size = 0;
    this._hits = 0;
    this._misses = 0;
    this._evictions = 0;
  }

  /**
   * Resets statistics without clearing the cache.
   */
  resetStats(): void {
    this._hits = 0;
    this._misses = 0;
    this._evictions = 0;
  }

  /**
   * Checks if the cache contains a specific value.
   * Note: This is O(n) operation.
   * 
   * @param value - The value to search for
   */
  contains(value: V): boolean {
    for (const node of this.cache.values()) {
      if (node.value === value) return true;
    }
    return false;
  }

  /**
   * Converts the cache to an array of values.
   * Values are ordered from most recently used to least recently used.
   */
  toArray(): V[] {
    const result: V[] = [];
    let current = this.head;
    while (current !== null) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  /**
   * Returns an array of [key, value] entries.
   * Ordered from most recently used to least recently used.
   */
  entries(): [K, V][] {
    const result: [K, V][] = [];
    let current = this.head;
    while (current !== null) {
      result.push([current.key, current.value]);
      current = current.next;
    }
    return result;
  }

  /**
   * Returns an array of all keys.
   * Ordered from most recently used to least recently used.
   */
  keys(): K[] {
    const result: K[] = [];
    let current = this.head;
    while (current !== null) {
      result.push(current.key);
      current = current.next;
    }
    return result;
  }

  /**
   * Iterates over each entry in the cache.
   * Ordered from most recently used to least recently used.
   */
  forEach(callback: (value: V, key: K, index: number) => void): void {
    let current = this.head;
    let index = 0;
    while (current !== null) {
      callback(current.value, current.key, index);
      current = current.next;
      index++;
    }
  }

  /**
   * Returns cache statistics for monitoring and debugging.
   */
  getStats() {
    return {
      size: this._size,
      capacity: this.capacity,
      hits: this._hits,
      misses: this._misses,
      evictions: this._evictions,
      hitRate: this.hitRate,
      utilization: this._size / this.capacity,
    };
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Adds a node to the head of the list (most recently used).
   */
  private addToHead(node: LRUNode<K, V>): void {
    node.prev = null;
    node.next = this.head;

    if (this.head !== null) {
      this.head.prev = node;
    }

    this.head = node;

    if (this.tail === null) {
      this.tail = node;
    }
  }

  /**
   * Removes a node from the list.
   */
  private removeNode(node: LRUNode<K, V>): void {
    if (node.prev !== null) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next !== null) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }

    // Clear references to help GC
    node.prev = null;
    node.next = null;
  }

  /**
   * Moves a node to the head of the list.
   */
  private moveToHead(node: LRUNode<K, V>): void {
    if (node === this.head) return; // Already at head
    
    this.removeNode(node);
    this.addToHead(node);
  }

  /**
   * Evicts the tail node (least recently used).
   */
  private evictTail(): void {
    if (this.tail === null) return;

    const evictedKey = this.tail.key;
    this.removeNode(this.tail);
    this.cache.delete(evictedKey);
    this._size--;
    this._evictions++;
  }
}