import { setDoc, doc } from "firebase/firestore";
import { db } from "./config";

export async function upsertAlbum(id: string, data: Record<string, unknown>): Promise<void> {
  await setDoc(doc(db, "albums", id), data);
}

export async function upsertArtist(id: string, data: Record<string, unknown>): Promise<void> {
  await setDoc(doc(db, "artists", id), data);
}

export async function upsertTrack(id: string, data: Record<string, unknown>): Promise<void> {
  await setDoc(doc(db, "tracks", id), data);
}
