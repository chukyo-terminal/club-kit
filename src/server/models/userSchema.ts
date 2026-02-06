import { z } from "@hono/zod-openapi";

export const userSchema = z.object({
  id: z.number().openapi({
    example: 1,
  }),
  name: z.string().openapi({
    example: "John Doe",
  }),
});

export const usersSchema = z.array(userSchema);

export type User = z.infer<typeof userSchema>;
