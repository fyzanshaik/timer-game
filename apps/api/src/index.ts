import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./lib/env";
import usersRoute from "./routes/users";
import scoresRoute from "./routes/scores";

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "https://timer-game.pages.dev", "https://69f0a4a9.timer-game.pages.dev"],
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.json({
    message: "SERVER IS UP & RUNNING",
  });
});

const _routes = app.basePath("/api/users").route("/", usersRoute).route("/", scoresRoute);

export default app;
export type AppType = typeof _routes;
