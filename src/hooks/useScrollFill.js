import { useScroll, useTransform } from "motion/react";

export const useScrollFill = (target, offset) => {
  const { scrollYProgress } = useScroll({ target, offset });
  return useTransform(scrollYProgress, [0, 1], ["0% 100%", "100% 100%"]);
};
