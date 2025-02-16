"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase/config";
import { setDoc, doc } from "firebase/firestore";
import { getRandomNum, setDelay } from "@/lib/utils";

type SpotifyData = {
  type: string;
  id: string;
  url: string;
};

const getAlbumAndUpload = async (ids: string[], token: string, toast: any) => {
  // ID 배열을 20개 단위로 분할
  const chunkedIds = [];
  for (let i = 0; i < ids.length; i += 20) {
    chunkedIds.push(ids.slice(i, i + 20));
  }

  for (const chunk of chunkedIds) {
    try {
      await setDelay(2000);

      const albumsResponse = await fetch(
        `https://api.spotify.com/v1/albums?ids=${chunk.join(",")}` /* 최대 20개 */,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!albumsResponse.ok) {
        throw new Error("Failed to fetch albums");
      }

      const albumsData = await albumsResponse.json();

      // 모든 첫 번째 아티스트의 ID를 모음
      const artistIds = albumsData.albums
        .map((album: any) => album.artists[0].id)
        .join(",");

      // 한 번에 모든 아티스트 정보를 가져옴
      const artistsResponse = await fetch(
        `https://api.spotify.com/v1/artists?ids=${artistIds}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!artistsResponse.ok) {
        throw new Error("Failed to fetch artists");
      }

      const artistsData = await artistsResponse.json();

      // 아티스트 ID를 키로 하여 아티스트 정보를 매핑
      const artistMap = artistsData.artists.reduce((map: any, artist: any) => {
        map[artist.id] = artist;
        return map;
      }, {});

      for (const album of albumsData.albums) {
        const artist = artistMap[album.artists[0].id];

        const docData = {
          id: album.id,
          type: album.type,
          spotifylink: album.external_urls.spotify,
          album_type: album.album_type,
          name: album.name,
          image: album.images[0]?.url,
          artist1_name: album.artists[0]?.name || null,
          artist1_id: album.artists[0]?.id || null,
          artist2_name: album.artists[1]?.name || null,
          artist2_id: album.artists[1]?.id || null,
          artist3_name: album.artists[2]?.name || null,
          artist3_id:
            album.artists[2]?.id ||
            null /* 앨범의 아티스트 이름은 세번째 아티스트까지만 가져옴 */,
          release_date: album.release_date,
          genres:
            artist.genres /* 앨범의 장르는 null인 경우가 많음, 앨범의 첫번째 아티스트의 장르를 가져옴*/,
          popularity: album.popularity,
          updatedAt: Date.now(),
          randomNum1: getRandomNum(0, 9999),
          randomNum2: getRandomNum(0, 9999),
          randomNum3: getRandomNum(0, 9999),
          preview_url:
            album.tracks.items[1]
              ?.preview_url /* 앨범의 두번째 트랙의 프리뷰를 가져옴. 앨범의 타이틀곡을 가져오고 싶은데 불가능한 것 같다...*/,
        };

        await setDoc(doc(db, "albums", album.id), docData);
        toast({
          title: "✅ 데이터 업로드 성공",
          description: `앨범 : ${album.name}`,
        });
      }
    } catch (error) {
      console.log("error", (error as Error).message);
      toast({
        title: "❗음..뭔가 잘못됬습니다.",
        description: (error as Error).message,
      });
    }
  }
};

const getArtistAndUpload = async (ids: string[], token: string, toast: any) => {
  // ID 배열을 20개 단위로 분할
  const chunkedIds = [];
  for (let i = 0; i < ids.length; i += 20) {
    chunkedIds.push(ids.slice(i, i + 20));
  }

  for (const chunk of chunkedIds) {
    try {
      const artistsResponse = await fetch(
        `https://api.spotify.com/v1/artists?ids=${chunk.join(",")}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!artistsResponse.ok) {
        throw new Error("Failed to fetch artists");
      }

      const artistsData = await artistsResponse.json();

      for (const artist of artistsData.artists) {
        await setDelay(2000);

        const top_tracksResponse = await fetch(
          `https://api.spotify.com/v1/artists/${artist.id}/top-tracks`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!top_tracksResponse.ok) {
          throw new Error("Failed to fetch top tracks");
        }

        const top_tracks = await top_tracksResponse.json();

        const docData = {
          id: artist.id,
          type: artist.type,
          name: artist.name,
          spotifylink: artist.external_urls.spotify,
          followers: artist.followers.total,
          image: artist.images[0]?.url,
          genres: artist.genres,
          popularity: artist.popularity,
          updatedAt: Date.now(),
          randomNum1: getRandomNum(0, 9999),
          randomNum2: getRandomNum(0, 9999),
          randomNum3: getRandomNum(0, 9999),
          preview_url: top_tracks.tracks[0]?.preview_url,
        };

        await setDoc(doc(db, "artists", artist.id), docData);
        toast({
          title: "✅ 데이터 업로드 성공",
          description: `아티스트 : ${artist.name}`,
        });
      }
    } catch (error) {
      console.log("error", (error as Error).message);
      toast({
        title: "❗ 음..뭔가 잘못됬습니다.",
        description: (error as Error).message,
      });
    }
  }
};

