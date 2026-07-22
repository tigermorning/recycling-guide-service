## Why

분리수거 가이드 서비스에 오프라인 교육(원데이 클래스) 신청 기능이 필요했습니다. 정원이 있는 클래스에 로그인한 사용자가 신청·취소할 수 있어야 하고, 관리자는 클래스를 관리하고 신청자 명단을 볼 수 있어야 합니다. 이 기능은 OpenSpec 프로포절 없이 구현되었고(ad-hoc), 이번에 사후적으로 문서화합니다.

## What Changes

- 로그인한 사용자가 클래스에 신청·취소할 수 있는 기능
- 여러 명이 동시에 신청해도 정원을 초과하지 않도록 원자적으로 처리
- 관리자가 클래스를 추가·수정·삭제하고 신청자 명단을 조회하는 기능
- Supabase Auth 기반 이메일·비밀번호 회원가입·로그인

## Capabilities

### New Capabilities

- `class-enrollment`: 정원이 있는 클래스에 신청·취소, 동시 신청 시에도 정원 초과 방지
- `user-auth`: 이메일·비밀번호 회원가입·로그인·로그아웃, 세션 유지
- `admin-management`: 관리자 전용 클래스 CRUD 및 신청자 명단 조회

### Modified Capabilities

없음

## Impact

- **Backend**: Supabase Postgres (`classes`, `enrollments`, `admins` 테이블), RPC 함수(`enroll_class`, `cancel_enrollment`, `admin_*`), RLS 정책
- **Frontend**: `recycling-guide/app.js`, `recycling-guide/index.html` (로그인 모달, 관리자 패널, 신청 버튼)
- **알려진 이슈** (design.md·tasks.md 참고):
  - `classes` 테이블 RLS가 관리자가 아닌 로그인 사용자의 직접 수정도 허용 (보안 격차)
  - 관리자 패널 "명단" 버튼 무반응 (원인 미조사)
  - 동시 신청 방지 로직을 실제 동시 요청으로 테스트한 로그가 없음
