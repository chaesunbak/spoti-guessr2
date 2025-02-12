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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Select theme mode"
          className="relative overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme !== "dark" ? (
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
              >
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="invisible">
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          title="Switch to Light Theme"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          title="Switch to Dark Theme"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          title="Use System Default Theme"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
