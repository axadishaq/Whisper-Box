"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCard } from "./MessageCard";
import { Message } from "@/models/user.model";
import { fadeInUp } from "@/lib/animations";

interface ScrollAnimatedMessageProps {
   message: Message;
   index: number;
   onMessageDelete: (messageId: string) => void;
}

const ScrollAnimatedMessage = ({
   message,
   index,
   onMessageDelete,
}: ScrollAnimatedMessageProps) => {
   const ref = useRef(null);
   const isInView = useInView(ref, {
      margin: "-80px",
   });

   return (
      <motion.div
         ref={ref}
         variants={fadeInUp}
         initial="hidden"
         animate={isInView ? "visible" : "hidden"}
         transition={{
            duration: 0.6,
            delay: index * 0.1,
            ease: "easeOut",
         }}>
         <MessageCard message={message} onMessageDelete={onMessageDelete} />
      </motion.div>
   );
};

export default ScrollAnimatedMessage;
