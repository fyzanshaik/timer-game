import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { createDb, users, scores } from "@timer-game/db";
import type { UserCheckRequest, UserCheckResponse } from "@timer-game/types";
import type { Env } from "../lib/env";
import { KVCache } from "../lib/kv";

const app = new Hono<{ Bindings: Env }>();

app.post("/userCheck", async (c) => {
  const body = await c.req.json<UserCheckRequest>();
  const { userName } = body;

  if (!userName || userName.trim() === "") {
    return c.json({ error: "Username is required" }, 400);
  }

  const db = createDb(c.env.DB);
  const cache = new KVCache(c.env.CACHE);
  const cacheKey = cache.userKey(userName);

  const cachedData = await cache.get<UserCheckResponse>(cacheKey);
  if (cachedData) {
    console.log("Serving from cache: userdata");
    return c.json(cachedData);
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.username, userName),
    with: {
      scores: true,
    },
  });

  if (existingUser) {
    const response: UserCheckResponse = {
      message: "User already exists",
      id: existingUser.id,
      username: existingUser.username,
      scores: existingUser.scores,
    };
    await cache.set(cacheKey, response, 3600);
    return c.json(response);
  }

  const [newUser] = await db.insert(users).values({ username: userName }).returning();

  const [newScore] = await db.insert(scores).values({ userId: newUser.id }).returning();

  const response: UserCheckResponse = {
    message: "User created successfully",
    id: newUser.id,
    username: newUser.username,
    scores: [newScore],
  };

  await cache.set(cacheKey, response, 3600);
  return c.json(response, 201);
});

export default app;
