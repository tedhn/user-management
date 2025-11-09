"use client";
import { createUserColumns } from "@/cols/user-col";
import { DeleteConfirmationDialog } from "@/components/dialog/DeleteDialog";
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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const roles = data ? Array.from(new Set(data.map((user) => user.role))) : [];

  const columns = createUserColumns({
    onView: (user: User) => {
      console.log("View user:", user);
    },
    onEdit: (user: User) => {
      router.push(`/user/${user.id}`);
    },
    onDelete: (user: User) => {
      setSelectedUsers([user]);

      setDeleteDialogOpen(true);
    },
  });

  const handleDelete = () => {
    const userIds = selectedUsers.map((user) => user.id);

    setDeleteDialogOpen(false);
    setSelectedUsers([]);

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-10 ">
      <Header>
        <h1 className="text-3xl font-bold mb-6">Users</h1>
      </Header>
      <DataTable
        columns={columns}
        data={data || []}
        roles={roles}
        onDelete={(selectedUser) => {
          setSelectedUsers(selectedUser);
          setDeleteDialogOpen(true);
        }}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        itemCount={selectedUsers.length}
        itemName="user"
      />
    </div>
  );
};

export default UsersPage;
