## 1. 폴더 구조 정리

- [x] 1.1 `docs/*`를 `recycling-guide/*`로 이동 (git mv)
- [x] 1.2 `openspec/`를 `recycling-guide/openspec/`로 이동

## 2. 배포 파이프라인

- [x] 2.1 GitHub Actions 기반 Pages 배포 워크플로 작성 (`.github/workflows/deploy-recycling-guide.yml`)
- [x] 2.2 GitHub Pages `build_type`을 `workflow`로 전환
- [x] 2.3 워크플로 실행 확인 (success)

## 3. 브랜치 정리

- [x] 3.1 로컬 `master`를 `feature/computer-world-v2`로 fast-forward
- [x] 3.2 `origin/master` push (최초 push)
- [x] 3.3 GitHub 기본 브랜치를 `master`로 변경
- [x] 3.4 워크플로 트리거 브랜치를 `master`로 변경

## 4. 스펙 복원

- [x] 4.1 삭제됐던 openspec 아카이브 2건을 git 히스토리에서 복원
- [x] 4.2 복원한 스펙을 `recycling-guide/openspec/`으로 이동

## 5. 남겨둔 것 (범위 밖)

- [ ] 5.1 `feature/computer-world-v2`, `feature/computer-world-analysis`, `improve-computer-structure` 브랜치 정리(삭제 여부는 별도 확인 필요)
