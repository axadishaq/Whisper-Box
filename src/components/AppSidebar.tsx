"use client";
import { User2, LogOut, LayoutDashboard, Mails, Send } from "lucide-react";
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarSeparator,
} from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

const AppSidebar = () => {
   const { data: session } = useSession();
   if (!session) return null;
   // Menu items.
   const items = [
      {
         title: "dashboard",
         url: "/dashboard",
         icon: LayoutDashboard,
      },
      {
         title: "Inbox",
         url: "/messages",
         icon: Mails,
      },
      {
         title: "Send Message",
         url: "/u",
         icon: Send,
      },
   ];

   return (
      <Sidebar variant="floating" collapsible="icon">
         <SidebarHeader className="py-3">
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                     <Link href="/">
                        <Image
                           src="/whisperBox.png"
                           alt=""
                           width={30}
                           height={30}
                           className="rounded-full object-center"
                        />
                        <span className="text-md font-semibold">
                           Anonymous Adventure
                        </span>
                     </Link>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>

         <SidebarSeparator />

         <SidebarContent className="px-0">
            {/* sidebar Group 1 */}
            <SidebarGroup>
               <SidebarGroupLabel>Application</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {items.map((item) => (
                        <SidebarMenuItem key={item.title} className="py-1 ">
                           <SidebarMenuButton asChild>
                              <Link href={item.url} className="text-lg">
                                 <item.icon size={20} />
                                 <span>{item.title}</span>
                              </Link>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>

            {/* Sidebar Group 4 Nested  */}
            <SidebarSeparator />
            <SidebarGroup>
               <SidebarGroupLabel className="py-1 ">
                  Account setting
               </SidebarGroupLabel>

               <SidebarGroupContent>
                  <SidebarMenu>
                     <SidebarMenuItem className="py-1 ">
                        <SidebarMenuButton asChild>
                           <Link href="/setting">
                              <User2 />
                              Profile
                           </Link>
                        </SidebarMenuButton>
                     </SidebarMenuItem>
                     <SidebarMenuItem className="text-red-500 hover:text-red-600 py-1">
                        <SidebarMenuButton onClick={() => signOut()}>
                           <LogOut />
                           Logout
                        </SidebarMenuButton>
                     </SidebarMenuItem>
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   );
};

export default AppSidebar;
