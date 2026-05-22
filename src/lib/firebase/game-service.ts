import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "./config";
import { GameMode, GameGenre, GameItem } from "@/types/game";
import { getRandomNumber } from "@/lib/utils";

async function getRandomDocument(mode: GameMode, genre: GameGenre) {
  const randomNum = getRandomNumber(0, 9999);
  const randomNumIndex = ["randomNum1", "randomNum3", "randomNum2"][
    getRandomNumber(0, 2)
  ];

  const firstQuery =
    genre === "all"
      ? query(
          collection(db, mode),
          where(randomNumIndex, ">=", randomNum),
          orderBy(randomNumIndex, "asc"),
          limit(1),
        )
      : query(
          collection(db, mode),
          where("genres", "array-contains", genre),
          where(randomNumIndex, ">=", randomNum),
          orderBy(randomNumIndex, "asc"),
          limit(1),
        );

  const secondQuery =
    genre === "all"
      ? query(
          collection(db, mode),
          where(randomNumIndex, "<=", randomNum),
          orderBy(randomNumIndex, "desc"),
          limit(1),
        )
      : query(
          collection(db, mode),
          where("genres", "array-contains", genre),
          where(randomNumIndex, "<=", randomNum),
          orderBy(randomNumIndex, "desc"),
          limit(1),
        );

  let querySnapshot = await getDocs(firstQuery);
  if (querySnapshot.empty) {
    querySnapshot = await getDocs(secondQuery);
  }

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as GameItem;
  }
  throw new Error("No documents found");
}

export async function getTwoRandomDocuments(mode: GameMode, genre: GameGenre) {
  const firstDoc = await getRandomDocument(mode, genre);
  let secondDoc;

  do {
    secondDoc = await getRandomDocument(mode, genre);
  } while (secondDoc.id === firstDoc.id);

  return [firstDoc, secondDoc];
}
