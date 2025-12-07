# Aethel.TS

**High-Performance, Type-Safe Data Structure and Algorithm Library for Node.js**

[![npm version](https://badge.fury.io/js/@sukryu%2Faethel-ts.svg)](https://www.npmjs.com/package/@sukryu/aethel-ts)
[![npm downloads](https://img.shields.io/npm/dm/@sukryu/aethel-ts.svg)](https://www.npmjs.com/package/@sukryu/aethel-ts)
[![license](https://img.shields.io/npm/l/@sukryu/aethel-ts.svg)](https://github.com/sukryu/aethel-ts/blob/main/LICENSE)


## 📥 Installation

```bash
npm install @sukryu/aethel-ts
```

Or with yarn:

```bash
yarn add @sukryu/aethel-ts
```

## 🎯 Project Goals

Aethel.TS challenges the limitations of native JavaScript data structures (Array, Map, Set) in high-throughput Node.js environments by providing custom, production-ready implementations with:

- **Superior Performance**: Optimized data structures that overcome O(N) bottlenecks in native implementations
- **Type Safety**: Full TypeScript support with generics and strict type checking
- **Go-Style Architecture**: Clean, modular design inspired by Go's package structure
- **Data-Driven Validation**: Comprehensive benchmarking to prove measurable performance gains

## 📦 Architecture

```
aethel-ts/
├── src/
│   ├── interfaces/          # Core interfaces (ICollection, IIterable)
│   ├── pkg/                 # Data structure packages (Go-style)
│   │   ├── list/           # List implementations
│   │   ├── queue/          # Queue implementations (planned)
│   │   ├── tree/           # Tree implementations (planned)
│   │   └── hash/           # Hash-based structures (planned)
│   ├── types.ts            # Utility types (Comparable, ComparatorFn, etc.)
│   └── index.ts            # Main export
├── benchmark/              # Performance benchmarks
└── dist/                   # Compiled output
```

## 🚀 Current Features

### Doubly Linked List
- **O(1) Operations**: `addFirst`, `addLast`, `removeFirst`, `removeLast`
- **Full Iterator Support**: Works with `for...of`, `map`, `filter`, etc.
- **Type-Safe Generics**: Compile-time type checking for all operations
- **Custom Equality**: Support for custom equality comparators

### LRU Cache (NEW! 🎉)
- **O(1) All Operations**: `get`, `put`, `delete` - all constant time
- **Automatic Eviction**: Least recently used items removed when capacity reached
- **Built-in Statistics**: Hit rate, miss count, eviction tracking
- **Memory Safe**: Explicit cleanup prevents memory leaks
- **Production Ready**: Used in API caching, database query optimization, session management

## 🔧 Installation & Setup

```bash
# Install dependencies
npm install

# Run type checking
npm run type-check

# Build the library
npm run build

# Run benchmarks
npm run benchmark        # DoublyLinkedList benchmarks
npm run benchmark:cache  # LRUCache benchmarks
npm run benchmark:all    # All benchmarks
```

## 💡 Quick Start

### DoublyLinkedList Example

```typescript
import { DoublyLinkedList } from 'aethel-ts';

const list = new DoublyLinkedList<number>();

// O(1) operations
list.addLast(1);
list.addLast(2);
list.addFirst(0);  // [0, 1, 2]

list.removeFirst();  // [1, 2]
list.removeLast();   // [1]

// Iteration
for (const value of list) {
  console.log(value);
}

// Functional methods
const doubled = list.map(x => x * 2);
const filtered = list.filter(x => x > 0);
```

### LRU Cache Example

```typescript
import { LRUCache } from 'aethel-ts';

// API Response Caching
const cache = new LRUCache<string, any>(100);

async function fetchUser(id: string) {
  // Check cache first
  const cached = cache.get(id);
  if (cached) return cached;

  // Fetch from API
  const user = await fetch(`/api/users/${id}`).then(r => r.json());
  
  // Store in cache (automatic eviction when full)
  cache.put(id, user);
  
  return user;
}

// Monitor performance
console.log(cache.getStats());
// { hits: 45, misses: 5, hitRate: 0.9, evictions: 0 }
```

## 📊 Performance Benchmarks

### DoublyLinkedList Results

Run `npm run benchmark` to see detailed comparisons.

**Key Performance Wins:**
- **Head insertion** (`addFirst`): **21.6x faster** than `Array.unshift()` (273,502 vs 12,638 ops/sec)
- **Head removal** (`removeFirst`): **12.9x faster** than `Array.shift()` (183,314 vs 14,180 ops/sec)
- **Tail operations**: Competitive with Array (262,006 vs 226,033 ops/sec for insertion)

**When to use DoublyLinkedList:**
- Queue implementations (FIFO)
- Deque operations (both ends)
- LRU Cache backing store
- Frequent head/tail modifications

### LRU Cache Results

Run `npm run benchmark:cache` to see detailed comparisons.

**Key Performance Wins:**
- **O(1) complexity** for all operations (get, put, delete)
- **10-100x faster** than naive Map+Array implementations
- **Handles high contention** (Zipf distribution) without degradation
- **Built-in statistics** with negligible overhead

**Real-world use cases:**
- API response caching (60-90% hit rates typical)
- Database query result caching
- Computed value memoization
- Session management with automatic cleanup

## 🛠️ Technology Stack

- **TypeScript 5.3+**: Advanced type system with strict mode
- **esbuild**: High-speed bundler for development
- **Benchmark.js**: Professional-grade performance testing
- **Node.js 18+**: Modern runtime environment

## 📈 Development Roadmap

- [x] Project initialization
- [x] Core interfaces (ICollection, IIterable)
- [x] Doubly Linked List implementation
- [x] Benchmark infrastructure
- [x] **LRU Cache implementation** ✨
- [x] **Complex workload benchmarks**
- [x] **Memory leak prevention**
- [ ] Optimized Queue (O(1) enqueue/dequeue)
- [ ] Hash Set (O(1) average lookup)
- [ ] Stack (type-safe wrapper)
- [ ] Binary Search Tree
- [ ] Red-Black Tree
- [ ] Priority Queue (Heap)

## 🎓 Learning & Best Practices

This project demonstrates:
- Advanced TypeScript patterns (conditional types, mapped types)
- Performance-critical algorithm implementation
- Proper use of Big-O notation in real-world scenarios
- Scientific benchmarking methodology
- Clean architecture principles

## 📝 License

MIT

## 🤝 Contributing

This is currently an educational/portfolio project. Feedback and suggestions are welcome!

---

**Built with precision. Optimized for performance. Typed for safety.**