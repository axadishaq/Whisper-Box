"use client";

import { useForm } from "react-hook-form";
import { SheetContent, SheetHeader, SheetTitle, SheetClose } from "./ui/sheet";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Camera } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import upload from "@/lib/upload.js";
import axios from "axios";
import { User } from "next-auth";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { updateUserScheme } from "@/schemas/signupSchema";

const EditUser = ({
   user,
   onProfileUpdate,
}: {
   user: User;
   onProfileUpdate?: () => void;
}) => {
   const [loading, setLoading] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const sheetCloseRef = useRef<HTMLButtonElement>(null);
   const [uploading, setUploading] = useState(false);
   const [username, setUsername] = useState(user.username || "");
   const [usernameMessage, setUsernameMessage] = useState("");
   const [isCheckingUsername, setIsCheckingUsername] = useState(false);
   const { update: updateSession } = useSession();

   // 1. Define your form.
   const form = useForm<z.infer<typeof updateUserScheme>>({
      resolver: zodResolver(updateUserScheme),
      defaultValues: {
         username: user.username,
         email: user.email!,
         password: "",
         image: user.image,
      },
   });

   const debounced = useDebounceCallback(setUsername, 500);

   // Check username uniqueness when username changes
   useEffect(() => {
      const checkUsernameUnique = async () => {
         if (username && username !== user.username) {
            setIsCheckingUsername(true);
            setUsernameMessage("");
            try {
               const response = await axios.get(
                  `/api/check-username-unique?username=${username}`
               );
               setUsernameMessage(response.data.message);
            } catch (error) {
               let errorMessage = "Error checking username!";
               if (
                  typeof error === "object" &&
                  error !== null &&
                  "response" in error
               ) {
                  const axiosError = error as {
                     response?: { data?: { message?: string } };
                  };
                  errorMessage =
                     axiosError.response?.data?.message || errorMessage;
               }
               setUsernameMessage(errorMessage);
            } finally {
               setIsCheckingUsername(false);
            }
         } else {
            setUsernameMessage("");
         }
      };
      checkUsernameUnique();
   }, [username, user.username]);
   //image
   const handleFileChange = async (
      e: React.ChangeEvent<HTMLInputElement>,
      onChange: (url: string) => void
   ) => {
      const file = e.target.files?.[0];
      if (file) {
         setUploading(true);
         try {
            console.log("Starting upload for file:", file.name, file.size);
            const url = await upload(file);
            console.log("Upload result:", url);
            if (url) {
               onChange(url);
               toast("Image uploaded successfully!");
            } else {
               toast("Image upload failed!");
            }
         } catch (error) {
            console.error("Upload error:", error);
            const errorMessage =
               error instanceof Error ? error.message : "Unknown error";
            toast(`Image upload failed: ${errorMessage}`);
         } finally {
            setUploading(false);
         }
      }
   };

   const onSubmit = async (values: z.infer<typeof updateUserScheme>) => {
      // Check if username is unique when it's different from current username
      if (
         values.username !== user.username &&
         usernameMessage !== "Username is unique."
      ) {
         toast.error("Please choose a unique username");
         return;
      }

      setLoading(true);
      try {
         const response = await axios.post("/api/update-user", values);
         if (response.data.success) {
            toast.success("Profile updated successfully!");

            // Force a complete session refresh by calling update without parameters
            // This will trigger NextAuth to refetch the session from the server
            await updateSession();

            // Call the onProfileUpdate callback to refresh parent components
            if (onProfileUpdate) {
               onProfileUpdate();
            }

            // Close the sheet after successful update
            setTimeout(() => {
               sheetCloseRef.current?.click();
            }, 1000); // Wait 1.5 seconds to show the success message
         } else {
            toast.error(response.data.message || "Failed to update profile");
         }
      } catch (err) {
         console.error("Update error:", err);
         let errorMessage = "Failed to update profile";

         if (err instanceof Error) {
            errorMessage = err.message;
         } else if (
            typeof err === "object" &&
            err !== null &&
            "response" in err
         ) {
            const axiosError = err as {
               response?: { data?: { message?: string } };
            };
            errorMessage = axiosError.response?.data?.message || errorMessage;
         }

         toast.error(errorMessage);
      } finally {
         setLoading(false);
      }
   };

   return (
      <SheetContent>
         <SheetHeader>
            <SheetTitle className="mb-4">Edit Personal Information</SheetTitle>
            <div className="p-4">
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-4">
                     <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Image</FormLabel>
                              <FormControl>
                                 <div className="flex flex-col-reverse items-center gap-4">
                                    <input
                                       type="file"
                                       accept="image/*"
                                       ref={fileInputRef}
                                       className="hidden"
                                       onChange={(e) =>
                                          handleFileChange(e, field.onChange)
                                       }
                                    />
                                    <Button
                                       type="button"
                                       variant="outline"
                                       onClick={() =>
                                          fileInputRef.current?.click()
                                       }
                                       disabled={uploading}>
                                       <Camera className="w-4 h-4 mr-2" />
                                       {uploading
                                          ? "Uploading..."
                                          : "Upload Image"}
                                    </Button>
                                    {field.value ? (
                                       <div className="w-12 h-12 rounded-full overflow-hidden">
                                          <Image
                                             src={field.value}
                                             alt="Avatar"
                                             width={48}
                                             height={48}
                                             className="object-cover"
                                          />
                                       </div>
                                    ) : (
                                       <div className="w-12 h-12 rounded-full overflow-hidden">
                                          <Image
                                             src="/avatar.png"
                                             alt=""
                                             width={48}
                                             height={48}
                                             className="object-cover"
                                          />
                                       </div>
                                    )}
                                 </div>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    onChange={(e) => {
                                       field.onChange(e);
                                       debounced(e.target.value);
                                    }}
                                 />
                              </FormControl>
                              {isCheckingUsername && (
                                 <Loader2 className="h-4 w-4 animate-spin" />
                              )}
                              {usernameMessage && (
                                 <p
                                    className={`text-sm ${
                                       usernameMessage === "Username is unique."
                                          ? "text-green-500"
                                          : "text-red-500"
                                    }`}>
                                    {usernameMessage}
                                 </p>
                              )}
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
                                 <Input {...field} />
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
                                 <Input {...field} />
                              </FormControl>
                              <FormDescription>
                                 Password must include uppercase, lowercase,
                                 number, and special character.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <Button
                        type="submit"
                        disabled={loading || uploading}
                        className="w-full">
                        {loading ? "Saving..." : "Submit"}
                     </Button>
                  </form>
               </Form>
               {/* Hidden button to programmatically close the sheet */}
               <SheetClose ref={sheetCloseRef} className="hidden" />
            </div>
         </SheetHeader>
      </SheetContent>
   );
};

export default EditUser;
