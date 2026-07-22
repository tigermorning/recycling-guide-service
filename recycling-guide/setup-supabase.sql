-- ============================================
-- 1. 기존 정책 삭제 (이미 존재하는 경우)
-- ============================================
DROP POLICY IF EXISTS "All users can view classes" ON classes;
DROP POLICY IF EXISTS " authenticated users can view classes" ON classes;
DROP POLICY IF EXISTS "Authenticated users can insert classes" ON classes;
DROP POLICY IF EXISTS "Authenticated users can update classes" ON classes;
DROP POLICY IF EXISTS "Users can view own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can insert own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can update own enrollments" ON enrollments;

-- ============================================
-- 2. 클래스 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  max_capacity INTEGER NOT NULL CHECK (max_capacity > 0),
  current_count INTEGER NOT NULL DEFAULT 0 CHECK (current_count >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. 신청 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, class_id)
);

-- ============================================
-- 4. 인덱스 생성
-- ============================================
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class_id ON enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_classes_name ON classes(name);

-- ============================================
-- 5. RLS(Row Level Security) 활성화
-- ============================================
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. 클래스 테이블 정책
-- ============================================
CREATE POLICY "All users can view classes"
  ON classes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert classes"
  ON classes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update classes"
  ON classes FOR UPDATE
  TO authenticated
  USING (true);

-- ============================================
-- 7. 신청 테이블 정책 (행 수준 보안)
-- ============================================
CREATE POLICY "Users can view own enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrollments"
  ON enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments"
  ON enrollments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- 8. 원자적 신청 함수 (정원 초과 방지)
-- ============================================
CREATE OR REPLACE FUNCTION enroll_class(p_class_id UUID)
RETURNS JSON AS $$
DECLARE
  v_max_capacity INTEGER;
  v_current_count INTEGER;
  v_user_id UUID;
  v_result JSON;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', '로그인이 필요합니다'
    );
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM enrollments 
    WHERE user_id = v_user_id 
    AND class_id = p_class_id 
    AND status = 'confirmed'
  ) THEN
    RETURN json_build_object(
      'success', false,
      'message', '이미 신청한 클래스입니다'
    );
  END IF;
  
  SELECT max_capacity, current_count
  INTO v_max_capacity, v_current_count
  FROM classes
  WHERE id = p_class_id
  FOR UPDATE;
  
  IF v_max_capacity IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', '클래스를 찾을 수 없습니다'
    );
  END IF;
  
  IF v_current_count >= v_max_capacity THEN
    RETURN json_build_object(
      'success', false,
      'message', '정원이 초과되었습니다'
    );
  END IF;
  
  INSERT INTO enrollments (user_id, class_id, status)
  VALUES (v_user_id, p_class_id, 'confirmed');
  
  UPDATE classes
  SET current_count = current_count + 1,
      updated_at = NOW()
  WHERE id = p_class_id;
  
  RETURN json_build_object(
    'success', true,
    'message', '신청이 완료되었습니다',
    'remaining', v_max_capacity - v_current_count - 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. 신청 취소 함수
-- ============================================
CREATE OR REPLACE FUNCTION cancel_enrollment(p_class_id UUID)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_enrollment_exists BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', '로그인이 필요합니다'
    );
  END IF;
  
  SELECT EXISTS(
    SELECT 1 FROM enrollments
    WHERE user_id = v_user_id
    AND class_id = p_class_id
    AND status = 'confirmed'
  ) INTO v_enrollment_exists;
  
  IF NOT v_enrollment_exists THEN
    RETURN json_build_object(
      'success', false,
      'message', '신청 내역이 없습니다'
    );
  END IF;
  
  UPDATE enrollments
  SET status = 'cancelled'
  WHERE user_id = v_user_id
  AND class_id = p_class_id
  AND status = 'confirmed';
  
  UPDATE classes
  SET current_count = GREATEST(current_count - 1, 0),
      updated_at = NOW()
  WHERE id = p_class_id;
  
  RETURN json_build_object(
    'success', true,
    'message', '신청이 취소되었습니다'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 10. 남은 자리 조회 함수
-- ============================================
CREATE OR REPLACE FUNCTION get_class_status(p_class_id UUID)
RETURNS JSON AS $$
DECLARE
  v_class RECORD;
BEGIN
  SELECT 
    id,
    name,
    description,
    max_capacity,
    current_count,
    (max_capacity - current_count) as remaining
  INTO v_class
  FROM classes
  WHERE id = p_class_id;
  
  IF v_class IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', '클래스를 찾을 수 없습니다'
    );
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'class', json_build_object(
      'id', v_class.id,
      'name', v_class.name,
      'description', v_class.description,
      'max_capacity', v_class.max_capacity,
      'current_count', v_class.current_count,
      'remaining', v_class.remaining
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 11. 테스트용 클래스 데이터 삽입
-- ============================================
INSERT INTO classes (name, description, max_capacity, current_count) VALUES
  ('서울시 분리수거 기초', '분리수거의 기본 원칙과 품목별 배출 방법 학습', 30, 0),
  ('플라스틱 종류별 분리', 'PET, PVC, PS 등 플라스틱 재질 구분 및 배출 방법', 25, 0),
  ('종이류 분리수거 심화', '골판지, 종이팩, 코팅 종이 등 세부 기준 학습', 20, 0),
  ('대형폐기물 배출 방법', '냉장고, 세탁기, 가구 등 대형폐기물 처리 절차', 15, 0),
  ('음식물쓰레기 분리', '음식물쓰레기 배출 기준과 혼합 배출 방지 방법', 35, 0)
ON CONFLICT DO NOTHING;
