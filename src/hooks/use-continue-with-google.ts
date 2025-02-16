"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { getRandomNickname } from "@/lib/utils";
import type { User } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/components/providers/auth-store-provider";

export const useContinueWithGoogle = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const loginUser = useAuthStore((state) => state.loginUser);
  const provider = new GoogleAuthProvider();
  const { toast } = useToast();
  const router = useRouter();

  const continueWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const newUser = result.user;
      const userRef = doc(db, "users", newUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userDoc = userSnap.data() as User;

        console.log("User data for token:", userDoc);

        // Request token from server
        const response = await fetch("/api/auth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: userDoc }),
        });

        if (!response.ok) {
          throw new Error("Failed to get auth token");
        }

        loginUser(userDoc);

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });

        router.push("/");
      } else {
        // signup
        const userDoc = {
          uid: newUser.uid,
          email: newUser.email,
          nickname: getRandomNickname(),
          createdAt: Date.now(),
          permission: "read-only",
        };
        await setDoc(doc(db, "users", newUser.uid), userDoc);
        loginUser(userDoc as User);

        toast({
          title: "Welcome to Spoti-Guessr!",
          description: "You have successfully signed up.",
        });

        router.push("/");
      }
    } catch (error) {
      console.error(error);
      setError(error as Error);
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { continueWithGoogle, loading, error };
};
