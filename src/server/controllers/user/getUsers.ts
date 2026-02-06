import type { Context } from "hono";
import { db } from "@/db/db";
import { users } from "@/db/schema/users";
import { usersSchema } from "../../models/userSchema";

export const getUsersHandler = async (c: Context) => {
  try {
    const usersData = await db.select().from(users);
    return c.json(usersSchema.parse(usersData), 200);
  } catch (err) {
    console.error("[getUsersHandler]", err);
    return c.json({ message: "Failed to fetch users" }, 500);
  }
};
