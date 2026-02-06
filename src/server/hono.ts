import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { getUserHandler } from "./controllers/user/getUser";

import { getUsersHandler } from "./controllers/user/getUsers";
import { getUserRoute, getUsersRoute } from "./routes/userRoutes";

export const app = new OpenAPIHono().basePath("/api");

const userApp = new OpenAPIHono()
  .openapi(getUsersRoute, getUsersHandler)
  .openapi(getUserRoute, getUserHandler);

app.route("/users", userApp);

app
  .doc("/specification", {
    openapi: "3.0.0",
    info: { title: "Honote API", version: "1.0.0" },
  })
  .get("/doc", swaggerUI({ url: "/api/specification" }));

export default app;
