import Benchmark from 'benchmark';
import { DoublyLinkedList } from "../src/index";

/**
 * Benchmark Suite for DoublyLinkedList
 * 
 * Compares Aethel.TS DoublyLinkedList against native JavaScript Array
 * for common operations.
 */

const suite = new Benchmark.Suite();

// Test data sizes
//const SMALL_SIZE = 100;
const MEDIUM_SIZE = 1000;
//const LARGE_SIZE = 10000;

console.log('='.repeat(80));
console.log('Aethel.TS DoublyLinkedList Benchmark Suite');
console.log('='.repeat(80));
console.log('');

// ============================================================================
// Benchmark 1: Sequential Insertion (addLast vs push)
// ============================================================================
console.log('Benchmark 1: Sequential Insertion at End (1000 elements)');
console.log('-'.repeat(80));

suite.add('DoublyLinkedList#addLast', function() {
  const list = new DoublyLinkedList<number>();
  for (let i = 0; i < MEDIUM_SIZE; i++) {
    list.addLast(i);
  }
});

suite.add('Array#push', function() {
  const arr: number[] = [];
  for (let i = 0; i < MEDIUM_SIZE; i++) {
    arr.push(i);
  }
});

// ============================================================================
// Benchmark 2: Head Insertion (addFirst vs unshift)
// ============================================================================
console.log('');
console.log('Benchmark 2: Sequential Insertion at Head (1000 elements)');
console.log('-'.repeat(80));

suite.add('DoublyLinkedList#addFirst', function() {
  const list = new DoublyLinkedList<number>();
  for (let i = 0; i < MEDIUM_SIZE; i++) {
    list.addFirst(i);
  }
});

suite.add('Array#unshift', function() {
  const arr: number[] = [];
  for (let i = 0; i < MEDIUM_SIZE; i++) {
    arr.unshift(i);
  }
});

// ============================================================================
// Benchmark 3: Head Removal (removeFirst vs shift)
// ============================================================================
console.log('');
console.log('Benchmark 3: Sequential Removal from Head (1000 elements)');
console.log('-'.repeat(80));

suite.add('DoublyLinkedList#removeFirst', function() {
  const list = new DoublyLinkedList<number>();
  for (let i = 0; i < MEDIUM_SIZE; i++) {
    list.addLast(i);
  }
  
  while (!list.isEmpty()) {
    list.removeFirst();
  }
});

suite.add('Array#shift', function() {
  const arr: number[] = [];
  for (let i = 0; i < MEDIUM_SIZE; i++) {
    arr.push(i);
  }
  
  while (arr.length > 0) {
    arr.shift();
  }
});

// ============================================================================
// Benchmark 4: Tail Removal (removeLast vs pop)
// ============================================================================
console.log('');
console.log('Benchmark 4: Sequential Removal from Tail (1000 elements)');
console.log('-'.repeat(80));

suite.add('DoublyLinkedList#removeLast', function() {
  const list = new DoublyLinkedList<number>();
  for (let i = 0; i < MEDIUM_SIZE; i++) {
    list.addLast(i);
  }
  
  while (!list.isEmpty()) {
    list.removeLast();
  }
});

suite.add('Array#pop', function() {
  const arr: number[] = [];
  for (let i = 0; i < MEDIUM_SIZE; i++) {
    arr.push(i);
  }
  
  while (arr.length > 0) {
    arr.pop();
  }
});

// ============================================================================
// Benchmark 5: Iteration (forEach)
// ============================================================================
console.log('');
console.log('Benchmark 5: Iteration with forEach (1000 elements)');
console.log('-'.repeat(80));

const preparedList = new DoublyLinkedList<number>();
const preparedArray: number[] = [];
for (let i = 0; i < MEDIUM_SIZE; i++) {
  preparedList.addLast(i);
  preparedArray.push(i);
}

suite.add('DoublyLinkedList#forEach', function() {
  let sum = 0;
  preparedList.forEach((val) => {
    sum += val;
  });
});

suite.add('Array#forEach', function() {
  let sum = 0;
  preparedArray.forEach((val) => {
    sum += val;
  });
});

// ============================================================================
// Benchmark 6: Contains/Search
// ============================================================================
console.log('');
console.log('Benchmark 6: Contains/Search (1000 elements, searching for middle element)');
console.log('-'.repeat(80));

suite.add('DoublyLinkedList#contains', function() {
  preparedList.contains(MEDIUM_SIZE / 2);
});

suite.add('Array#includes', function() {
  preparedArray.includes(MEDIUM_SIZE / 2);
});

// ============================================================================
// Run the benchmark suite
// ============================================================================
suite
  .on('cycle', function(event: Benchmark.Event) {
    console.log(String(event.target));
  })
  .on('complete', function(this: Benchmark.Suite) {
    console.log('');
    console.log('='.repeat(80));
    console.log('Benchmark Complete');
    console.log('='.repeat(80));
    console.log('');
    console.log('Key Findings:');
    console.log('- DoublyLinkedList excels at O(1) head/tail operations');
    console.log('- Array is more efficient for tail-only operations (push/pop)');
    console.log('- DoublyLinkedList provides constant-time head operations');
    console.log('  where Array requires O(n) reindexing');
    console.log('');
  })
  .run({ async: false });