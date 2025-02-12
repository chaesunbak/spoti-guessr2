export const ALLOWED_MODES = ["artists", "albums", "tracks"] as const;
export const ALLOWED_GENRES = [
  "all",
  "pop",
  "k-pop",
  "k-pop girl group",
  "k-pop boy group",
  "classic k-pop",
  "hip-hop",
  "k-rap",
  "rock",
  "classic rock",
  "k-indie",
  "trot",
] as const;

export type GameMode = (typeof ALLOWED_MODES)[number];
export type GameGenre = (typeof ALLOWED_GENRES)[number];

export type GameStatus = "ready" | "playing" | "finished";

export interface GameState {
  status: GameStatus;
  score: number;
  currentRound: number;
  totalRounds: number;
  startTime?: Date;
  endTime?: Date;
}

export interface Album {
  album_type: string;
  artist1_id: string;
  artist1_name: string;
  artist2_id: string | null;
  artist2_name: string | null;
  artist3_id: string | null;
  artist3_name: string | null;
  genres: string[];
  id: string;
  image: string;
  name: string;
  popularity: number;
  preview_url: string;
  randomNum1: number;
  randomNum2: number;
  randomNum3: number;
  release_date: string;
  spotifylink: string;
  type: "album";
  updatedAt: number;
}

export interface Artist {
  followers: number;
  genres: string[];
  id: string;
  image: string;
  name: string;
  popularity: number;
  preview_url: string;
  randomNum1: number;
  randomNum2: number;
  randomNum3: number;
  spotifylink: string;
  type: "artist";
  updatedAt: number;
}

export interface Track {
  album_name: string;
  artist1_id: string;
  artist1_name: string;
  artist2_id: string | null;
  artist2_name: string | null;
  artist3_id: string | null;
  artist3_name: string | null;
  explicit: boolean;
  genres: string[];
  id: string;
  image: string;
  name: string;
  popularity: number;
  preview_url: string;
  randomNum1: number;
  randomNum2: number;
  randomNum3: number;
  release_date: string;
  spotifylink: string;
  type: "track";
  updatedAt: number;
}

// 타입 가드 함수들
export function isAlbum(item: unknown): item is Album {
  return (
    typeof item === "object" &&
    item !== null &&
    "type" in item &&
    item.type === "album"
  );
}

export function isArtist(item: unknown): item is Artist {
  return (
    typeof item === "object" &&
    item !== null &&
    "type" in item &&
    item.type === "artist"
  );
}

export function isTrack(item: unknown): item is Track {
  return (
    typeof item === "object" &&
    item !== null &&
    "type" in item &&
    item.type === "track"
  );
}

export type GameItem = Album | Artist | Track;
