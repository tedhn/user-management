"use client";
import { createUserColumns } from "@/cols/user-col";
import { DataTable } from "@/tables/UserTable";
import { User } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { create } from "domain";
import { useState } from "react";

async function fetchUsers(): Promise<User[]> {
  const data = await axios.get(
    "https://68ff8c08e02b16d1753e6ed3.mockapi.io/maia/api/v1/user"
  );

  return data.data;
}

const UsersPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const columns = createUserColumns({
    onView: (user: User) => {
      console.log("View user:", user);
    },
    onEdit: (user: User) => {
      console.log("Edit user:", user);
    },
    onDelete: (user: User) => {
      console.log("Delete user:", user);
    },
    onRowClick: (user: User, isSelected: boolean) => {
      setSelectedUsers((prevSelected) => {
        if (isSelected) {
          return [...prevSelected, user];
        } else {
          return prevSelected.filter((u) => u.id !== user.id);
        }
      });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <DataTable columns={columns} data={data || []} />
    </div>
  );
};

export default UsersPage;
