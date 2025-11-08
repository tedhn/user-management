"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeleteUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { User } from "@/types/type";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  roles: string[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  roles,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const deleteUserMutation = useDeleteUser();

  // Get selected rows for internal use
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleBulkDelete = (selectedUsers: User[]) => {
    const userIds = selectedUsers.map((user) => user.id);

    toast.promise(
      () =>
        Promise.all(userIds.map((id) => deleteUserMutation.mutateAsync(id))),
      {
        loading: "Deleting users...",
        success: "Users deleted successfully.",
        error: "Error deleting users.",
      }
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 py-4 lg:flex-row lg:justify-between lg:items-center">
        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <Input
            placeholder="Search name or email..."
            value={
              (table.getColumn("name")?.getFilterValue() as string) ??
              (table.getColumn("email")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) => {
              const value = event.target.value;
              table.getColumn("name")?.setFilterValue(value);
              table.getColumn("email")?.setFilterValue(value);
            }}
            className="w-full sm:w-60"
          />

          {/* Role Filter */}
          <Select
            onValueChange={(value) =>
              table
                .getColumn("role")
                ?.setFilterValue(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Created Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[180px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span className="truncate">
                  {table.getColumn("createdAt")?.getFilterValue()
                    ? format(
                        new Date(
                          table
                            .getColumn("createdAt")
                            ?.getFilterValue() as string
                        ),
                        "PPP"
                      )
                    : "Filter by date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  table.getColumn("createdAt")?.getFilterValue()
                    ? new Date(
                        table.getColumn("createdAt")?.getFilterValue() as string
                      )
                    : undefined
                }
                onSelect={(date) => {
                  console.log("Selected date:", date);
                  table
                    .getColumn("createdAt")
                    ?.setFilterValue(date ? date.toISOString() : undefined);
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Clear Filters Button */}
          <Button
            variant="outline"
            onClick={() => {
              table.resetColumnFilters();
            }}
            className="w-full sm:size-9"
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="ml-2 sm:hidden">Clear Filters</span>
          </Button>
        </div>

        {/* Actions Section */}
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button
            onClick={() =>
              handleBulkDelete(selectedRows.map((row) => row.original as User))
            }
            variant="destructive"
            disabled={selectedRows.length === 0}
            className="w-full sm:flex-1 lg:w-auto"
          >
            Delete Users {selectedRows.length > 0 && `(${selectedRows.length})`}
          </Button>
          <Button
            onClick={() => router.push("/user/new")}
            className="w-full sm:flex-1 lg:w-auto"
          >
            Add User
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
