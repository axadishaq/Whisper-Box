"use client";
import Loading from "@/app/Loading";
import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/user.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageScheme";
import type { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { type AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Messages = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isSwitchLoading, setIsSwitchLoading] = useState(false);

   const handleDeleteMessage = (messageId: string) => {
      setMessages(messages.filter((message) => message._id !== messageId));
   };

   const { data: session } = useSession();

   const form = useForm({ resolver: zodResolver(acceptMessageSchema) });

   const { register, watch, setValue } = form;

   const acceptMessages = watch("acceptMessages");

   // fetch is Accepting messages
   const fetchAcceptMessage = useCallback(async () => {
      setIsSwitchLoading(true);
      try {
         const response = await axios.get("/api/messages/accept-message");
         setValue("acceptMessages", response.data.isAcceptingMessages);
      } catch (error) {
         console.error(error);
         const axiosError = error as AxiosError<ApiResponse>;
         toast.error(
            axiosError.response?.data.message ||
               "Failed to fetch message setting."
         );
      } finally {
         setIsSwitchLoading(false);
      }
   }, [setValue]);

   const fetchMessages = useCallback(async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
         const response = await axios.get<ApiResponse>(
            "/api/messages/get-messages"
         );
         setMessages(response.data.messages || []);
         if (refresh) {
            toast.success("Showing latest messages");
         }
      } catch (error) {
         console.error(error);
         const axiosError = error as AxiosError<ApiResponse>;
         toast.error(
            axiosError.response?.data.message || "Failed to fetch messages"
         );
      } finally {
         setIsLoading(false);
      }
   }, []);

   useEffect(() => {
      if (!session || !session.user) return;
      fetchMessages();
      fetchAcceptMessage();
   }, [session, fetchAcceptMessage, fetchMessages]);

   // handle switch change
   const handleSwitchChange = async () => {
      try {
         const res = await axios.post<ApiResponse>(
            "/api/messages/accept-message",
            {
               acceptMessages: !acceptMessages,
            }
         );
         setValue("acceptMessages", !acceptMessages);
         toast(res.data.message);
      } catch (error) {
         console.error(error);
         const axiosError = error as AxiosError<ApiResponse>;
         toast.error(
            axiosError.response?.data.message ||
               "Failed to update message setting."
         );
      }
   };

   if (!session || !session.user) {
      return (
         <div className="flex justify-center items-center h-screen">
            <p className="text-lg">Please sign in to access your Messages.</p>
         </div>
      );
   }

   return (
      <div className="mx-1 md:mx-8 lg:mx-auto p-2 lg:p-6 rounded w-full max-w-6xl">
         <h1 className="text-4xl font-bold mb-4">Messages</h1>
         <div className="flex justify-between mb-4 mt-4">
            <div className="flex items-center">
               <Switch
                  {...register("acceptMessages")}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
               />
               <span className="ml-2">
                  Accept Messages: {acceptMessages ? "On" : "Off"}
               </span>
            </div>
            <Button
               variant="outline"
               onClick={(e) => {
                  e.preventDefault();
                  fetchMessages(true);
               }}
               disabled={isLoading}>
               {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
               ) : (
                  <RefreshCcw className="h-4 w-4" />
               )}
            </Button>
         </div>
         <Separator />

         <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.length > 0 ? (
               messages.map((message) => (
                  <MessageCard
                     key={message._id as string}
                     message={message}
                     onMessageDelete={handleDeleteMessage}
                  />
               ))
            ) : isLoading ? (
               <Loading />
            ) : (
               <p className="text-muted-foreground">No messages to display.</p>
            )}
         </div>
      </div>
   );
};

export default Messages;
