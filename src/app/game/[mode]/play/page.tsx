import { notFound } from "next/navigation";
import {
  ALLOWED_MODES,
  ALLOWED_GENRES,
  GameMode,
  GameGenre,
} from "@/types/game";
import { GameContainer } from "@/app/game/[mode]/play/_components/game-container";

interface PageProps {
  params: Promise<{
    mode: string;
  }>;
  searchParams: Promise<{
    genre?: string;
  }>;
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

  return <GameContainer mode={mode} genre={validGenre} />;
}
