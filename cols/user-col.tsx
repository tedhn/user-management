"use client";

import { Column, ColumnDef, FilterFn } from "@tanstack/react-table";
import { User } from "@/types/type";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import {
  Pencil,
  Eye,
  Trash2,
  ChevronUp,
  ChevronDown,
  Minus,
} from "lucide-react";
import { useState } from "react";

// Define event handler types
export interface UserTableActions {
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const dateEqualsFilter: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue) return true; // no filter applied

  const rowDate = new Date(row.getValue(columnId));
  const filterDate = new Date(filterValue);

  // Compare only the date part (ignore time)
  return (
    rowDate.getFullYear() === filterDate.getFullYear() &&
    rowDate.getMonth() === filterDate.getMonth() &&
    rowDate.getDate() === filterDate.getDate()
  );
};

// Bio cell with expand/collapse
function BioCell({ bio }: { bio: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 50;
  const shouldTruncate = bio.length > maxLength;

  return (
    <div className="max-w-sm flex items-center justify-between">
      <p className="text-sm  whitespace-normal">
        {shouldTruncate && !isExpanded ? `${bio.slice(0, maxLength)}...` : bio}
      </p>
      {shouldTruncate && (
        <Button
          variant="ghost"
          size="icon"
          className="h-auto p-2 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? (
            <ChevronUp className="h-3 w-3 mr-1" />
          ) : (
            <ChevronDown className="h-3 w-3 mr-1" />
          )}
        </Button>
      )}
    </div>
  );
}

export function SortableHeader({
  column,
  title,
}: {
  column: Column<any, unknown>;
  title: string;
}) {
  const isSorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(isSorted === "asc")}
      className=" p-0 cursor-pointer hover:bg-black/5"
    >
      {title}
      {isSorted === "asc" ? (
        <ChevronUp className="ml-2 h-4 w-4" />
      ) : isSorted === "desc" ? (
        <ChevronDown className="ml-2 h-4 w-4" />
      ) : (
        <Minus className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}

export const createUserColumns = (
  actions: UserTableActions
): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center items-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          aria-label="Select all"
          className="cursor-pointer"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <Checkbox
          className="cursor-pointer"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 80,
  },
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      );
    },
    size: 60,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Name" />;
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Email" />;
    },
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("phoneNumber")}</div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <Badge variant="default">{row.getValue("role")}</Badge>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Created At" />;
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
    filterFn: dateEqualsFilter,
  },
  {
    accessorKey: "bio",
    header: "Bio",
    cell: ({ row }) => <BioCell bio={row.getValue("bio")} />,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
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
            className="h-8 w-8"
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
            className="h-8 w-8"
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
    size: 120,
  },
];
