import { userFormSchema } from "@/zod/user";
import z from "zod";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  phoneNumber: string;
  role: userRole;
  active: boolean;
  createdAt: string; // ISO date string
}

export type UserFormValues = z.infer<typeof userFormSchema>;

export type userRole = "Admin" | "Guest" | "User";
