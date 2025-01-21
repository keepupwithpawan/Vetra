'use client';

import { motion, useAnimation } from 'framer-motion';

const BookTextIcon = () => {
  const controls = useAnimation();

  return (
    <div
      className="cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify"
      onMouseEnter={() => controls.start('animate')}
      onMouseLeave={() => controls.start('normal')}
    >
      <motion.svg
        animate={controls}
        variants={{
          animate: {
            scale: [2, 2.04, 2],
            rotate: [0, -8, 8, -8, 0],
            y: [0, -2, 0],
            transition: {
              duration: 0.6,
              ease: 'easeInOut',
              times: [0, 0.2, 0.5, 0.8, 1],
            },
          },
          normal: {
            scale: 2,
            rotate: 0,
            y: 0,
          },
        }}
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
        <path d="M8 11h8" />
        <path d="M8 7h6" />
      </motion.svg>
    </div>
  );
};

export { BookTextIcon };
