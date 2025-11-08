"use client";

import UserFormPage from "@/components/UserForm";
import { useCreateUser } from "@/hooks/useUser";
import { UserFormValues } from "@/types/type";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const CreateUserPage = () => {
  const router = useRouter();

  const createUserMutation = useCreateUser();

  const handleCreateUserApi = async (data: UserFormValues) => {
    toast.promise(createUserMutation.mutateAsync({ data }), {
      loading: "Creating user...",
      success: "User created successfully!",
      error: "Error creating user.",
    });

    router.push("/user");
  };

  return (
    <>
      <UserFormPage handleApi={handleCreateUserApi} />
    </>
  );
};

export default CreateUserPage;
