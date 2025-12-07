/**
 * Utility types for Aethel.TS data structures
 */

/**
 * Represents types that can be compared using standard comparison operators.
 * This includes primitives that have a natural ordering.
 */
export type Comparable<T> = T extends number | string | Date | boolean ? T : never;

/**
 * Comparator function type for custom comparison logic.
 * @returns negative if a < b, zero if a === b, positive if a > b
 */
export type ComparatorFn<T> = (a: T, b: T) => number;

/**
 * Default comparator for comparable types.
 */
export function defaultComparator<T>(a: T, b: T): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Equality comparison function type.
 */
export type EqualityFn<T> = (a: T, b: T) => boolean;

/**
 * Default equality function using strict equality.
 */
export function defaultEquality<T>(a: T, b: T): boolean {
  return a === b;
}

/**
 * Hash function type for hash-based data structures.
 */
export type HashFn<T> = (value: T) => number;

/**
 * Simple hash function for primitive types.
 */
export function defaultHash<T>(value: T): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = ((hash << 5) - hash) + value.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    return hash;
  }
  if (typeof value === 'boolean') return value ? 1 : 0;
  // For objects, use a simple approach (not cryptographically secure)
  return defaultHash(JSON.stringify(value));
}