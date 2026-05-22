import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config";
import type { User } from "@/types/user";

export async function getUser(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as User) : null;
}

export async function createUser(uid: string, data: User): Promise<void> {
  await setDoc(doc(db, "users", uid), data);
}

export async function deleteUser(uid: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid));
}
