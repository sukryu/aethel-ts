# LRU Cache - 사용 가이드

## 🎯 개요

**LRU (Least Recently Used) Cache**는 Aethel.TS의 핵심 자료구조로, DoublyLinkedList와 Map을 결합하여 **모든 연산을 O(1) 시간 복잡도**로 수행합니다.

## 📊 성능 특성

| 연산 | 시간 복잡도 | 설명 |
|------|------------|------|
| `get(key)` | O(1) | 값 조회 및 접근 순서 업데이트 |
| `put(key, value)` | O(1) | 삽입/업데이트 및 자동 eviction |
| `delete(key)` | O(1) | 항목 삭제 |
| `peek(key)` | O(1) | 접근 순서 변경 없이 조회 |

## 🚀 기본 사용법

### 1. Cache 생성

```typescript
import { LRUCache } from 'aethel-ts';

// 최대 100개 항목을 저장하는 캐시
const cache = new LRUCache<string, number>(100);
```

### 2. 데이터 저장 및 조회

```typescript
// 데이터 저장
cache.put('user:123', 42);
cache.put('user:456', 99);

// 데이터 조회 (접근 순서 업데이트됨)
const value = cache.get('user:123'); // 42

// 접근 순서 변경 없이 조회
const peeked = cache.peek('user:456'); // 99
```

### 3. 자동 Eviction

```typescript
const cache = new LRUCache<string, string>(3);

cache.put('a', 'Alice');
cache.put('b', 'Bob');
cache.put('c', 'Charlie');

// 캐시가 꽉 참 (size: 3/3)

cache.get('a'); // 'Alice'를 가장 최근에 사용

cache.put('d', 'David');
// 'b'가 자동으로 제거됨 (least recently used)

console.log(cache.has('b')); // false
console.log(cache.has('a')); // true
```

## 📈 실전 사용 예제

### 예제 1: API 응답 캐싱

```typescript
import { LRUCache } from 'aethel-ts';

interface APIResponse {
  data: any;
  timestamp: number;
}

class APIClient {
  private cache = new LRUCache<string, APIResponse>(1000);

  async fetchUser(userId: string): Promise<any> {
    // 캐시 확인
    const cached = this.cache.get(userId);
    
    if (cached && Date.now() - cached.timestamp < 60000) {
      // 1분 이내 캐시된 데이터 사용
      console.log('Cache hit!');
      return cached.data;
    }

    // API 호출
    console.log('Cache miss - fetching from API');
    const data = await fetch(`/api/users/${userId}`).then(r => r.json());
    
    // 캐시 저장
    this.cache.put(userId, {
      data,
      timestamp: Date.now()
    });

    return data;
  }

  getCacheStats() {
    return this.cache.getStats();
  }
}

// 사용
const api = new APIClient();

await api.fetchUser('123'); // API 호출
await api.fetchUser('123'); // 캐시에서 조회 (빠름!)

console.log(api.getCacheStats());
// {
//   size: 1,
//   capacity: 1000,
//   hits: 1,
//   misses: 1,
//   evictions: 0,
//   hitRate: 0.5,
//   utilization: 0.001
// }
```

### 예제 2: 데이터베이스 쿼리 결과 캐싱

```typescript
import { LRUCache } from 'aethel-ts';

class DatabaseClient {
  private queryCache = new LRUCache<string, any[]>(500);

  async query(sql: string, params: any[] = []): Promise<any[]> {
    const cacheKey = `${sql}:${JSON.stringify(params)}`;
    
    // 캐시 확인
    const cached = this.queryCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 실제 쿼리 실행
    const results = await this.executeQuery(sql, params);
    
    // 캐시 저장
    this.queryCache.put(cacheKey, results);
    
    return results;
  }

  private async executeQuery(sql: string, params: any[]): Promise<any[]> {
    // DB 쿼리 로직
    return [];
  }

  invalidateCache(pattern?: string): void {
    if (!pattern) {
      this.queryCache.clear();
    }
    // 패턴 기반 무효화 로직...
  }
}
```

### 예제 3: 계산 결과 Memoization

```typescript
import { LRUCache } from 'aethel-ts';

class ExpensiveCalculator {
  private cache = new LRUCache<string, number>(100);

  fibonacci(n: number): number {
    const cached = this.cache.get(`fib:${n}`);
    if (cached !== undefined) {
      return cached;
    }

    // 실제 계산
    const result = n <= 1 ? n : this.fibonacci(n - 1) + this.fibonacci(n - 2);
    
    this.cache.put(`fib:${n}`, result);
    return result;
  }

  factorial(n: number): number {
    const cacheKey = `fact:${n}`;
    const cached = this.cache.get(cacheKey);
    if (cached !== undefined) return cached;

    const result = n <= 1 ? 1 : n * this.factorial(n - 1);
    this.cache.put(cacheKey, result);
    return result;
  }
}

const calc = new ExpensiveCalculator();

console.time('first call');
calc.fibonacci(40); // 느림
console.timeEnd('first call');

console.time('cached call');
calc.fibonacci(40); // 매우 빠름!
console.timeEnd('cached call');
```

