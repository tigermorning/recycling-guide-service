## Why

저장소 생성 초기 설정 과정에서 세 가지 혼선이 쌓여 있었습니다: (1) recycling-guide 프로젝트 파일이 프로젝트명이 아닌 GitHub Pages 관례 폴더(`docs/`)에 들어가 있었고, (2) 로컬 `master` 브랜치가 원격에 한 번도 push되지 않아 GitHub 기본 브랜치가 작업 브랜치(`feature/computer-world-v2`)로 잡혀 있었고, (3) OpenSpec 스펙 폴더가 프로젝트 폴더가 아닌 저장소 루트에 있어 다른 실험 프로젝트들과 섞여 있었습니다. 이 셋을 정리해 앞으로의 혼선을 예방합니다.

## What Changes

- `docs/`의 recycling-guide 파일을 `recycling-guide/` 폴더로 이동
- GitHub Pages 배포를 레거시 브랜치 방식(소스 경로가 `/docs` 또는 `/`만 허용)에서 GitHub Actions 배포로 전환해 임의 폴더명 사용 가능하게 함
- 로컬 `master`를 `feature/computer-world-v2`로 fast-forward 후 push, GitHub 기본 브랜치를 `master`로 변경
- 저장소 루트의 `openspec/`(recycling-guide 전용 내용만 있었음)를 `recycling-guide/openspec/`으로 이동
- 정리 커밋(`2869a99`) 때 실수로 함께 삭제됐던 openspec 아카이브 스펙 2건을 git 히스토리에서 복원

## Capabilities

### New Capabilities

없음 (인프라/구조 정리, 제품 기능 변경 없음)

### Modified Capabilities

없음

## Impact

- **배포**: GitHub Pages 소스가 `/docs`(레거시)에서 Actions 워크플로 기반으로 변경됨 (`.github/workflows/deploy-recycling-guide.yml`)
- **저장소**: 기본 브랜치가 `feature/computer-world-v2` → `master`
- **문서**: `openspec/` 위치가 저장소 루트 → `recycling-guide/openspec/`
