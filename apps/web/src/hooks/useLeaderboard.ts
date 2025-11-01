import { useQuery } from "@tanstack/react-query";
import { client } from "../lib/api";
import type { TimerScoreKey } from "@timer-game/types";

export function useLeaderboard(timerName: TimerScoreKey) {
  return useQuery({
    queryKey: ["leaderboard", timerName],
    queryFn: async () => {
      // @ts-expect-error - Hono RPC type safety
      const response = await client.api.users.leaderboard[":timerName"].$get({
        param: { timerName },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      return await response.json();
    },
    staleTime: 1000 * 30,
  });
}
