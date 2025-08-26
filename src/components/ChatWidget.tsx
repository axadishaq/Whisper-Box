"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { BotMessageSquare, ChevronDown, Send } from "lucide-react";

export default function ChatWidget() {
   const [isOpen, setIsOpen] = useState(false);
   const [input, setInput] = useState("");
   const { messages, sendMessage, status } = useChat();

   const chatContainerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (chatContainerRef.current) {
         chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
      }
   }, [messages]);

   const threeDots = (
      <div className="p-2 rounded-lg text-sm max-w-[100%] bg-muted self-start">
         <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
         </div>
      </div>
   );

   return (
      <div className="fixed bottom-4 right-6 z-50 ">
         {!isOpen && (
            <Button
               asChild
               onClick={() => setIsOpen(true)}
               className="rounded-full p-1.5 w-14 h-14 bg-gradient-to-b from-cyan-400 via-cyan-600 to-purple-800 ">
               <BotMessageSquare />
            </Button>
         )}

         {isOpen && (
            <Card className="w-80 py-2 px-3  shadow-lg flex flex-col h-96 ">
               <div className="flex justify-between items-center border-b pb-1 ">
                  <h2 className="text-lg font-bold">WhisperBox Support</h2>

                  <Button
                     className="h-8 w-12 p-0"
                     variant={"link"}
                     asChild
                     onClick={() => setIsOpen(false)}>
                     <ChevronDown />
                  </Button>
               </div>

               <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto rounded space-y-2 flex flex-col">
                  {messages.length === 0 && (
                     <div className="p-2 rounded-lg text-sm max-w-[100%] bg-muted self-start">
                        How can I help you?
                     </div>
                  )}
                  {messages.map((message) => (
                     <div
                        key={message.id}
                        className={`p-2 rounded-lg text-sm max-w-[100%] ${
                           message.role === "user"
                              ? "bg-primary text-primary-foreground self-end"
                              : "bg-muted self-start"
                        }`}>
                        {message.parts.map((part, i) => {
                           switch (part.type) {
                              case "text":
                                 return (
                                    <div key={`${message.id}-${i}`}>
                                       {message.role === "user"
                                          ? part.text
                                          : part.text}
                                    </div>
                                 );
                           }
                        })}
                     </div>
                  ))}
                  {/* Show loading animation when chat is in progress */}
                  {status === "submitted" && (
                     <div className="p-2 rounded-lg text-sm max-w-[100%] bg-muted self-start">
                        {threeDots}
                     </div>
                  )}
                  {status === "error" && (
                     <div className="p-2 rounded-lg text-sm max-w-[100%] bg-muted self-start">
                        Error while connecting! Try again later.
                     </div>
                  )}
               </div>

               <form
                  onSubmit={(e) => {
                     e.preventDefault();
                     sendMessage({ text: input });
                     setInput("");
                  }}
                  className="flex gap-2 mt-2">
                  <Input
                     placeholder="How can i help..."
                     value={input}
                     onChange={(e) => setInput(e.currentTarget.value)}
                  />{" "}
                  {!input ? (
                     <Button disabled type="submit">
                        <Send />
                     </Button>
                  ) : (
                     <Button type="submit">
                        <Send />
                     </Button>
                  )}
               </form>
            </Card>
         )}
      </div>
   );
}
