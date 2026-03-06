-- 学生番号の重複を許可するため、一意制約を削除

ALTER TABLE "profiles"
  DROP CONSTRAINT IF EXISTS "profiles_student_id_unique";

