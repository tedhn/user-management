"use client";

import UserFormPage from "@/components/UserForm";
import { User, UserFormValues } from "@/types/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useUpdateUser, useUser } from "@/hooks/useUser";

const EditUserPage = () => {
  const router = useRouter();
  const params = useParams();

  const { data, isLoading, error } = useUser(params.id as string);

  const updateUserMutation = useUpdateUser();

  const handleUpdateUserApi = async (data: UserFormValues) => {
    toast.promise(
      updateUserMutation.mutateAsync({ id: params.id as string, data }),
      {
        loading: "Updating user...",
        success: "User updated successfully!",
        error: "Error updating user.",
      }
    );

    router.push("/user");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <UserFormPage user={data} handleApi={handleUpdateUserApi} />
    </>
  );
};

export default EditUserPage;
