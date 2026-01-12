"use client";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "fade" | "slide";
} & Omit<HTMLMotionProps<"div">, "children">;

export default function MotionWrapper({
  children,
  variant = "fade",
  ...rest
}: Props) {
  const variants =
    variant === "slide"
      ? {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -8 },
        }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
