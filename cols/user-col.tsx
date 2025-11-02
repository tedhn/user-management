"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/type";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Pencil, Trash, Eye, Trash2 } from "lucide-react";

// Define event handler types
export interface UserTableActions {
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onRowClick: (user: User, isSelected: boolean) => void;
}

export const createUserColumns = (
  actions: UserTableActions
): ColumnDef<User>[] => [
  {
    accessorKey: "",
    id: "select",
    size: 10,
    cell: ({ row }) => {
      return (
        <div className="w-full h-full flex justify-center items-center">
          <Checkbox
            className="cursor-pointer"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);

              actions.onRowClick(row.original, !!value);
            }}
            aria-label="Select row"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return <span className="capitalize">{row.getValue("role")}</span>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("active") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center justify-center gap-2">
          {/* Direct action buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              actions.onView(user);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              actions.onEdit(user);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer "
            onClick={(e) => {
              e.stopPropagation();
              actions.onDelete(user);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      );
    },
  },
];
