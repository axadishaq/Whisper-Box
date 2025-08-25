"use client";
import axios from "axios";

const upload = async (file) => {
   // Use the hardcoded URL since this is client-side code
   const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/axad/image/upload";

   const data = new FormData();
   data.append("file", file);
   data.append("upload_preset", "uraaan");

   try {
      const res = await axios.post(CLOUDINARY_URL, data);
      if (res.data && res.data.url) {
         return res.data.url;
      } else {
         throw new Error("Invalid response from Cloudinary");
      }
   } catch (err) {
      console.error("Image upload error:", err);
      throw err;
   }
};
export default upload;
