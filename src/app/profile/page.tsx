"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useAuthStore } from "@/stores/use-auth-store";
import { useToast } from "@/hooks/use-toast";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/use-logout";
import { useEffect } from "react";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { handleLogout } = useLogout();

  useEffect(() => {
    if (!user) {
      router.push("/auth");
    }
  }, [user, router]);

  const handleDeleteAccount = async () => {
    if (!user) {
      return;
    }

    if (!confirm("Are you sure you want to delete your account?")) {
      return;
    }
    setIsDeleting(true);

    try {
      await deleteDoc(doc(db, "users", user.uid));

      logoutUser();

      toast({
        title: "Account deleted",
        description: "Your account has been deleted",
      });

      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <p>Email: {user.email}</p>
            <p>Nickname: {user.nickname}</p>
            <p>Created At: {new Date(user.createdAt).toLocaleDateString()}</p>

            <p>Permission: {user.permission}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Delete Account"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
