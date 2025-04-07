'use client';

import { motion } from 'framer-motion';

export default function SquashCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        scaleY: 0.96,
        rotateX: 2,
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className="bg-white rounded-2xl p-6 shadow-md cursor-pointer"
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  );
}
