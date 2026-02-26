"use client";

import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

const MotionWrapper: React.FC<MotionWrapperProps> = ({ children, ...props }) => {
  return (
    <AnimatePresence>
      <motion.div {...props}>{children}</motion.div>
    </AnimatePresence>
  );
};

export default MotionWrapper;
