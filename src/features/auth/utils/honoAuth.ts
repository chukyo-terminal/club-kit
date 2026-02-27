import { createClient } from "@supabase/supabase-js";
import type { Context, Next } from "hono";

import { requireEnv } from "@/lib/env";

const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function honoAuthMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("authorization");

  if (!authHeader?.toLowerCase().startsWith("bearer ")) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const token = authHeader.slice("bearer ".length);

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  c.set("user", data.user);

  await next();
}
