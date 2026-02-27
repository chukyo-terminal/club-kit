import { pgTable, smallint, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// Supabase の auth.users と 1:1 で紐づくプロフィールテーブル
export const profiles = pgTable("profiles", {
  userId: uuid("user_id").primaryKey(),
  studentId: varchar("student_id", { length: 255 }).unique(),
  displayName: varchar("display_name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  faculty: varchar("faculty", { length: 255 }),
  grade: smallint("grade"),
  bio: text("bio"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
