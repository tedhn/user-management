import z from "zod";

// Zod validation schema
export const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().min(1, "Phone number with country code is required"),
  avatar: z.string().optional(),
  role: z.enum(["Admin", "User", "Guest"], {
    message: "Please select a role",
  }),
  active: z.boolean(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
});
