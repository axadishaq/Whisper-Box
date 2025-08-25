import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   /* config options here */
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "pixabay.com",
         },
         {
            protocol: "https",
            hostname: "api.cloudinary.com",
         },
         {
            protocol: "http",
            hostname: "res.cloudinary.com",
         },
         {
            protocol: "https",
            hostname: "lh3.googleusercontent.com",
         },
         {
            protocol: "https",
            hostname: "dummyjson.com",
         },
      ],
   },
};

export default nextConfig;
