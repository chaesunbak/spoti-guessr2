import { notFound } from "next/navigation";
import { ALLOWED_MODES, ALLOWED_GENRES, GameMode } from "@/types/game";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const gradientClasses = {
  all: "bg-gradient-to-br from-violet-700 via-fuchsia-500 to-orange-500",
  pop: "bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500",
  "k-pop": "bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500",
  "k-pop girl group": "bg-gradient-to-br from-pink-400 via-rose-400 to-red-400",
  "k-pop boy group":
    "bg-gradient-to-br from-blue-400 via-indigo-400 to-violet-400",
  "classic k-pop":
    "bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500",
  "hip-hop": "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500",
  "k-rap": "bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600",
  rock: "bg-gradient-to-br from-purple-500 via-red-500 to-orange-500",
  "classic rock": "bg-gradient-to-br from-red-600 via-orange-600 to-amber-600",
  "k-indie": "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500",
  trot: "bg-gradient-to-br from-rose-600 via-pink-600 to-red-600",
} as const;

interface PageProps {
  params: Promise<{
    mode: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const mode = (await params).mode as GameMode;

  // 허용된 모드인지 확인
  if (!ALLOWED_MODES.includes(mode)) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4" role="main">
      <h1 id="page-title" className="capitalize">
        Select Genre for {mode} Mode
      </h1>
      <nav
        className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
        aria-labelledby="page-title"
        role="navigation"
      >
        {ALLOWED_GENRES.map((genre) => {
          const gradientClass = gradientClasses[genre];
          return (
            <Link
              key={genre}
              href={`/game/${mode}/play?genre=${genre}`}
              className="group block aspect-video rounded-lg border-2 border-transparent text-white opacity-90 transition-opacity duration-300 hover:underline hover:opacity-100"
              aria-label={`Play ${mode} game with ${genre} genre`}
            >
              <Card
                className={cn(
                  "relative h-full w-full overflow-hidden p-6 transition-all duration-300",
                  gradientClass ||
                    "bg-gradient-to-br from-gray-500 via-slate-500 to-zinc-500", // Fallback gradient
                )}
              >
                <CardHeader className="relative z-10 flex h-full flex-col justify-end p-0">
                  <CardTitle
                    className="text-xl font-bold capitalize text-white md:text-2xl lg:text-3xl"
                    aria-hidden="true"
                  >
                    {genre}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

// 정적으로 가능한 경로 생성
export function generateStaticParams() {
  return ALLOWED_MODES.map((mode) => ({
    mode: mode,
  }));
}
