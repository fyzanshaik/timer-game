import { hc } from "hono/client";

const API_URL = import.meta.env.PROD ? "https://timer-game-api.fyzan-shaik.workers.dev" : "http://localhost:8787";

export const client = hc<any>(API_URL);
