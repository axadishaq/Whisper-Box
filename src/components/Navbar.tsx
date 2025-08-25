"use client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Moon, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
   SidebarTrigger,
   //  useSidebar
} from "./ui/sidebar";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Image from "next/image";

const Navbar = () => {
   const { theme, setTheme } = useTheme();
   // const { toggleSidebar } = useSidebar();
   const [mounted, setMounted] = useState(false);
   useEffect(() => {
      setMounted(true);
   }, []);
   const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

   const { data: session } = useSession();

   const user: User = session?.user as User;

   // Add a useEffect to listen for session changes and force re-render
   useEffect(() => {
      // This will force the component to re-render when session data changes
   }, [session]);
   return (
      <nav className="p-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur saturate-200 border-b mb-2 pr-4">
         {/* left  */}
         {session ? (
            <div className="flex">
               <SidebarTrigger />
               <Link href="/" className="text-xl font-bold px-4">
                  Whisper Box
               </Link>
            </div>
         ) : (
            <Link href="/" className="flex">
               <Image
                  src="/whisperBox.png"
                  alt=""
                  width={30}
                  height={30}
                  className=" object-center"
               />
               <h1 className="text-xl font-bold px-4">Whisper Box</h1>
            </Link>
         )}

         {/* right  */}
         {/* Theme Menu  */}
         <div className="flex items-center gap-6">
            <button
               onClick={toggleTheme}
               className="p-2 rounded-full transition-all"
               aria-label="Toggle theme"
               type="button">
               {mounted ? theme === "dark" ? <Sun /> : <Moon /> : null}
            </button>
            {session ? (
               <>
                  {/* User Menu  */}
                  <DropdownMenu>
                     <DropdownMenuTrigger className="flex gap-1">
                        <Avatar className="border">
                           <AvatarImage src={user.image || "/avatar.png"} />
                           <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <p className="p-1 px-2 text-md font-semibold">
                           {user?.username || "----"}
                        </p>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent sideOffset={10}>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                           <Link href="/setting">
                              <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
                              Setting
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                           variant="destructive"
                           onClick={() => signOut()}>
                           <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
                           Logout
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </>
            ) : (
               <div className="flex gap-3">
                  <Button
                     size="lg"
                     variant="outline"
                     className="hidden sm:flex">
                     <Link href="/signup">Signup</Link>
                  </Button>
                  <Button size="lg">
                     <Link href="/login">login</Link>
                  </Button>
               </div>
            )}
         </div>
      </nav>
   );
};

export default Navbar;
