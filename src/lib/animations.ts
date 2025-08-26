// Animation variants for consistent animations across the application

export const fadeInUp = {
   hidden: { opacity: 0, y: 80 },
   visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

export const scaleIn = {
   hidden: { opacity: 0, scale: 0.8 },
   visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
};

export const staggerContainer = {
   hidden: { opacity: 0 },
   visible: {
      opacity: 1,
      transition: {
         staggerChildren: 0.3,
      },
   },
};

export const bounce = {
   hidden: { opacity: 0, y: 30 },
   visible: {
      opacity: 1,
      y: 0,
      transition: {
         type: "spring" as const,
         stiffness: 100,
         damping: 10,
      },
   },
};

// Additional animation variants that can be used throughout the app
export const fadeIn = {
   hidden: { opacity: 0 },
   visible: { opacity: 1, transition: { duration: 0.8 } },
};

export const slideInLeft = {
   hidden: { opacity: 0, x: -100 },
   visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

export const slideInRight = {
   hidden: { opacity: 0, x: 100 },
   visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

// Matches usage with x: 80 and duration: 1.5
export const slideInRightSlow = {
   hidden: { opacity: 0, x: 80 },
   visible: { opacity: 1, x: 0, transition: { duration: 1.5 } },
};

export const zoomIn = {
   hidden: { opacity: 0, scale: 0.5 },
   visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
};
