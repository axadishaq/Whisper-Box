"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedCounterProps {
   value: number | string;
   duration?: number;
   shouldAnimate?: boolean;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
   value,
   duration = 4, // Increased duration for slower animation
   shouldAnimate = true,
}) => {
   const [displayValue, setDisplayValue] = useState<string | number>(0);
   const [hasAnimated, setHasAnimated] = useState(false);

   useEffect(() => {
      // Reset animation state when value changes
      setHasAnimated(false);
   }, [value]);

   useEffect(() => {
      if (shouldAnimate && !hasAnimated) {
         if (typeof value === "number") {
            const start = 0;
            const end = value;
            const increment = end / (duration * 60); // 60fps

            let current = start;
            const timer = setInterval(() => {
               current += increment;
               if (current >= end) {
                  setDisplayValue(end);
                  setHasAnimated(true);
                  clearInterval(timer);
               } else {
                  setDisplayValue(Math.floor(current));
               }
            }, 1000 / 60);

            return () => clearInterval(timer);
         } else if (typeof value === "string") {
            // Handle string values with special characters
            const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
            const suffix = value.replace(/[0-9.,]/g, "");

            if (!isNaN(numericValue)) {
               const start = 0;
               const end = numericValue;
               const increment = end / (duration * 60);

               let current = start;
               const timer = setInterval(() => {
                  current += increment;
                  if (current >= end) {
                     setDisplayValue(end.toLocaleString() + suffix);
                     setHasAnimated(true);
                     clearInterval(timer);
                  } else {
                     setDisplayValue(
                        Math.floor(current).toLocaleString() + suffix
                     );
                  }
               }, 1000 / 60);

               return () => clearInterval(timer);
            } else {
               setDisplayValue(value);
               setHasAnimated(true);
            }
         }
      } else if (!shouldAnimate) {
         setDisplayValue(value);
         setHasAnimated(false);
      }
   }, [value, duration, shouldAnimate, hasAnimated]);

   return (
      <motion.span
         initial={{ opacity: 0, scale: 0.5 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.5 }}>
         {displayValue}
      </motion.span>
   );
};

export default AnimatedCounter;
