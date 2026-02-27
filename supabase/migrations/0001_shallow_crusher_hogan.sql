CREATE TABLE "profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"student_id" varchar(255),
	"display_name" varchar(255),
	"avatar_url" text,
	"faculty" varchar(255),
	"grade" smallint,
	"bio" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_student_id_unique" UNIQUE("student_id")
);

-- RLS を有効化
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;

-- 自分のプロフィールのみ参照可能
CREATE POLICY "Profiles can be viewed by owner"
ON "profiles"
FOR SELECT
USING (auth.uid() = user_id);

-- 自分のプロフィールのみ作成可能
CREATE POLICY "Profiles can be inserted by owner"
ON "profiles"
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 自分のプロフィールのみ更新可能
CREATE POLICY "Profiles can be updated by owner"
ON "profiles"
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 新しい auth.users 行が作成されたときに、対応する profiles 行を自動作成するトリガー関数
create function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    )
  );

  return new;
end;
$$ language plpgsql
security definer
set search_path = public;

-- auth.users への insert 後に profiles を自動作成するトリガー
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_auth_user();
