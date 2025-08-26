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
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

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
            <motion.div
               className="w-full max-w-lg min-h-120 p-8 space-y-8 rounded-lg shadow-2xl dark:bg-accent"
               initial="hidden"
               animate="visible"
               variants={staggerContainer}>
               <div className="text-center">
                  <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 dark:text-foreground">
                     Join Whisper Box
                  </h1>
                  <motion.p className="mb-4" variants={fadeInUp}>
                     Sign In to start your anonymous adventure
                  </motion.p>
               </div>
               <div>
                  <Form {...form}>
                     <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6">
                        <motion.div variants={fadeInUp}>
                           <FormField
                              control={form.control}
                              name="identifier"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Email or Username</FormLabel>
                                    <FormControl>
                                       <motion.div
                                          whileHover={{ scale: 1.02 }}
                                          whileFocus={{ scale: 1.02 }}>
                                          <Input
                                             {...field}
                                             placeholder="email or username"
                                             className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                                          />
                                       </motion.div>
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                           <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                       <motion.div
                                          className="relative"
                                          whileHover={{ scale: 1.02 }}
                                          whileFocus={{ scale: 1.02 }}>
                                          <Input
                                             {...field}
                                             type={
                                                showPassword
                                                   ? "text"
                                                   : "password"
                                             }
                                             placeholder="password"
                                             className="transition-all duration-300 focus:ring-2 focus:ring-primary"
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
                                                <EyeOff className="h-4 w-4 transition-all duration-300" />
                                             ) : (
                                                <Eye className="h-4 w-4 transition-all duration-300" />
                                             )}
                                          </Button>
                                       </motion.div>
                                    </FormControl>

                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                           <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}>
                              <Button type="submit" className="w-full mt-4">
                                 {isSubmitting ? (
                                    <motion.div
                                       initial={{ opacity: 0 }}
                                       animate={{ opacity: 1 }}
                                       transition={{ duration: 0.2 }}
                                       className="flex items-center">
                                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                       processing...
                                    </motion.div>
                                 ) : (
                                    <motion.span
                                       initial={{ opacity: 1 }}
                                       animate={{
                                          opacity: isSubmitting ? 0 : 1,
                                       }}>
                                       Sign in
                                    </motion.span>
                                 )}
                              </Button>
                           </motion.div>
                        </motion.div>
                     </form>
                  </Form>
               </div>
               <motion.div className="text-center" variants={fadeInUp}>
                  {/* // Add this button to your login form */}
                  <motion.div
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}>
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
                  </motion.div>

                  <motion.p className="mt-4" variants={fadeInUp}>
                     Didn&apos;t joined yet?{"   "}
                     <motion.span whileHover={{ scale: 1.05 }}>
                        <Link
                           href="/signup"
                           className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                           Sign up
                        </Link>
                     </motion.span>
                  </motion.p>
               </motion.div>
            </motion.div>
         </div>
      </>
   );
};

export default Login;
