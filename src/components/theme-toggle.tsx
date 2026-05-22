"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="relative overflow-hidden"
        aria-label="Loading theme switcher"
        disabled
      >
        <div className="invisible" aria-hidden="true">
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        </div>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative overflow-hidden"
          aria-label={`Current theme: ${theme}. Click to show theme options`}
          title={`Current theme: ${theme}. Click to show theme options`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === "light" ? (
              <motion.div
                key="light"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{
                  opacity: 1,
                  scale: [0.3, 1.2, 1],
                }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{
                  duration: 0.4,
                  ease: [0.175, 0.885, 0.32, 1.275],
                  scale: {
                    times: [0, 0.6, 1],
                  },
                }}
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              </motion.div>
            ) : (
              <motion.div
                key="dark"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{
                  opacity: 1,
                  scale: [0.3, 1.2, 1],
                }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{
                  duration: 0.4,
                  ease: [0.175, 0.885, 0.32, 1.275],
                  scale: {
                    times: [0, 0.6, 1],
                  },
                }}
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="invisible" aria-hidden="true">
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          onSelect={() => setTheme("light")}
          role="menuitemradio"
          aria-checked={theme === "light"}
          aria-label="Switch to light theme"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          onSelect={() => setTheme("dark")}
          role="menuitemradio"
          aria-checked={theme === "dark"}
          aria-label="Switch to dark theme"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          onSelect={() => setTheme("system")}
          role="menuitemradio"
          aria-checked={theme === "system"}
          aria-label="Use system theme"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
