import { Hono } from "hono";
import { eq, desc } from "drizzle-orm";
import { createDb, scores } from "@timer-game/db";
import type { UpdateScoreRequest, UpdateScoreResponse, LeaderboardEntry } from "@timer-game/types";
import type { Env } from "../lib/env";
import { KVCache } from "../lib/kv";

const app = new Hono<{ Bindings: Env }>();

const validTimers = ["timer1Score", "timer5Score", "timer10Score", "timer15Score", "timer30Score"] as const;

app.post("/updateScore", async (c) => {
  const body = await c.req.json<UpdateScoreRequest>();
  const { userId, timerName, newScore, userName } = body;

  if (!validTimers.includes(timerName)) {
    return c.json({ message: "Invalid timer name." }, 400);
  }

  const db = createDb(c.env.DB);
  const cache = new KVCache(c.env.CACHE);

  const userScores = await db.query.scores.findFirst({
    where: eq(scores.userId, userId),
  });

  if (!userScores) {
    return c.json({ message: "User scores not found." }, 404);
  }

  const currentScore = userScores[timerName];

  if (newScore > currentScore) {
    const [updatedScore] = await db
      .update(scores)
      .set({ [timerName]: newScore })
      .where(eq(scores.userId, userId))
      .returning();

    await cache.deleteMany(cache.userKey(userName), cache.leaderboardKey(timerName));

    const response: UpdateScoreResponse = {
      message: "Score updated successfully.",
      updatedScore,
    };
    return c.json(response);
  }

  return c.json({ message: "New score is not higher. No update needed." });
});

app.get("/leaderboard/:timerName", async (c) => {
  const timerName = c.req.param("timerName");

  if (!validTimers.includes(timerName as (typeof validTimers)[number])) {
    return c.json({ error: "Invalid timer name." }, 400);
  }

  const db = createDb(c.env.DB);
  const cache = new KVCache(c.env.CACHE);
  const cacheKey = cache.leaderboardKey(timerName);

  const cachedData = await cache.get<LeaderboardEntry[]>(cacheKey);
  if (cachedData) {
    console.log(`Serving from cache: leaderboard ${timerName}`);
    return c.json(cachedData);
  }

  const leaderboard = await db.query.scores.findMany({
    orderBy: [desc(scores[timerName as keyof typeof scores])],
    limit: 10,
    with: {
      user: {
        columns: {
          username: true,
        },
      },
    },
  });

  await cache.set(cacheKey, leaderboard, 300);
  return c.json(leaderboard);
});

export default app;
