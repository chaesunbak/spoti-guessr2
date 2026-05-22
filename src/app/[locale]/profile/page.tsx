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
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/use-logout";
import { useAuthStore } from "@/providers/auth-store-provider";
import { useTranslations } from "next-intl";

export default function Profile() {
  const t = useTranslations("profile");
  const user = useAuthStore((state) => state.user);
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { handleLogout } = useLogout();

  const handleDeleteAccount = async () => {
    if (!user) {
      return;
    }

    if (!confirm(t("deleteConfirm"))) {
      return;
    }
    setIsDeleting(true);

    try {
      const { deleteDoc, doc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase/config");
      await deleteDoc(doc(db, "users", user.uid));

      logoutUser();

      toast({
        title: t("deleteSuccess"),
        description: t("deleteSuccessDesc"),
      });

      router.push("/");
    } catch (error) {
      toast({
        title: t("deleteError"),
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("manageAccount")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <p>{t("email", { email: user.email })}</p>
            <p>{t("nickname", { nickname: user.nickname })}</p>
            <p>
              {t("createdAt", {
                date: new Date(user.createdAt).toLocaleDateString(),
              })}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleLogout}>
            {t("logout")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              t("deleteAccount")
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