const getTrackAndUpload = async (ids: string[], token: string, toast: any) => {
  // 20개 단위로 분할
  const chunkedIds = [];
  for (let i = 0; i < ids.length; i += 20) {
    chunkedIds.push(ids.slice(i, i + 20));
  }

  for (const chunk of chunkedIds) {
    try {
      await setDelay(2000);
      const tracksResponse = await fetch(
        `https://api.spotify.com/v1/tracks/?ids=${chunk.join(",")}` /* 최대 20개 */,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!tracksResponse.ok) {
        throw new Error("Failed to fetch tracks");
      }

      const tracksData = await tracksResponse.json();

      // 모든 첫 번째 아티스트의 ID를 모음
      const artistIds = tracksData.tracks
        .map((track: any) => track.artists[0].id)
        .join(",");

      const artistsResponse = await fetch(
        `https://api.spotify.com/v1/artists?ids=${artistIds}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!artistsResponse.ok) {
        throw new Error("Failed to fetch artists");
      }

      const artistsData = await artistsResponse.json();

      // 아티스트 ID를 키로 하여 아티스트 정보를 매핑
      const artistMap = artistsData.artists.reduce((map: any, artist: any) => {
        map[artist.id] = artist;
        return map;
      }, {});

      for (const track of tracksData.tracks) {
        const artist = artistMap[track.artists[0].id];

        const docData = {
          id: track.id,
          type: track.type,
          name: track.name,
          explicit: track.explicit,
          spotifylink: track.external_urls.spotify,
          image: track.album.images[0]?.url,
          genres:
            artist.genres /* 트랙의 장르는 null인 경우가 많아 첫번째 아티스트의 장르를 가져옴 */,
          artist1_name: track.artists[0]?.name || null,
          artist1_id: track.artists[0]?.id || null,
          artist2_name: track.artists[1]?.name || null,
          artist2_id: track.artists[1]?.id || null,
          artist3_name: track.artists[2]?.name || null,
          artist3_id: track.artists[2]?.id || null,
          album_name: track.album.name,
          release_date: track.album.release_date,
          popularity: track.popularity,
          updatedAt: Date.now(),
          randomNum1: getRandomNum(0, 9999),
          randomNum2: getRandomNum(0, 9999),
          randomNum3: getRandomNum(0, 9999),
          preview_url: track.preview_url,
        };

        await setDoc(doc(db, "tracks", track.id), docData);
        toast({
          title: "✅ 데이터 업로드 성공",
          description: `트랙 : ${track.name}`,
        });
      }
    } catch (error) {
      console.log("error", (error as Error).message);
      toast({
        title: "❗음..뭔가 잘못됬습니다.",
        description: (error as Error).message,
      });
    }
  }
};

export default function Upload() {
  const [items, setItems] = useState<SpotifyData[]>([
    { type: "", id: "", url: "" },
  ]);
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const extractIdFromUrl = (url: string): SpotifyData => {
    const cleanUrl = url.trim();
    const match = cleanUrl.match(/spotify\.com\/(\w+)\/([a-zA-Z0-9]+)/);

    if (match) {
      return {
        type: match[1],
        id: match[2],
        url: url,
      };
    }

    return { type: "", id: "", url };
  };

  const getToken = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/spotify/token");
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch token");
      }

      setToken(data.access_token);

      toast({
        title: "✅ 토큰 가져오기 성공",
        description: "토큰을 가져왔습니다.",
      });
    } catch (error) {
      console.log("error", (error as Error).message);
      toast({
        title: "❗ 음..뭔가 잘못됬습니다.",
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const processIds = async () => {
    try {
      setLoading(true);

      // Group items by type
      const groupedItems = items.reduce(
        (acc, item) => {
          if (item.type && item.id) {
            acc[item.type] = acc[item.type] || [];
            acc[item.type].push(item.id);
          }
          return acc;
        },
        {} as Record<string, string[]>,
      );

      // Process each type
      for (const [type, ids] of Object.entries(groupedItems)) {
        // Split ids into chunks of 20
        for (let i = 0; i < ids.length; i += 20) {
          const chunk = ids.slice(i, i + 20);

          if (type === "album") {
            await getAlbumAndUpload(chunk, token as string, toast);
          } else if (type === "artist") {
            await getArtistAndUpload(chunk, token as string, toast);
          } else if (type === "track") {
            await getTrackAndUpload(chunk, token as string, toast);
          }
        }
      }

      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Get Token</CardTitle>
          <CardDescription>Get Spotify token</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={getToken} disabled={loading}>
            {loading ? "Processing..." : "Get Token"}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Paste Spotify URLs</CardTitle>
          <CardDescription>
            Paste any Spotify URL (artist/album/track)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="space-y-2">
              <Input
                placeholder="Paste Spotify URL"
                value={item.url}
                onChange={(e) => {
                  const newItems = [...items];
                  const spotifyData = extractIdFromUrl(e.target.value);
                  newItems[index] = spotifyData;
                  setItems(newItems);
                }}
              />
              {item.url && (
                <div className="text-sm text-muted-foreground">
                  Type: {item.type || "Unknown"} | ID:{" "}
                  {item.id || "Invalid URL"}
                </div>
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setItems([...items, { type: "", id: "", url: "" }])
              }
            >
              Add URL
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (items.length > 1) {
                  setItems(items.slice(0, -1));
                } else {
                  setItems([]);
                }
              }}
            >
              Remove URL
            </Button>
          </div>
          <Button
            className="w-full"
            onClick={processIds}
            disabled={loading || !token}
          >
            {loading ? "Processing..." : "Get Data"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
