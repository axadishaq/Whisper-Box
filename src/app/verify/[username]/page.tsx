"use client";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import type { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { type AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const VerifyAccount = () => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const [isLoading, setIsLoading] = useState(false);
   const [isAutoVerifying, setIsAutoVerifying] = useState(false);

   const param = useParams<{ username: string }>();
   const codeFromUrl = searchParams.get("code");

   const form = useForm<z.infer<typeof verifySchema>>({
      resolver: zodResolver(verifySchema),
   });

   // Auto-verify if code is provided in URL
   useEffect(() => {
      const autoVerify = async () => {
         if (codeFromUrl && param.username) {
            setIsAutoVerifying(true);
            try {
               const response = await axios.post(`/api/verify-code`, {
                  username: param.username,
                  code: codeFromUrl,
               });
               toast.success(response.data.message);
               router.push("/login");
               setTimeout(() => {
                  toast("Please login to your account.");
               }, 3000);
            } catch (error) {
               console.error("Error auto-verifying User", error);
               const axiosError = error as AxiosError<ApiResponse>;
               toast.error(axiosError.response?.data.message);
               // Pre-fill the form with the code from URL for manual correction
               form.setValue("code", codeFromUrl);
            } finally {
               setIsAutoVerifying(false);
            }
         }
      };

      autoVerify();
   }, [codeFromUrl, param.username, router, form]);

   const onSubmit = async (data: z.infer<typeof verifySchema>) => {
      try {
         setIsLoading(true);
         const response = await axios.post(`/api/verify-code`, {
            username: param.username,
            code: data.code,
         });
         toast.success(response.data.message);
         router.push("/login");
         setTimeout(() => {
            toast("Please login to your account.");
         }, 3000);
      } catch (error) {
         console.error("Error verifying User", error);
         const axiosError = error as AxiosError<ApiResponse>;
         toast.error(axiosError.response?.data.message);
      } finally {
         setIsLoading(false);
      }
   };
   if (isAutoVerifying) {
      return (
         <div className="flex justify-center items-center min-h-[80vh] dark:bg-background">
            <div className="w-full min-h-96 max-w-lg lg:max-w-xl p-8 space-y-12 rounded-lg shadow-2xl dark:bg-accent text-center">
               <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6" />
               <h2 className="text-2xl font-bold dark:text-foreground">
                  Verifying your account...
               </h2>
               <p className="text-muted-foreground">
                  Please wait while we verify your email address.
               </p>
            </div>
         </div>
      );
   }

   return (
      <>
         <div className="flex justify-center items-center min-h-[80vh] dark:bg-background">
            <div className="w-full min-h-96 max-w-lg lg:max-w-xl p-8 space-y-12 rounded-lg shadow-2xl dark:bg-accent">
               <div className="text-center">
                  <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 dark:text-foreground">
                     Verify Your Account
                  </h1>
                  <p className="mb-4">
                     Whisper Box – A box for secret whispers.
                  </p>
                  {codeFromUrl && (
                     <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                        <p className="text-blue-800 text-sm">
                           We detected a verification code in the link. If automatic verification failed, 
                           please check the code below and click Submit.
                        </p>
                     </div>
                  )}
               </div>
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-10">
                     <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Verification Code</FormLabel>
                              <FormControl>
                                 <Input placeholder="Enter verification code" {...field} />
                              </FormControl>
                              <FormDescription>
                                 Please enter the one-time password sent to your
                                 email.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                           <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                              processing...
                           </>
                        ) : (
                           "Submit"
                        )}
                     </Button>
                  </form>
               </Form>
            </div>
         </div>
      </>
   );
};

export default VerifyAccount;
