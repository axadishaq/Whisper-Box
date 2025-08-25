"use client";
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
import axios, { type AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounceCallback } from "usehooks-ts";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { signupSchema } from "@/schemas/signupSchema";
import Image from "next/image";
import { signIn } from "next-auth/react";

const Signup = () => {
   // Zod Implementation  Define your form.
   const form = useForm<z.infer<typeof signupSchema>>({
      resolver: zodResolver(signupSchema),
      defaultValues: {
         username: "",
         email: "",
         password: "",
      },
   });

   const router = useRouter();

   const [username, setUsername] = useState("");
   const [usernameMessage, setUsernameMessage] = useState("");
   const [isCheckingusername, setIsCheckingUsername] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showPassword, setShowPassword] = useState(false);

   const debounced = useDebounceCallback(setUsername, 500);
   //checking username unique
   useEffect(() => {
      const checkUsernameUnique = async () => {
         if (username) {
            setIsCheckingUsername(true);
            setUsernameMessage("");
            try {
               const response = await axios.get(
                  `/api/check-username-unique?username=${username}`
               );
               setUsernameMessage(response.data.message);
            } catch (error) {
               const axiosError = error as AxiosError<ApiResponse>;
               setUsernameMessage(
                  axiosError.response?.data.message ??
                     "Error checking username!"
               );
            } finally {
               setIsCheckingUsername(false);
            }
         }
      };
      checkUsernameUnique();
   }, [username]);

   const onSubmit = async (data: z.infer<typeof signupSchema>) => {
      setIsSubmitting(true);
      try {
         const response = await axios.post<ApiResponse>("/api/signup", data);
         toast.success(response.data.message);
         router.replace(`/verify/${username}`);
         setIsSubmitting(false);
      } catch (error) {
         console.error("Error is Signup of User", error);
         const axiosError = error as AxiosError<ApiResponse>;
         const errmsg = axiosError.response?.data.message;
         toast.error(errmsg);
         setIsSubmitting(false);
      }
   };

   //simple
   // const onSignup = async (values: z.infer<typeof formSchema>) => {
   //    try {
   //       setIsSubmitting(true);
   //       //  console.log("Signup success", values);
   //       const res = await axios.post("/api/users/signup", values);
   //       console.log("Signup success", res.data);
   //       toast("Signup Successfully.");
   //       router.push("/login");
   //    } catch (error: any) {
   //       console.log(error);
   //       toast.error(error.message);
   //    } finally {
   //       setIsSubmitting(false);
   //    }
   // };

   return (
      <>
         <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-lg p-8 space-y-8 rounded-lg shadow-2xl dark:bg-accent">
               <div className="text-center">
                  <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 dark:text-foreground">
                     Join Whisper Box
                  </h1>
                  <p className="mb-4">
                     Sign up to start your anonymous adventure
                  </p>
               </div>
               <div>
                  <Form {...form}>
                     <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4">
                        <FormField
                           name="username"
                           control={form.control}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Username</FormLabel>
                                 <FormControl>
                                    <Input
                                       {...field}
                                       type="text"
                                       placeholder="username"
                                       onChange={(e) => {
                                          field.onChange(e);
                                          debounced(e.target.value);
                                       }}
                                    />
                                 </FormControl>
                                 {isCheckingusername && (
                                    <Loader2 className="animate-spin" />
                                 )}
                                 <p
                                    className={`text-sm ${
                                       usernameMessage === "Username is unique."
                                          ? "text-green-500"
                                          : "text-red-500"
                                    }`}>
                                    {usernameMessage}
                                 </p>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="email"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Email</FormLabel>
                                 <FormControl>
                                    <Input
                                       {...field}
                                       type="email"
                                       placeholder="example@mail.com"
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="password"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Password</FormLabel>
                                 <FormControl>
                                    <div className="relative">
                                       <Input
                                          {...field}
                                          placeholder="password"
                                          type={
                                             showPassword ? "text" : "password"
                                          }
                                       />
                                       <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                          onClick={() =>
                                             setShowPassword(!showPassword)
                                          }>
                                          {showPassword ? (
                                             <EyeOff className="h-4 w-4" />
                                          ) : (
                                             <Eye className="h-4 w-4 " />
                                          )}
                                       </Button>
                                    </div>
                                 </FormControl>
                                 <FormDescription>
                                    Password must include uppercase, lowercase,
                                    number, and special character.
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <Button type="submit" className="w-full">
                           {isSubmitting ? (
                              <>
                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                 processing...
                              </>
                           ) : (
                              "Signup"
                           )}
                        </Button>
                     </form>
                  </Form>
                  <div className="text-center mt-4">
                     <Button
                        type="button"
                        onClick={() => signIn("google")}
                        className="w-full">
                        <Image
                           width={20}
                           height={20}
                           className="w-5 h-5 mr-2"
                           src="/google.png"
                           alt="G"
                        />
                        Continue with Google
                     </Button>
                     <p className="mt-2">
                        Already a member?{"  "}
                        <Link
                           href="/login"
                           className="text-blue-600 hover:text-blue-800">
                           Sign in
                        </Link>
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Signup;
