import { createRoute, z } from "@hono/zod-openapi";
import { userSchema, usersSchema } from "../models/userSchema";

const errorSchema = z.object({
  message: z.string().openapi({ example: "Something went wrong" }),
});

export const getUsersRoute = createRoute({
  method: "get",
  path: "/",
  summary: "ユーザー一覧取得",
  description: "登録されているユーザーの一覧を返します。0件の場合は空配列を返します。",
  tags: ["users"],
  responses: {
    200: {
      description: "ユーザー一覧を取得しました",
      content: {
        "application/json": {
          schema: usersSchema,
        },
      },
    },
    500: {
      description: "ユーザー一覧の取得に失敗しました",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});

export const getUserRoute = createRoute({
  method: "get",
  path: "/{id}",
  summary: "ユーザー取得",
  description: "指定したユーザーIDのユーザーを返します。存在しない場合は 404 を返します。",
  tags: ["users"],
  request: {
    params: z.object({
      id: z.coerce.number().int().positive().openapi({
        example: 1,
        description: "ユーザーID",
      }),
    }),
  },
  responses: {
    200: {
      description: "ユーザーを取得しました",
      content: {
        "application/json": {
          schema: userSchema,
        },
      },
    },
    404: {
      description: "ユーザーが見つかりませんでした",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    500: {
      description: "ユーザーの取得に失敗しました",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});
