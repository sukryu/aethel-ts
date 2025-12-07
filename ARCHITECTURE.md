# Aethel.TS - 프로젝트 구조 개요

## 📦 전체 디렉터리 구조

```
aethel-ts/
│
├── src/                          # 소스 코드 루트
│   │
│   ├── interfaces/               # 핵심 인터페이스 정의
│   │   ├── ICollection.ts       # 컬렉션 기본 인터페이스 (size, isEmpty, clear, etc.)
│   │   ├── IIterable.ts         # 반복자 인터페이스 (Symbol.iterator, forEach, map, etc.)
│   │   └── index.ts             # 인터페이스 배럴 파일
│   │
│   ├── pkg/                      # Go-style 데이터 구조 패키지
│   │   │
│   │   └── list/                 # 리스트 자료구조
│   │       ├── doubly-linked.ts # 이중 연결 리스트 구현
│   │       └── index.ts         # list 모듈 배럴 파일
│   │
│   ├── types.ts                  # 유틸리티 타입 및 헬퍼 함수
│   │                             # - Comparable<T>
│   │                             # - ComparatorFn<T>
│   │                             # - EqualityFn<T>
│   │                             # - HashFn<T>
│   │
│   └── index.ts                  # 라이브러리 메인 엔트리 포인트
│
├── benchmark/                    # 성능 벤치마크
│   └── list.bench.ts            # DoublyLinkedList 벤치마크
│
├── dist/                         # 빌드 출력 (생성됨)
│
├── package.json                  # 프로젝트 메타데이터 및 스크립트
├── tsconfig.json                 # TypeScript 컴파일러 설정
├── build.mjs                     # esbuild 빌드 스크립트
├── .gitignore                    # Git 제외 파일
├── README.md                     # 프로젝트 문서
└── GETTING_STARTED.md           # 시작 가이드
```

## 🏗️ 아키텍처 원칙

### 1. Go-Style 모듈화 (pkg/)
- **단일 책임**: 각 패키지는 하나의 자료구조 카테고리만 담당
- **명확한 경계**: `pkg/list/`, `pkg/queue/`, `pkg/tree/` 등으로 분리
- **쉬운 확장**: 새로운 자료구조 추가 시 독립적인 패키지로 관리

### 2. Interface-First Design
- **ICollection<T>**: 모든 컬렉션의 공통 계약
- **IIterable<T>**: 반복 가능한 자료구조의 계약
- **확장성**: 새로운 인터페이스 추가 시 기존 코드에 영향 최소화

### 3. 타입 안전성 (types.ts)
- **Compile-time 검증**: Comparable<T>로 비교 가능한 타입만 허용
- **유연성**: ComparatorFn<T>로 커스텀 비교 로직 지원
- **명확성**: 각 타입의 용도가 명확하게 정의됨

## 📄 주요 파일 상세 설명

### src/interfaces/ICollection.ts
```typescript
export interface ICollection<T> {
  readonly size: number;        // 컬렉션의 요소 개수
  isEmpty(): boolean;           // 비어있는지 확인
  clear(): void;                // 모든 요소 제거
  contains(element: T): boolean; // 요소 포함 여부
  toArray(): T[];               // 배열로 변환
}
```
**목적**: 모든 자료구조가 따라야 할 최소 계약 정의

### src/interfaces/IIterable.ts
```typescript
export interface IIterable<T> {
  [Symbol.iterator](): Iterator<T>;
  forEach(callback: (element: T, index: number) => void): void;
  map<U>(callback: (element: T, index: number) => U): U[];
  filter(predicate: (element: T, index: number) => boolean): T[];
  some(predicate: (element: T, index: number) => boolean): boolean;
  every(predicate: (element: T, index: number) => boolean): boolean;
}
```
**목적**: JavaScript의 함수형 프로그래밍 패턴 지원

### src/types.ts
```typescript
// 비교 가능한 타입 제약
export type Comparable<T> = T extends number | string | Date | boolean ? T : never;

// 비교 함수 타입
export type ComparatorFn<T> = (a: T, b: T) => number;

// 동등성 비교 함수
export type EqualityFn<T> = (a: T, b: T) => boolean;

// 해시 함수
export type HashFn<T> = (value: T) => number;
```
**목적**: 타입 수준에서 안전성과 명확성 제공

