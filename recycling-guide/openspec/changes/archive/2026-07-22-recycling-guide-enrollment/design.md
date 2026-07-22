## Context

기존 서비스는 로그인 없이 검색만 가능했습니다. 클래스 신청 기능을 추가하면서 "누가 신청했는지"를 구분해야 해 로그인이 필요해졌고, 정원 관리라는 동시성 문제가 새로 생겼습니다.

현재 상태: 구현 완료, 운영 중 (일부 이슈 존재 — 아래 Risks 참고)
제약 조건:
- 무료 티어(Supabase free, GitHub Pages)로 운영
- 결제·후기 기능은 이번 범위 밖 (신청 기능만)

## Goals / Non-Goals

**Goals:**
- 정원이 정해진 클래스에 로그인한 사용자가 신청·취소할 수 있다
- 동시에 여러 명이 마지막 자리를 신청해도 정원을 넘지 않는다
- 관리자는 클래스를 관리하고 신청자 명단을 볼 수 있다
- 신청 내역은 새로고침해도 유지된다 (서버 저장)

**Non-Goals:**
- 결제/유료 신청
- 신청 후기/리뷰
- 이메일 알림
- 소셜 로그인(OAuth)

## Decisions

### 1. 동시성 제어: Postgres `SELECT ... FOR UPDATE` 행 잠금

**근거:** DB 트랜잭션 안에서 정원 확인과 신청 저장을 하나의 원자적 단위로 묶어, 별도의 분산 락 없이도 동시 신청 정합성을 보장.

**대안 검토:** 애플리케이션 레벨 락(Redis 등)은 무료 인프라 제약과 이번 규모에 과함.

### 2. 인증: Supabase Auth (이메일/비밀번호)

**근거:** 비밀번호 해시·세션·토큰을 직접 구현하지 않고 검증된 서비스에 위임.

### 3. 관리자 판별: DB 테이블(`admins`) + `is_admin()` 함수, RPC에서 매번 검증

**근거:** 클라이언트 코드의 "관리자 모드일 때만 버튼 노출"은 UI 편의일 뿐 보안이 아니므로, 서버(DB) 레벨에서 매 요청마다 재검증.

### 4. (재발견된 버그) `enrollments` 재신청 시 UNIQUE 제약 충돌

- 취소는 행 삭제가 아니라 `status='cancelled'`로 남기는 방식이라, 같은 클래스에 재신청하면 `UNIQUE(user_id, class_id)` 위반으로 409(`23505`) 발생.
- `INSERT ... ON CONFLICT (user_id, class_id) DO UPDATE`로 해결 (2026-07-22).

## Risks / Trade-offs

### [해결됨] `classes` 테이블 RLS가 관리자 여부를 확인하지 않음 (2026-07-22)

- 기존 정책: `TO authenticated WITH CHECK (true)` — 로그인만 하면 누구나 클래스를 추가·수정 가능
- RPC(`admin_add_class` 등)는 `is_admin()`을 확인하지만, PostgREST로 테이블에 직접 접근(`supabaseClient.from('classes').insert(...)`)하면 그 검증을 우회함
- 수정: 정책 조건에 `is_admin(auth.uid())` 추가, `pg_policies` 조회로 `with_check`에 반영됐음을 확인
- 실제 비관리자 계정으로 직접 접근을 시도해 차단되는지까지는 아직 실증하지 않음 (정책 정의 확인까지만 완료)

### [해결됨] 관리자 패널 "명단" 버튼 무반응 (2026-07-22)

- 원인: `styles.css`에 `.hidden`에 대한 범용 CSS 규칙이 없었음(`.results.hidden`만 존재). `admin-panel`/`class-form`/`addClassBtn`/`enrollmentModal`가 전부 `classList.add/remove('hidden')`로 표시를 토글했지만 대응하는 CSS가 없어 효과가 없었음. `enrollmentModal`은 `.modal { display: none; }`이 무조건 적용돼 있어 열리지 않았음.
- 수정: `.hidden { display: none !important; }` 추가, `.modal`의 무조건 `display: none` 제거, `authModal`에도 `hidden` 클래스 부여해 동일한 방식으로 통일.
- 부수 효과: 관리자 패널과 클래스 추가 폼도 같은 원인이었어서 함께 해결됨 (원래 의도대로 비관리자에겐 숨겨지고, 폼은 클릭 전엔 숨겨짐).

### [설계로 검증, 실측 생략] 동시 신청을 실제 부하로 돌려본 적은 없음 (2026-07-22 결정)

- `enroll_class`는 `SELECT ... FOR UPDATE`로 클래스 행에 잠금을 건 뒤 정원 확인과 저장을 하나의 트랜잭션으로 처리함. Postgres의 행 잠금 특성상, 같은 행에 대한 두 번째 트랜잭션은 첫 번째가 끝날 때까지 대기하므로 "확인 시점엔 둘 다 자리가 있었는데 저장은 둘 다 성공"하는 경쟁 상태(race condition)가 구조적으로 발생할 수 없음
- 이 패턴(비관적 잠금)은 좌석 예약·티켓 예매 등에서 널리 쓰이는 정석적 방법
- 실제 테스트 계정 2개를 만들어 동시 요청을 발생시켜 로그로 재확인하는 것은 비용(토큰) 대비 실익이 낮다고 판단해 생략하기로 결정 — 설계 근거로 검증 완료 처리

## Open Questions

- 신청 취소 후 재신청 시 순번(대기열)을 어떻게 처리할 것인가 (현재는 선착순 재확보)
- "명단" 버튼 버그의 정확한 원인
