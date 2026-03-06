import { createRoute, z } from "@hono/zod-openapi";
import { userSchema, usersSchema } from "../models/userSchema";

const errorSchema = z.object({
  message: z.string().openapi({ example: "Something went wrong" }),
});

export const getUsersRoute = createRoute({
  method: "get",
  path: "/",
  summary: "プロフィール取得（自分）",
  description:
    "認証済みユーザー自身のプロフィールを返します。RLS により自分のレコードのみ返ります（0件の場合は空配列）。",
  tags: ["users"],
  responses: {
    401: {
      description: "認証されていません",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    200: {
      description: "プロフィールを取得しました",
      content: {
        "application/json": {
          schema: usersSchema,
        },
      },
    },
    500: {
      description: "プロフィールの取得に失敗しました",
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
  summary: "プロフィール取得（user_id 指定）",
  description:
    "指定した user_id のプロフィールを返します。RLS により自分以外は取得できません（自分以外の場合は 404 を返します）。",
  tags: ["users"],
  request: {
    params: z.object({
      id: z.string().uuid().openapi({
        example: "00000000-0000-0000-0000-000000000000",
        description: "auth.users.id",
      }),
    }),
  },
  responses: {
    401: {
      description: "認証されていません",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
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
