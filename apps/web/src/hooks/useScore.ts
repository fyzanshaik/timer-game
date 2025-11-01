import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../lib/api";
import type { UpdateScoreRequest } from "@timer-game/types";

export function useUpdateScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateScoreRequest) => {
      // @ts-expect-error - Hono RPC type safety
      const response = await client.api.users.updateScore.$post({
        json: data,
      });
      if (!response.ok) {
        throw new Error("Failed to update score");
      }
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user", variables.userName] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard", variables.timerName] });
    },
  });
}
