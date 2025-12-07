# NPM 배포 가이드

## 📦 배포 전 체크리스트

Aethel.TS를 NPM에 배포하기 전에 다음 사항들을 확인하세요.

### 1. NPM 계정 준비

```bash
# NPM 계정이 없다면 생성
# https://www.npmjs.com/signup

# NPM 로그인
npm login

# 로그인 확인
npm whoami
```

### 2. Package 이름 수정

**중요**: `package.json`의 `name` 필드를 수정해야 합니다.

```json
{
  "name": "@sukryu/aethel-ts",  // ← 여기를 변경
  ...
}
```

**두 가지 옵션**:

#### 옵션 A: Scoped Package (추천)
```json
"name": "@your-npm-username/aethel-ts"
```
- 장점: 이름 충돌 없음, 개인 네임스페이스
- 예: `@sukryu/aethel-ts`

#### 옵션 B: Unscoped Package
```json
"name": "aethel-ts"
```
- 주의: 이름이 이미 사용 중일 수 있음
- 확인 방법: https://www.npmjs.com/package/aethel-ts

**이름 사용 가능 여부 확인**:
```bash
npm view @your-username/aethel-ts
# "npm ERR! 404 Not Found" → 사용 가능
# 패키지 정보 출력 → 이미 존재
```

### 3. Repository URL 수정

`package.json`의 repository 필드를 실제 GitHub 주소로 변경:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/aethel-ts.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/aethel-ts/issues"
  },
  "homepage": "https://github.com/your-username/aethel-ts#readme"
}
```

### 4. Version 확인

Semantic Versioning을 따릅니다:
- `0.1.0` - 초기 배포 (현재)
- `0.1.1` - 버그 수정
- `0.2.0` - 새 기능 추가
- `1.0.0` - 안정 버전

## 🚀 배포 단계

### Step 1: 프로젝트 빌드

```bash
# 개발 의존성 설치 (아직 안했다면)
npm install

# 타입 검사
npm run type-check

# Production 빌드 (JS + 타입 정의)
npm run build:prod
```

**빌드 결과 확인**:
```bash
ls -la dist/

# 다음 파일들이 있어야 함:
# - index.js
# - index.d.ts
# - index.d.ts.map
# - pkg/list/doubly-linked.js
# - pkg/list/doubly-linked.d.ts
# - pkg/cache/lru-cache.js
# - pkg/cache/lru-cache.d.ts
# - ...
```

### Step 2: Dry Run (테스트 배포)

```bash
# 배포될 파일 목록 확인
npm pack --dry-run

# 실제 tarball 생성하여 확인
npm pack

# sukryu-aethel-ts-0.1.0.tgz 파일이 생성됨
# 압축 해제하여 내용 확인:
tar -xzf sukryu-aethel-ts-0.1.0.tgz
cd package
ls -la
```

**확인 사항**:
- ✅ `dist/` 디렉터리가 있는가?
- ✅ `.js` 파일과 `.d.ts` 파일이 모두 있는가?
- ✅ `README.md`, `LICENSE` 파일이 있는가?
- ❌ `src/`, `benchmark/` 같은 소스 파일은 **없어야** 함

### Step 3: 로컬 테스트

배포 전 로컬에서 패키지를 테스트:

```bash
# 다른 디렉터리에서 테스트 프로젝트 생성
cd /tmp
mkdir test-aethel-ts
cd test-aethel-ts
npm init -y

# 로컬 tarball 설치
npm install /path/to/aethel-ts/sukryu-aethel-ts-0.1.0.tgz

# 테스트 파일 작성
cat > test.mjs << 'EOF'
import { LRUCache, DoublyLinkedList } from '@sukryu/aethel-ts';

const cache = new LRUCache(10);
cache.put('key', 'value');
console.log('Cache test:', cache.get('key'));

const list = new DoublyLinkedList();
list.addLast(1);
list.addLast(2);
console.log('List test:', list.toArray());
EOF

