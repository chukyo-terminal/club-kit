import { eq } from "drizzle-orm";
import type { Context } from "hono";
import { db } from "@/db/db";
import { users } from "@/db/schema/users";
import { userSchema } from "../../models/userSchema";

export const getUserHandler = async (c: Context) => {
  try {
    const userId = Number(c.req.param("id"));

    const userData = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!userData) {
      return c.json({ message: "User not found" }, 404);
    }

    return c.json(userSchema.parse(userData), 200);
  } catch (err) {
    console.error("[getUserHandler]", err);
    return c.json({ message: "Failed to fetch user" }, 500);
  }
};
