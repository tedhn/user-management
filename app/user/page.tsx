"use client";
import { createUserColumns } from "@/cols/user-col";
import { DeleteConfirmationDialog } from "@/components/dialog/DeleteDialog";
import Header from "@/components/Header";
import { LoadingComponent } from "@/components/loading";
import { NotFoundComponet } from "@/components/NotFound";
import { useDeleteUser, userKeys, useUsers } from "@/hooks/useUser";
import { DataTable } from "@/tables/UserTable";
import { User } from "@/types/type";
import { useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";

const UsersPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useUsers();
  const deleteUserMutation = useDeleteUser();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const roles = data ? Array.from(new Set(data.map((user) => user.role))) : [];

  const columns = createUserColumns({
    onView: (user: User) => {
      router.push(`/user/${user.id}?mode=view`);
    },
    onEdit: (user: User) => {
      router.push(`/user/${user.id}?mode=edit`);
    },
    onDelete: (user: User) => {
      setSelectedUsers([user]);

      setDeleteDialogOpen(true);
    },
  });

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    const usersId = selectedUsers.map((user) => user.id);

    const oldUsersValue = queryClient.getQueryData<User[]>(userKeys.lists());

    queryClient.cancelQueries({ queryKey: userKeys.lists() });

    // Optimistically update BEFORE closing dialog
    queryClient.setQueryData<User[]>(userKeys.lists(), (old) => {
      if (!old) return [];
      return old.filter((user) => !usersId.includes(user.id));
    });

    const timeOutId = setTimeout(() => {
      setSelectedUsers([]);
      toast.promise(
        () =>
          Promise.all(usersId.map((id) => deleteUserMutation.mutateAsync(id))),
        {
          loading: "Deleting users...",
          success: "Users deleted successfully.",
          error: "Error deleting users.",
        }
      );
    }, 5000);

    // Show undo toast
    toast(`Deleting ${selectedUsers.length} user(s)...`, {
      action: {
        label: "Undo",
        onClick: () => {
          clearTimeout(timeOutId);
          queryClient.setQueryData<User[]>(userKeys.lists(), oldUsersValue);
          toast.success("Delete undone.");
        },
      },
      duration: 5000,
    });
  };

  if (isLoading) return <LoadingComponent />;
  if (error) return <NotFoundComponet />;

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
