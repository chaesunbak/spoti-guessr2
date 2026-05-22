"use client";

import { useState } from "react";
import { signInWithGoogle } from "@/lib/firebase/auth-service";
import { getUser, createUser } from "@/lib/firebase/user-service";
import { getRandomNickname } from "@/lib/utils";
import type { User } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/providers/auth-store-provider";

export const useContinueWithGoogle = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const loginUser = useAuthStore((state) => state.loginUser);
  const { toast } = useToast();
  const router = useRouter();

  const continueWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      const newUser = result.user;
      const userDoc = await getUser(newUser.uid);

      if (userDoc) {
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
        const newUserDoc: User = {
          uid: newUser.uid,
          email: newUser.email ?? "",
          nickname: getRandomNickname(),
          createdAt: Date.now(),
          permission: "read-only",
        };
        await createUser(newUser.uid, newUserDoc);
        loginUser(newUserDoc);

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
