"use client";
import { createUserColumns } from "@/cols/user-col";
import Header from "@/components/Header";
import { useDeleteUser, useUsers } from "@/hooks/useUser";
import { DataTable } from "@/tables/UserTable";
import { User } from "@/types/type";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";

const UsersPage = () => {
  const router = useRouter();

  const { data, isLoading, error } = useUsers();
  const deleteUserMutation = useDeleteUser();

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // TODO: cant select every user when checking the header checkbox, only the visiable users on the current page

  const roles = data ? Array.from(new Set(data.map((user) => user.role))) : [];

  const columns = createUserColumns({
    onView: (user: User) => {
      console.log("View user:", user);
    },
    onEdit: (user: User) => {
      router.push(`/user/${user.id}`);
    },
    onDelete: (user: User) => {
      toast.promise(deleteUserMutation.mutateAsync(user.id), {
        loading: "Deleting user...",
        success: "User deleted successfully!",
        error: "Error deleting user.",
      });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-10 ">
      <Header>
        <h1 className="text-3xl font-bold mb-6">Users</h1>
      </Header>
      <DataTable columns={columns} data={data || []} roles={roles} />
    </div>
  );
};

export default UsersPage;
