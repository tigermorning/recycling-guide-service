## Context

`opencode-sandbox`는 여러 실험 프로젝트가 함께 있는 샌드박스 저장소이며, `recycling-guide-service`라는 별도 GitHub 저장소로 배포됩니다. 초기 설정 과정에서 폴더 구조와 브랜치가 관례와 어긋나게 자리잡았습니다.

## Goals / Non-Goals

**Goals:**
- 폴더명이 프로젝트 성격을 정확히 반영한다
- GitHub 저장소의 기본 브랜치가 실제 배포 기준 브랜치와 일치한다
- OpenSpec 스펙이 해당 프로젝트 폴더 안에서 발견 가능하다

**Non-Goals:**
- 저장소를 완전히 분리하는 것(recycling-guide를 별도 저장소로 분리하는 문제는 다루지 않음)
- `computer-world` 등 다른 프로젝트 정리

## Decisions

### 1. GitHub Pages: 레거시 브랜치 배포 → Actions 배포

**근거:** 레거시 방식은 소스 경로가 `/docs` 또는 `/`로 고정되어 프로젝트명 폴더(`recycling-guide/`)를 쓸 수 없음. Actions 배포는 임의 경로를 업로드할 수 있어 폴더명 제약이 사라짐.

### 2. 기본 브랜치: `master`로 통일

**근거:** `master`가 작업 브랜치보다 44커밋 뒤처져 있었지만 완전한 조상 관계(fast-forward 가능)였고, 원격에 한 번도 push된 적이 없던 것이 기본 브랜치 오설정의 근본 원인이었음.

### 3. OpenSpec 위치: 저장소 루트 → `recycling-guide/openspec/`

**근거:** 루트의 `openspec/`에는 recycling-guide 관련 내용만 있었고, 다른 프로젝트(computer-world 등)의 스펙은 없었음. 프로젝트 폴더 안으로 옮기는 것이 실제 내용과 위치를 일치시킴.

## Risks / Trade-offs

### [일시적 배포 창] 브랜치/Pages 설정 전환 중 짧은 정지 가능성

- 순서(로컬 이동 → 커밋 → Actions 워크플로 추가 → push → Pages 설정 전환)로 최소화함

## Open Questions

없음
