import { notFound } from "next/navigation";
import {
  ALLOWED_MODES,
  ALLOWED_GENRES,
  GameMode,
  GameGenre,
} from "@/types/game";
import { GameContainer } from "@/app/game/[mode]/play/_components/game-container";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    mode: string;
  }>;
  searchParams: Promise<{
    genre?: string;
  }>;
}

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const mode = (await params).mode;
  const genre = (await searchParams).genre;

  return {
    title: `Playing ${mode} - ${genre || "All"} | Spoti-Guessr`,
    description: `Play Spoti-Guessr ${mode} game with ${genre || "all"} genre. Guess which ${mode} is more popular on Spotify!`,
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const mode = (await params).mode as GameMode;
  const genre = (await searchParams).genre;

  // 허용된 모드와 장르인지 확인
  if (
    !ALLOWED_MODES.includes((await params).mode as GameMode) ||
    !genre ||
    !ALLOWED_GENRES.includes(genre as GameGenre)
  ) {
    notFound();
  }

  const validGenre = genre as GameGenre;

  return (
    <div role="main" aria-label={`${mode} game with ${validGenre} genre`}>
      <GameContainer mode={mode} genre={validGenre} />
    </div>
  );
}