# 실행
node test.mjs
```

### Step 4: NPM 배포

#### Scoped Package 배포 (공개)

```bash
# Scoped 패키지는 기본적으로 private
# 공개로 배포하려면 --access public 필요
npm publish --access public
```

#### Unscoped Package 배포

```bash
npm publish
```

**배포 성공 시**:
```
+ @sukryu/aethel-ts@0.1.0
```

### Step 5: 배포 확인

```bash
# NPM 웹사이트에서 확인
open https://www.npmjs.com/package/@sukryu/aethel-ts

# 설치 테스트
cd /tmp/test-install
npm init -y
npm install @sukryu/aethel-ts

# TypeScript 타입 체크 테스트
cat > test.ts << 'EOF'
import { LRUCache } from '@sukryu/aethel-ts';

const cache = new LRUCache<string, number>(100);
cache.put('key', 42);
const value: number | undefined = cache.get('key');
console.log(value);
EOF

npx tsx test.ts
```

## 📊 배포 후 작업

### 1. Git 태그 생성

```bash
git tag -a v0.1.0 -m "Release v0.1.0"
git push origin v0.1.0
```

### 2. GitHub Release 생성

GitHub에서 Release 페이지 작성:
- Tag: `v0.1.0`
- Release title: `v0.1.0 - Initial Release`
- Description: 주요 기능 및 변경사항

### 3. README 배지 추가

```markdown
[![npm version](https://badge.fury.io/js/@sukryu%2Faethel-ts.svg)](https://www.npmjs.com/package/@sukryu/aethel-ts)
[![npm downloads](https://img.shields.io/npm/dm/@sukryu/aethel-ts.svg)](https://www.npmjs.com/package/@sukryu/aethel-ts)
[![license](https://img.shields.io/npm/l/@sukryu/aethel-ts.svg)](https://github.com/sukryu/aethel-ts/blob/main/LICENSE)
```

## 🔄 업데이트 배포

### Version Bump

```bash
# Patch: 버그 수정 (0.1.0 → 0.1.1)
npm version patch

# Minor: 새 기능 추가 (0.1.0 → 0.2.0)
npm version minor

# Major: Breaking changes (0.1.0 → 1.0.0)
npm version major
```

### 재배포

```bash
# 빌드
npm run build:prod

# 배포
npm publish --access public

# Git 푸시 (태그 포함)
git push --follow-tags
```

## 🚨 문제 해결

### 문제: "You do not have permission to publish"

**해결**:
```bash
# 로그인 확인
npm whoami

# 재로그인
npm logout
npm login
```

### 문제: "Package name already exists"

**해결**:
- Scoped package 사용: `@your-username/aethel-ts`
- 또는 다른 이름 선택: `aethel-data-structures`

### 문제: "Missing type definitions"

**해결**:
```bash
# tsconfig.build.json 확인
# build:types 스크립트 실행 확인
npm run build:types

# dist/ 에 .d.ts 파일이 있는지 확인
ls dist/*.d.ts
```

### 문제: "Module not found" (사용자가 설치 후)

**해결**:
- `package.json`의 `exports` 필드 확인
- `type: "module"` 설정 확인
- Import 경로 확인: `from '@sukryu/aethel-ts'` (올바름)

## 📝 체크리스트 요약

배포 전 최종 확인:

- [ ] NPM 계정 로그인됨 (`npm whoami`)
- [ ] `package.json`의 `name` 수정됨
- [ ] `package.json`의 `repository` URL 수정됨
- [ ] `LICENSE` 파일 존재
- [ ] `npm run build:prod` 성공
- [ ] `dist/` 디렉터리에 `.js` + `.d.ts` 파일 존재
- [ ] `npm pack --dry-run` 결과 확인
- [ ] 로컬 테스트 완료
- [ ] **배포**: `npm publish --access public`

## 🎉 축하합니다!

배포가 완료되면 프로젝트 2에서 다음과 같이 사용할 수 있습니다:

```bash
# 프로젝트 2에서
npm install @sukryu/aethel-ts
```

```typescript
// 프로젝트 2 코드
import { LRUCache } from '@sukryu/aethel-ts';

const l1Cache = new LRUCache<string, any>(1000);
```

---

**Happy Publishing! 🚀**