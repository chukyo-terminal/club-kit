import type { Context } from "hono";
import { userSchema } from "../../models/userSchema";
import { createSupabaseAuthedClient } from "../../utils/createSupabaseAuthedClient";

export const getUserHandler = async (c: Context) => {
  try {
    const userId = c.req.param("id");

    const authHeader = c.req.header("authorization");
    const token = authHeader?.toLowerCase().startsWith("bearer ")
      ? authHeader.slice("bearer ".length)
      : null;

    if (!token) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const authUser = c.get("user") as { id?: string } | undefined;
    if (!authUser?.id || authUser.id !== userId) {
      return c.json({ message: "User not found" }, 404);
    }

    const supabase = createSupabaseAuthedClient(token);
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("[getUserHandler][supabase]", error);
      return c.json({ message: "Failed to fetch user" }, 500);
    }

    if (!profile) {
      return c.json({ message: "User not found" }, 404);
    }

    return c.json(userSchema.parse(profile), 200);
  } catch (err) {
    console.error("[getUserHandler]", err);
    return c.json({ message: "Failed to fetch user" }, 500);
  }
};
