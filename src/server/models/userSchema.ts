import { z } from "@hono/zod-openapi";

export const userSchema = z.object({
  user_id: z.string().uuid().openapi({
    example: "00000000-0000-0000-0000-000000000000",
    description: "Supabase auth.users.id",
  }),
  student_id: z.string().nullable().openapi({
    example: "23A1234",
    description: "学籍番号（NULL許可）",
  }),
  display_name: z.string().nullable().openapi({
    example: "田中 太郎",
    description: "表示名（NULL許可）",
  }),
  avatar_url: z.string().nullable().openapi({
    example: "https://example.com/avatar.png",
    description: "アイコン画像URL（NULL許可）",
  }),
  faculty: z.string().nullable().openapi({
    example: "工学部",
    description: "学部（NULL許可）",
  }),
  grade: z.number().int().nullable().openapi({
    example: 3,
    description: "学年（NULL許可）",
  }),
  bio: z.string().nullable().openapi({
    example: "よろしくお願いします。",
    description: "自己紹介（NULL許可）",
  }),
  created_at: z.string().openapi({
    example: "2026-01-01T00:00:00.000Z",
  }),
  updated_at: z.string().openapi({
    example: "2026-01-01T00:00:00.000Z",
  }),
});

export const usersSchema = z.array(userSchema);

export type User = z.infer<typeof userSchema>;
