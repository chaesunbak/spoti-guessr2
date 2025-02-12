import { MetadataRoute } from "next";
import { ALLOWED_MODES, ALLOWED_GENRES } from "@/types/game";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://spoti-guessr.vercel.app";

  // 기본 페이지들
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/game`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  // 게임 모드 페이지들
  const gameModesPages = ALLOWED_MODES.map((mode) => ({
    url: `${baseUrl}/game/${mode}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 게임 모드별 장르 페이지들
  const gameGenrePages = ALLOWED_MODES.flatMap((mode) =>
    ALLOWED_GENRES.map((genre) => ({
      url: `${baseUrl}/game/${mode}/play?genre=${genre}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  );

  return [...staticPages, ...gameModesPages, ...gameGenrePages];
}