### src/pkg/list/doubly-linked.ts
**구현 특징**:
- O(1) head/tail 연산
- 양방향 탐색 최적화
- 메모리 누수 방지를 위한 명시적 노드 관리
- ICollection<T> + IIterable<T> 완전 구현

### benchmark/list.bench.ts
**벤치마크 시나리오**:
1. Sequential Insertion (tail): `addLast()` vs `Array.push()`
2. Sequential Insertion (head): `addFirst()` vs `Array.unshift()`
3. Sequential Removal (head): `removeFirst()` vs `Array.shift()`
4. Sequential Removal (tail): `removeLast()` vs `Array.pop()`
5. Iteration: `forEach()` vs Array forEach
6. Search: `contains()` vs `Array.includes()`

## 🔧 빌드 시스템

### package.json Scripts
```json
{
  "type-check": "tsc --noEmit",           // 타입 검사만
  "bundle": "node build.mjs",             // esbuild로 번들링
  "build": "npm run type-check && npm run bundle",
  "dev": "node build.mjs --watch",        // 개발 모드
  "benchmark": "node --loader ts-node/esm benchmark/list.bench.ts"
}
```

### tsconfig.json 핵심 설정
- **noEmit: true** - tsc는 타입 검사만 담당
- **strict: true** - 모든 엄격 모드 활성화
- **target: ES2022** - 최신 JavaScript 기능 사용
- **module: ES2022** - ESM 모듈 시스템

### build.mjs (esbuild)
- **빠른 빌드**: TypeScript 컴파일보다 10-100배 빠름
- **번들링 없음**: 각 파일 개별 트랜스파일
- **소스맵 생성**: 디버깅 용이

## 🎯 설계 결정 사항 (Design Decisions)

### 1. 왜 esbuild + tsc 조합인가?
- **tsc**: 타입 검사는 TypeScript 컴파일러가 가장 정확
- **esbuild**: 실제 빌드는 속도가 중요 (개발 생산성)
- **결과**: 타입 안전성 + 빠른 피드백 루프

### 2. 왜 ICollection + IIterable 분리?
- **단일 책임**: Collection은 데이터 관리, Iterable은 순회
- **선택적 구현**: 모든 컬렉션이 반복 가능할 필요는 없음
- **확장성**: 새로운 능력(ISortable, IIndexable 등) 추가 가능

### 3. 왜 Comparable<T> 같은 타입 제약?
- **컴파일 타임 안전성**: 런타임 에러 방지
- **명확한 계약**: API 사용자가 요구사항을 즉시 파악
- **IDE 지원**: 자동완성 및 타입 힌트 개선

### 4. 왜 Go-style pkg 구조?
- **확장성**: 자료구조가 늘어나도 구조가 명확
- **독립성**: 각 패키지는 독립적으로 테스트/배포 가능
- **협업**: 여러 개발자가 다른 패키지를 동시 작업 가능

## 📈 확장 로드맵

### Phase 1: Core Linear Structures
- [x] DoublyLinkedList
- [ ] OptimizedQueue (circular buffer)
- [ ] Stack (array-based)
- [ ] Deque (doubly-linked)

### Phase 2: Hash-Based Structures
- [ ] HashSet (separate chaining)
- [ ] HashMap (open addressing)
- [ ] LRU Cache

### Phase 3: Tree Structures
- [ ] Binary Search Tree
- [ ] AVL Tree
- [ ] Red-Black Tree
- [ ] B-Tree

### Phase 4: Advanced Structures
- [ ] Priority Queue (binary heap)
- [ ] Disjoint Set (Union-Find)
- [ ] Trie
- [ ] Segment Tree

## 🧪 테스트 전략 (계획)

```
tests/
├── unit/
│   ├── list/
│   │   ├── doubly-linked.test.ts
│   │   └── queue.test.ts
│   └── tree/
│       └── bst.test.ts
├── integration/
│   └── collection.test.ts
└── benchmark/
    └── (기존 benchmark/ 디렉터리)
```

---

**이 구조는 확장 가능하고, 유지보수 가능하며, 타입 안전한 라이브러리를 위한 견고한 기반입니다.**