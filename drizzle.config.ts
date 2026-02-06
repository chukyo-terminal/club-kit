import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { requireEnv } from "./src/lib/env";

config({ path: ".env" });

export default defineConfig({
  // フォルダ内にあるスキーマファイルを読み込む
  schema: "./src/db/schema",
  // Supabase へのマイグレーションファイルを出力するディレクトリ
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: requireEnv("DATABASE_URL"),
  },
});
