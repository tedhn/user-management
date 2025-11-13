"use client";

import UserFormPage from "@/components/UserForm";
import { UserFormValues } from "@/types/type";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCreateUser, useUpdateUser, useUser } from "@/hooks/useUser";

import { toast as sonnerToast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import UserDetailView from "@/components/UserDetails";
import { LoadingComponent } from "@/components/loading";
import { NotFoundComponet } from "@/components/NotFound";

const EditUserPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const mode = searchParams.get("mode");

  const [isEditMode, setIsEditMode] = useState(mode === "edit");
  const [showDialog, setShowDialog] = useState(false);
  const [createUserData, setCreateUserData] = useState<UserFormValues | null>(
    null
  );

  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useUser(params.id as string);

  const updateUserMutation = useUpdateUser();
  const createUserMutation = useCreateUser();

  const handleUpdateUserApi = async (data: UserFormValues) => {
    const result = await refetch();

    const userExists = !!result.data && !result.error;

    if (userExists) {
      router.push("/user");

      sonnerToast.promise(
        updateUserMutation.mutateAsync({ id: params.id as string, data }),
        {
          loading: "Updating user...",
          success: "User updated successfully!",
          error: "Error updating user.",
        }
      );
    } else {
      setShowDialog(true);
      setCreateUserData(data);
    }
  };

  const handleCreateUserApi = async () => {
    setShowDialog(false);
    router.push("/user");

    sonnerToast.promise(
      createUserMutation.mutateAsync({
        data: createUserData as UserFormValues,
      }),
      {
        loading: "Creating user...",
        success: "User created successfully!",
        error: "Error creating user.",
      }
    );
  };

  const handleOnEditClick = (isEdit: boolean) => {
    setIsEditMode(isEdit);

    const params = new URLSearchParams(searchParams.toString());

    // Update or add mode param
    params.set("mode", isEdit ? "edit" : "view");

    // Push the new URL with updated params
    router.push(`?${params.toString()}`);
  };

  if (isLoading) return <LoadingComponent />;
  if (error) return <NotFoundComponet />;

  return (
    <>
      {isEditMode ? (
        <UserFormPage
          user={userData}
          handleApi={handleUpdateUserApi}
          onView={() => handleOnEditClick(false)}
        />
      ) : (
        <UserDetailView
          user={userData!}
          onEdit={() => handleOnEditClick(true)}
        />
      )}

      <Dialog open={showDialog} onOpenChange={() => setShowDialog(false)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>User not found</DialogTitle>
            <DialogDescription>
              The user you’re trying to edit doesn’t exist. Would you like to
              create a new user instead?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUserApi}>Create New User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditUserPage;
