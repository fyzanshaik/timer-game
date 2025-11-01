import { useQuery } from "@tanstack/react-query";
import { client } from "../lib/api";
import type { UserCheckRequest } from "@timer-game/types";

export function useCheckUser(userName: string) {
  return useQuery({
    queryKey: ["user", userName],
    queryFn: async () => {
      if (!userName || userName.trim() === "unknown") {
        return null;
      }
      // @ts-expect-error - Hono RPC type safety
      const response = await client.api.users.userCheck.$post({
        json: { userName } as UserCheckRequest,
      });
      if (!response.ok) {
        throw new Error("Failed to check user");
      }
      return await response.json();
    },
    enabled: !!userName && userName.trim() !== "unknown",
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserSession() {
  const setUserName = (userName: string) => {
    localStorage.setItem("userName", userName);
  };

  const getUserName = () => {
    return localStorage.getItem("userName") || "unknown";
  };

  return { setUserName, getUserName };
}
