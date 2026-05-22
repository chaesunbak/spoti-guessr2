import { useQuery } from "@tanstack/react-query";
import { GameMode, GameGenre } from "@/types/game";
import { getTwoRandomDocuments } from "@/lib/firebase/game-service";
import { sendGAEvent } from "@next/third-parties/google";

export function useRandomGameData(mode: GameMode, genre: GameGenre) {
  return useQuery({
    queryKey: ["gameData", mode, genre],
    queryFn: async () => {
      try {
        return await getTwoRandomDocuments(mode, genre);
      } catch (error) {
        console.error("Error fetching random document:", error);
        sendGAEvent("event", "data_fetch_error", {
          mode,
          genre,
          error: (error as Error).message,
        });
        throw error;
      }
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}
