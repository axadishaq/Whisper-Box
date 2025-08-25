import z from "zod";

export const usernameValidation = z
   .string()
   .min(4, "username must be atleast 4 character!")
   .max(50)
   .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special character!");

export const signupSchema = z.object({
   username: usernameValidation,
   email: z.email({ message: "Invalid email address!" }),
   password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[A-Z]/, {
         message:
            "Password must include uppercase, lowercase, number, and special character.",
      })
      .regex(/[a-z]/, {
         message:
            "Password must include uppercase, lowercase, number, and special character.",
      })
      .regex(/[0-9]/, {
         message:
            "Password must include uppercase, lowercase, number, and special character.",
      })
      .regex(/[^A-Za-z0-9]/, {
         message:
            "Password must include uppercase, lowercase, number, and special character.",
      }),
});

export const updateUserScheme = z.object({
   username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters!" })
      .max(50),
   email: z.string().email({ message: "Invalid email address!" }),
   password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[A-Z]/, {
         message:
            "Password must include uppercase, lowercase, number, and special character.",
      })
      .regex(/[a-z]/, {
         message:
            "Password must include uppercase, lowercase, number, and special character.",
      })
      .regex(/[0-9]/, {
         message:
            "Password must include uppercase, lowercase, number, and special character.",
      })
      .regex(/[^A-Za-z0-9]/, {
         message:
            "Password must include uppercase, lowercase, number, and special character.",
      })
      .optional()
      .or(z.literal("")),
   image: z.string().optional(), 
});
