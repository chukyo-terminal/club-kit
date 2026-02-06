import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { requireEnv } from "@/lib/env";
import * as schema from "./schema";

const connectionString = requireEnv("DATABASE_URL");

// Supabase（transaction pool mode）対策
export const client = postgres(connectionString, {
  prepare: false,
});

export const db = drizzle(client, {
  schema,
});
