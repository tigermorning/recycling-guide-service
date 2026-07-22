-- ============================================
-- 관리자 기능 SQL
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. 관리자 테이블 생성
CREATE TABLE IF NOT EXISTS admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS 활성화
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 3. 관리자 테이블 정책 (본인만 조회 가능)
CREATE POLICY "Users can view own admin status"
  ON admins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. 관리자 판별 함수 (DB 레벨에서 검증)
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE user_id = p_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. 관리자: 클래스 추가 함수
CREATE OR REPLACE FUNCTION admin_add_class(
  p_name TEXT,
  p_description TEXT,
  p_max_capacity INTEGER
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_new_class RECORD;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', '로그인이 필요합니다');
  END IF;
  
  IF NOT is_admin(v_user_id) THEN
    RETURN json_build_object('success', false, 'message', '관리자 권한이 필요합니다');
  END IF;
  
  INSERT INTO classes (name, description, max_capacity, current_count)
  VALUES (p_name, p_description, p_max_capacity, 0)
  RETURNING * INTO v_new_class;
  
  RETURN json_build_object(
    'success', true,
    'message', '클래스가 추가되었습니다',
    'class', json_build_object(
      'id', v_new_class.id,
      'name', v_new_class.name,
      'description', v_new_class.description,
      'max_capacity', v_new_class.max_capacity,
      'current_count', v_new_class.current_count
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 관리자: 클래스 수정 함수
CREATE OR REPLACE FUNCTION admin_update_class(
  p_class_id UUID,
  p_name TEXT,
  p_description TEXT,
  p_max_capacity INTEGER
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', '로그인이 필요합니다');
  END IF;
  
  IF NOT is_admin(v_user_id) THEN
    RETURN json_build_object('success', false, 'message', '관리자 권한이 필요합니다');
  END IF;
  
  UPDATE classes
  SET name = p_name,
      description = p_description,
      max_capacity = p_max_capacity,
      updated_at = NOW()
  WHERE id = p_class_id;
  
  RETURN json_build_object('success', true, 'message', '클래스가 수정되었습니다');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. 관리자: 클래스 삭제 함수
CREATE OR REPLACE FUNCTION admin_delete_class(p_class_id UUID)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', '로그인이 필요합니다');
  END IF;
  
  IF NOT is_admin(v_user_id) THEN
    RETURN json_build_object('success', false, 'message', '관리자 권한이 필요합니다');
  END IF;
  
  DELETE FROM enrollments WHERE class_id = p_class_id;
  DELETE FROM classes WHERE id = p_class_id;
  
  RETURN json_build_object('success', true, 'message', '클래스가 삭제되었습니다');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. 관리자: 신청자 명단 조회 함수
CREATE OR REPLACE FUNCTION admin_get_enrollments(p_class_id UUID)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_enrollments JSON;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', '로그인이 필요합니다');
  END IF;
  
  IF NOT is_admin(v_user_id) THEN
    RETURN json_build_object('success', false, 'message', '관리자 권한이 필요합니다');
  END IF;
  
  SELECT json_agg(json_build_object(
    'id', e.id,
    'user_id', e.user_id,
    'email', u.email,
    'status', e.status,
    'created_at', e.created_at
  ))
  INTO v_enrollments
  FROM enrollments e
  JOIN auth.users u ON e.user_id = u.id
  WHERE e.class_id = p_class_id
  AND e.status = 'confirmed';
  
  RETURN json_build_object(
    'success', true,
    'enrollments', COALESCE(v_enrollments, '[]'::json)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. 관리자: 클래스 목록 조회 함수 (전체 정보 포함)
CREATE OR REPLACE FUNCTION admin_get_classes()
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_classes JSON;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', '로그인이 필요합니다');
  END IF;
  
  IF NOT is_admin(v_user_id) THEN
    RETURN json_build_object('success', false, 'message', '관리자 권한이 필요합니다');
  END IF;
  
  SELECT json_agg(sub.cls)
  INTO v_classes
  FROM (
    SELECT json_build_object(
      'id', c.id,
      'name', c.name,
      'description', c.description,
      'max_capacity', c.max_capacity,
      'current_count', c.current_count,
      'created_at', c.created_at,
      'updated_at', c.updated_at
    ) AS cls
    FROM classes c
    ORDER BY c.created_at DESC
  ) sub;
  
  RETURN json_build_object(
    'success', true,
    'classes', COALESCE(v_classes, '[]'::json)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 테스트: 현재 사용자를 관리자로 추가
-- ============================================
-- 주의: 실제 사용자 ID로 변경하세요!
-- INSERT INTO admins (user_id) VALUES ('여기에-사용자-UUID');

-- 확인 쿼리
-- SELECT * FROM admins;
