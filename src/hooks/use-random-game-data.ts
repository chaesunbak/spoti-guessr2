import { useQuery } from "@tanstack/react-query";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { GameMode, GameGenre } from "@/types/game";
import { getRandomNumber } from "@/lib/utils";

async function getRandomDocument(mode: GameMode, genre: GameGenre) {
  const randomNum = getRandomNumber(0, 9999);
  const randomNumIndex = ["randomNum1", "randomNum3", "randomNum2"][
    getRandomNumber(0, 2)
  ];

  // 첫 번째 쿼리 생성
  const firstQuery =
    genre === "all"
      ? query(
          collection(db, mode),
          where(randomNumIndex, ">=", randomNum),
          orderBy(randomNumIndex, "asc"),
          limit(1)
        )
      : query(
          collection(db, mode),
          where("genres", "array-contains", genre),
          where(randomNumIndex, ">=", randomNum),
          orderBy(randomNumIndex, "asc"),
          limit(1)
        );

  // 두 번째 쿼리 생성 (첫 번째 쿼리가 실패할 경우 사용)
  const secondQuery =
    genre === "all"
      ? query(
          collection(db, mode),
          where(randomNumIndex, "<=", randomNum),
          orderBy(randomNumIndex, "desc"),
          limit(1)
        )
      : query(
          collection(db, mode),
          where("genres", "array-contains", genre),
          where(randomNumIndex, "<=", randomNum),
          orderBy(randomNumIndex, "desc"),
          limit(1)
        );

  try {
    let querySnapshot = await getDocs(firstQuery);
    if (querySnapshot.empty) {
      querySnapshot = await getDocs(secondQuery);
    }

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as any;
    }
    throw new Error("No documents found");
  } catch (error) {
    console.error("Error fetching random document:", error);
    throw error;
  }
}

async function getTwoRandomDocuments(mode: GameMode, genre: GameGenre) {
  const firstDoc = await getRandomDocument(mode, genre);
  let secondDoc;

  do {
    secondDoc = await getRandomDocument(mode, genre);
  } while (secondDoc.id === firstDoc.id);

  return [firstDoc, secondDoc];
}

export function useRandomGameData(mode: GameMode, genre: GameGenre) {
  return useQuery({
    queryKey: ["gameData", mode, genre],
    queryFn: () => getTwoRandomDocuments(mode, genre),
    staleTime: 0, // 캐시를 사용하지 않음
    refetchOnWindowFocus: false, // 윈도우 포커스시 리페치 방지
  });
}
