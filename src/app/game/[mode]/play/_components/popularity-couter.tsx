import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Crown } from "lucide-react";

export function PopularityCounter({
  to,
  isWinner,
}: {
  to: number;
  isWinner: boolean;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    count.set(0);
    const controls = animate(count, to, { duration: 2 });
    return () => controls.stop();
  }, [to]);

  return (
    <span className="flex items-center gap-2">
      {isWinner && (
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          className="text-yellow-500"
        >
          <Crown className="h-6 w-6" />
        </motion.span>
      )}
      <motion.span className="font-bold">{rounded}</motion.span>

      <span>points</span>
    </span>
  );
}
