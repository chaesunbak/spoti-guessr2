"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/components/providers/auth-store-provider";
import { auth } from "@/lib/firebase/config";

export function useLogout() {
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // firebase logout
      await auth.signOut();

      // remove cookie through server action
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      // reset store
      logoutUser();

      toast({
        title: "Logged out",
        description: "You have been logged out",
      });

      router.push("/");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return { handleLogout };
}
