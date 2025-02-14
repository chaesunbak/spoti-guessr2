import { useAuthStore } from "@/stores/use-auth-store";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function useLogout() {
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    logoutUser();

    toast({
      title: "Logged out",
      description: "You have been logged out",
    });
    router.push("/");
  };

  return { handleLogout };
}
