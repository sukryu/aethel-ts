# Aethel.TS - 시작 가이드

## ✅ 프로젝트 초기화 완료

Aethel.TS의 기본 아키텍처가 성공적으로 구축되었습니다!

## 📁 생성된 구조

```
aethel-ts/
├── src/
│   ├── interfaces/
│   │   ├── ICollection.ts      # 컬렉션 기본 인터페이스
│   │   ├── IIterable.ts        # 반복자 인터페이스
│   │   └── index.ts
│   ├── pkg/
│   │   └── list/
│   │       ├── doubly-linked.ts # 이중 연결 리스트 구현
│   │       └── index.ts
│   ├── types.ts                 # Comparable, ComparatorFn 등
│   └── index.ts                 # 메인 엔트리 포인트
├── benchmark/
│   └── list.bench.ts            # DoublyLinkedList 벤치마크
├── package.json                 # 프로젝트 설정
├── tsconfig.json                # TypeScript 설정
├── build.mjs                    # esbuild 빌드 스크립트
└── README.md                    # 프로젝트 문서
```

## 🚀 다음 단계

### 1. 의존성 설치
```bash
cd aethel-ts
npm install
```

### 2. 타입 검사 실행
```bash
npm run type-check
```

### 3. 프로젝트 빌드
```bash
npm run build
```

### 4. 벤치마크 실행
```bash
# TypeScript 직접 실행
npm run benchmark

# 또는 빌드 후 실행
npm run benchmark:compiled
```

## 🎯 구현된 핵심 기능

### DoublyLinkedList
- ✅ O(1) 시간 복잡도: `addFirst()`, `addLast()`, `removeFirst()`, `removeLast()`
- ✅ 완전한 Iterator 지원: `for...of`, `forEach()`, `map()`, `filter()` 등
- ✅ 타입 안전성: Generic `<T>` 지원
- ✅ 커스텀 동등성 비교 함수 지원

### 인터페이스 시스템
- ✅ `ICollection<T>`: 모든 컬렉션의 기본 인터페이스
- ✅ `IIterable<T>`: 반복 가능한 컬렉션 인터페이스

### 타입 유틸리티
- ✅ `Comparable<T>`: 비교 가능한 타입 제약
- ✅ `ComparatorFn<T>`: 커스텀 비교 함수 타입
- ✅ `EqualityFn<T>`: 동등성 비교 함수 타입
- ✅ `HashFn<T>`: 해시 함수 타입

## 📊 예상 벤치마크 결과

DoublyLinkedList는 다음과 같은 시나리오에서 Array를 능가합니다:

- **Head 삽입**: Array.unshift()의 O(n) → DoublyLinkedList.addFirst()의 O(1)
- **Head 삭제**: Array.shift()의 O(n) → DoublyLinkedList.removeFirst()의 O(1)
- **양방향 큐 사용**: 양쪽 끝에서 삽입/삭제가 빈번한 경우

## 🔜 다음 개발 단계 제안

### 1. 우선순위 높음
- [ ] Optimized Queue (링 버퍼 또는 연결 리스트 기반)
- [ ] Hash Set (O(1) 평균 조회)
- [ ] 유닛 테스트 추가 (Jest 또는 Vitest)

### 2. 중간 우선순위
- [ ] Binary Search Tree
- [ ] Priority Queue (힙 기반)
- [ ] LRU Cache

### 3. 장기 목표
- [ ] Red-Black Tree
- [ ] B-Tree
- [ ] NPM 패키지 배포

## 💡 코드 사용 예시

```typescript
import { DoublyLinkedList } from './src/pkg/list/doubly-linked';

// 리스트 생성
const list = new DoublyLinkedList<number>();

// O(1) 삽입
list.addLast(1);
list.addLast(2);
list.addFirst(0);  // [0, 1, 2]

// O(1) 삭제
list.removeFirst();  // [1, 2]
list.removeLast();   // [1]

// 반복
for (const value of list) {
  console.log(value);
}

// 함수형 메서드
const doubled = list.map(x => x * 2);
const filtered = list.filter(x => x > 0);
```

## 🎓 학습 포인트

이 프로젝트를 통해 다음을 마스터할 수 있습니다:

1. **고급 TypeScript 패턴**
   - Generic 제약 조건 (Comparable<T>)
   - Conditional Types
   - Interface 설계 원칙

2. **성능 최적화**
   - Big-O 분석
   - 메모리 효율성
   - 캐시 지역성

3. **아키텍처 설계**
   - Go-style 모듈화
   - 단일 책임 원칙
   - 의존성 역전

4. **과학적 검증**
   - 벤치마크 방법론
   - 통계적 유의성
   - 재현 가능한 측정

---

**준비 완료! 이제 고성능 자료구조 개발을 시작하세요! 🚀**