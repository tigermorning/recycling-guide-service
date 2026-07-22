## Why

분리수거 가이드 서비스의 UI/UX가 개선 필요. 검색 결과 영역이 불필요한 공백을 차지하고, 클래스와 빠른 참조 섹션 간 높이 불균형, 페이지네이션 부재로 인한 긴 스크롤 문제.

## What Changes

- 검색 결과 영역을 숨기고, 기본 상태에서 클래스와 빠른 참조가 바로 보이도록 변경
- 컨테이너 최대 너비 확장 (600px → 1100px)
- 클래스 목록에 페이징 적용 (페이지당 4개)
- 빠른 참조 표에 페이징 적용 (페이지당 11개)
- 빠른 참조에 검색 및 카테고리 필터 추가
- 빠른 참조 항목 확대 (14개 → 47개)
- 거주지별 차이 안내 팁 추가
- 혼동되는 품목(PVC, PS, OTHER 등) 데이터 추가

## Capabilities

### New Capabilities
- `ui-pagination`: 클래스 및 빠른 참조 섹션에 페이징 기능
- `quick-ref-search`: 빠른 참조 섹션 검색 및 필터 기능
- `location-tips`: 거주지별 분리수거 차이 안내

### Modified Capabilities
- `item-search`: 검색 결과 영역 표시/숨김 로직 변경

## Impact

- `recycling-guide/index.html`: HTML 구조 변경
- `recycling-guide/styles.css`: 스타일 업데이트
- `recycling-guide/app.js`: 페이징, 검색, 필터 로직 추가
- `recycling-guide/data.json`: 품목 데이터 확대
