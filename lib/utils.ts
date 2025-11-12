import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRoleBadgeVariant = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "destructive";
    case "user":
      return "default";
    case "guest":
      return "secondary";
    default:
      return "outline";
  }
};
