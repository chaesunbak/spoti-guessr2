"use client";

import { useState } from "react";
import {
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { useAuthStore } from "@/stores/use-auth-store";
import { getRandomNickname } from "@/lib/utils";
import type { User } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export const useContinueWithGoogle = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const loginUser = useAuthStore((state) => state.loginUser);
  const provider = new GoogleAuthProvider();
  const { toast } = useToast();
  const router = useRouter();
  const isMobile = useIsMobile();

  const continueWithGoogle = async () => {
    setLoading(true);
    try {
      let result;

      if (isMobile) {
        result = await signInWithRedirect(auth, provider);
      } else {
        result = await signInWithPopup(auth, provider);
      }

      const newUser = result.user;
      const userRef = doc(db, "users", newUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // login
        const userDoc = userSnap.data();
        loginUser(userDoc as User);

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