### 예제 4: Session 관리

```typescript
import { LRUCache } from 'aethel-ts';

interface Session {
  userId: string;
  data: Record<string, any>;
  createdAt: number;
  lastAccess: number;
}

class SessionManager {
  private sessions = new LRUCache<string, Session>(10000);

  createSession(userId: string): string {
    const sessionId = this.generateSessionId();
    
    this.sessions.put(sessionId, {
      userId,
      data: {},
      createdAt: Date.now(),
      lastAccess: Date.now()
    });

    return sessionId;
  }

  getSession(sessionId: string): Session | undefined {
    const session = this.sessions.get(sessionId);
    
    if (session) {
      session.lastAccess = Date.now();
    }
    
    return session;
  }

  updateSession(sessionId: string, data: Record<string, any>): boolean {
    const session = this.sessions.get(sessionId);
    
    if (!session) return false;

    session.data = { ...session.data, ...data };
    session.lastAccess = Date.now();
    
    return true;
  }

  destroySession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  // 캐시가 자동으로 오래된 세션을 제거
  getActiveSessionCount(): number {
    return this.sessions.size;
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36)}`;
  }
}
```

## 📊 통계 모니터링

```typescript
const cache = new LRUCache<string, number>(100);

// 작업 수행
for (let i = 0; i < 200; i++) {
  cache.put(`key${i}`, i);
  cache.get(`key${i % 50}`); // 일부 키에 반복 접근
}

// 통계 확인
const stats = cache.getStats();
console.log(stats);
// {
//   size: 100,           // 현재 캐시 크기
//   capacity: 100,       // 최대 용량
//   hits: 150,           // 캐시 적중 횟수
//   misses: 50,          // 캐시 미스 횟수
//   evictions: 100,      // 제거된 항목 수
//   hitRate: 0.75,       // 적중률 (75%)
//   utilization: 1.0     // 사용률 (100%)
// }

// 통계 리셋
cache.resetStats();
```

## 🎯 모범 사례

### 1. 적절한 캐시 크기 설정

```typescript
// ❌ 너무 작음 - eviction이 너무 자주 발생
const tooSmall = new LRUCache<string, any>(10);

// ❌ 너무 큼 - 메모리 낭비
const tooLarge = new LRUCache<string, any>(1000000);

// ✅ 애플리케이션의 메모리 제약과 데이터 크기에 맞게 설정
const optimal = new LRUCache<string, any>(1000);
```

### 2. 캐시 키 설계

```typescript
// ❌ 나쁜 키 설계 - 충돌 가능성
cache.put('user', userData);

// ✅ 좋은 키 설계 - 명확하고 고유함
cache.put('user:123:profile', userData);
cache.put('query:SELECT:users:id=123', queryResult);
```

### 3. TTL (Time-To-Live) 패턴

```typescript
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class TTLCache<K, V> {
  private cache: LRUCache<K, CacheEntry<V>>;

  constructor(capacity: number, private ttlMs: number) {
    this.cache = new LRUCache(capacity);
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) return undefined;
    
    // TTL 확인
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    
    return entry.value;
  }

  put(key: K, value: V): void {
    this.cache.put(key, {
      value,
      expiresAt: Date.now() + this.ttlMs
    });
  }
}

// 사용: 5분 TTL
const cache = new TTLCache<string, any>(1000, 5 * 60 * 1000);
```

## ⚡ 성능 팁

1. **peek() 사용**: 통계 수집이나 디버깅 시 접근 순서를 변경하고 싶지 않을 때 `peek()`를 사용하세요.

2. **배치 작업**: 많은 항목을 한 번에 저장할 때는 메서드 체이닝을 활용하세요.
```typescript
cache
  .put('a', 1)
  .put('b', 2)
  .put('c', 3);
```

3. **메모리 정리**: 더 이상 사용하지 않을 때는 `clear()`를 호출하여 메모리를 명시적으로 해제하세요.
```typescript
cache.clear();
```

## 🔍 디버깅

```typescript
// 최근/오래된 항목 확인
console.log(cache.getMostRecent());  // ['key', 'value']
console.log(cache.getLeastRecent()); // ['key', 'value']

// 모든 키 확인 (접근 순서대로)
console.log(cache.keys()); // ['most recent', ..., 'least recent']

// 항목 순회
cache.forEach((value, key, index) => {
  console.log(`${index}: ${key} = ${value}`);
});
```

## 📚 추가 자료

- [LRU Cache 알고리즘 설명](https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU)
- [Aethel.TS 벤치마크 결과](../README.md#benchmarks)
- [캐시 전략 가이드](https://martinfowler.com/bliki/TwoHardThings.html)

---

**LRU Cache는 고성능 애플리케이션의 필수 도구입니다. 적절히 활용하여 응답 시간을 획기적으로 개선하세요!**