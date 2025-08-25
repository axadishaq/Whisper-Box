import z from "zod";

export const messageSchema = z.object({
   content: z
      .string()
      .min(6, { message: "Messgae must be at least 6 character" })
      .max(200, { message: "Messgae must be no longer than 200 character" }),
});
