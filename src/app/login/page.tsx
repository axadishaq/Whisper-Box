"use client";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { loginSchema } from "@/schemas/loginSchema";
import { signIn } from "next-auth/react";
import Image from "next/image";

const Login = () => {
   // Zod Implementation  Define your form.
   const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         identifier: "",
         password: "",
      },
   });

   const router = useRouter();
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showPassword, setShowPassword] = useState(false);

   const onSubmit = async (data: z.infer<typeof loginSchema>) => {
      setIsSubmitting(true);
      try {
         const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
         });
         if (result?.error) {
            toast.error("Incorrect username or password!");
         }
         if (result?.url) {
            toast.success("Signed In Successfully.");
            router.replace("/dashboard");
         }
      } catch (error) {
         console.log("Error while logging in", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <>
         <div className="flex justify-center items-center min-h-[85vh] dark:bg-background">
            <div className="w-full max-w-lg min-h-120 p-8 space-y-8 rounded-lg shadow-2xl dark:bg-accent">
               <div className="text-center">
                  <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 dark:text-foreground">
                     Join Whisper Box
                  </h1>
                  <p className="mb-4">
                     Sign In to start your anonymous adventure
                  </p>
               </div>
               <div>
                  <Form {...form}>
                     <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6">
                        <FormField
                           control={form.control}
                           name="identifier"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Email or Username</FormLabel>
                                 <FormControl>
                                    <Input
                                       {...field}
                                       placeholder="email or username"
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
                                          type={
                                             showPassword ? "text" : "password"
                                          }
                                          placeholder="password"
                                       />{" "}
                                       <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                          onClick={() =>
                                             setShowPassword(!showPassword)
                                          }>
                                          {showPassword ? (
                                             <EyeOff className="h-4 w-4 " />
                                          ) : (
                                             <Eye className="h-4 w-4 " />
                                          )}
                                       </Button>
                                    </div>
                                 </FormControl>

                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <Button type="submit" className="w-full mt-4">
                           {isSubmitting ? (
                              <>
                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                 processing...
                              </>
                           ) : (
                              "Sign in"
                           )}
                        </Button>
                     </form>
                  </Form>
               </div>
               <div className="text-center">
                  {/* // Add this button to your login form */}
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

                  <p className="mt-4">
                     Didn&apos;t joined yet?{"   "}
                     <Link
                        href="/signup"
                        className="text-blue-600 hover:text-blue-800">
                        Sign up
                     </Link>
                  </p>
               </div>
            </div>
         </div>
      </>
   );
};

export default Login;
