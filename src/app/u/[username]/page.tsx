"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, SendIcon } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const Page = () => {
   const params = useParams<{ username: string }>();
   const username = useMemo(() => String(params?.username || ""), [params]);

   const [message, setMessage] = useState("");
   const [suggestions, setSuggestions] = useState<string[]>([]);
   const [loading, setLoading] = useState(false);
   const [suggestLoading, setSuggestLoading] = useState(false);

   const sendMessage = async () => {
      if (!message.trim()) return;
      setLoading(true);
      try {
         await axios.post("/api/send-message", {
            username,
            content: message.trim(),
         });
         toast.success("Message sent successfully.");
         setMessage("");
      } catch (e: unknown) {
         console.log(e); // Check if it's a user not found error
         if (
            e &&
            typeof e === "object" &&
            "response" in e &&
            e.response &&
            typeof e.response === "object" &&
            "data" in e.response &&
            e.response.data &&
            typeof e.response.data === "object" &&
            "message" in e.response.data
         ) {
            toast.error((e.response.data as { message: string }).message);
         } else {
            toast.error("Please try again later.");
         }
      } finally {
         setLoading(false);
      }
   };

   const getSuggestions = async () => {
      setSuggestLoading(true);
      setSuggestions([]);

      try {
         const response = await axios.post(
            "/api/suggest-messages",
            {},
            {
               responseType: "text",
            }
         );

         // Process the response text
         const text: string = response.data;
         const items = text
            .split("||")
            .map((s: string) => s.trim())
            .filter(Boolean)
            .slice(0, 3);

         setSuggestions(items);
      } catch (e) {
         console.log(e);
         toast.error("Unable to suggest message now!");
         setSuggestions([]);
      } finally {
         setSuggestLoading(false);
      }
   };

   const handleSuggestionClick = (suggestion: string) => {
      setMessage(suggestion);
   };

   return (
      <motion.div
         className="max-w-xl mx-auto py-10 space-y-6"
         initial="hidden"
         animate="visible"
         variants={staggerContainer}>
         <motion.div className="space-y-2 text-center" variants={fadeInUp}>
            <h1 className="text-2xl font-semibold">
               Send an anonymous message
            </h1>
            <p className="text-sm text-muted-foreground">to @{username}</p>
         </motion.div>

         <motion.div
            variants={fadeInUp}
            className="flex flex-col md:flex-row gap-3">
            <Input
               value={message}
               className="p-4 py-5"
               onChange={(e) => setMessage(e.target.value)}
               placeholder="Type your message..."
            />
            <Button
               className="p-5 w-full md:w-25"
               onClick={sendMessage}
               disabled={loading || !message.trim()}>
               {loading ? "Sending..." : "Send"}
               <SendIcon />
            </Button>
         </motion.div>

         <motion.div variants={fadeInUp} className="space-y-3">
            <Button
               variant="secondary"
               onClick={getSuggestions}
               disabled={suggestLoading}>
               {suggestLoading ? (
                  <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                     Loading...
                  </>
               ) : (
                  "Suggest Messages"
               )}
            </Button>

            {suggestions.length > 0 && (
               <motion.div
                  variants={staggerContainer}
                  className="grid grid-cols-1 gap-2">
                  {suggestions.map((suggestion: string, index: number) => (
                     <motion.button
                        variants={fadeInUp}
                        key={index}
                        className="border rounded-md p-3 text-sm text-center hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion)}>
                        {suggestion}
                     </motion.button>
                  ))}
               </motion.div>
            )}
         </motion.div>
      </motion.div>
   );
};

export default Page;
