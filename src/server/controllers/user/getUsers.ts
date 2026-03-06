import type { Context } from "hono";
import { usersSchema } from "../../models/userSchema";
import { createSupabaseAuthedClient } from "../../utils/createSupabaseAuthedClient";

export const getUsersHandler = async (c: Context) => {
  try {
    const authHeader = c.req.header("authorization");
    const token = authHeader?.toLowerCase().startsWith("bearer ")
      ? authHeader.slice("bearer ".length)
      : null;

    if (!token) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const supabase = createSupabaseAuthedClient(token);
    const { data, error } = await supabase.from("profiles").select("*");

    if (error) {
      console.error("[getUsersHandler][supabase]", error);
      return c.json({ message: "Failed to fetch users" }, 500);
    }

    return c.json(usersSchema.parse(data ?? []), 200);
  } catch (err) {
    console.error("[getUsersHandler]", err);
    return c.json({ message: "Failed to fetch users" }, 500);
  }
};
