import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

export function useBeforeUnload(
  shouldPreventUnload: boolean,
  message = "Are you sure you want to leave the game? Your current progress will not be saved.",
) {
  const pathname = usePathname();

  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (shouldPreventUnload) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    },
    [shouldPreventUnload, message],
  );

  const handleAnchorClick = useCallback(
    (e: MouseEvent) => {
      if (!shouldPreventUnload) return;

      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;

      // Same page anchor links should be ignored
      if (anchor.getAttribute("href")?.startsWith("#")) return;

      // Check if it's an internal navigation
      const href = anchor.getAttribute("href");
      if (
        href &&
        (href.startsWith("/") || href.startsWith(window.location.origin))
      ) {
        if (!window.confirm(message)) {
          e.preventDefault();
        }
      }
    },
    [shouldPreventUnload, message],
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleAnchorClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, [handleBeforeUnload, handleAnchorClick]);

  return pathname;
}
