import {
  createUser,
  deleteUser,
  fetchSingleUser,
  fetchUsers,
  updateUser,
} from "@/api/user";
import { User } from "@/types/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters?: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export const useUsers = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => fetchUsers(),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchSingleUser(id),
    enabled: !!id,
    retry: 2,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: Partial<User> }) => createUser(data),
    onMutate: async ({ data }) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });

      // Snapshot previous values
      const previousUsers = queryClient.getQueryData<User[]>(userKeys.lists());

      const tempId = `temp-${Math.random().toString(36).substr(2, 9)}`;
      // Optimistically update list
      queryClient.setQueryData<User[]>(userKeys.lists(), (old) =>
        old
          ? [...old, { ...data, id: tempId } as User]
          : [{ ...data, id: tempId } as User]
      );

      return { previousUsers };
    },
    onError: (err, { data }, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(userKeys.lists(), context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

// Update user with optimistic update
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      updateUser(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });
      await queryClient.cancelQueries({ queryKey: userKeys.detail(id) });

      // Snapshot previous values
      const previousUsers = queryClient.getQueryData<User[]>(userKeys.lists());
      const previousUser = queryClient.getQueryData<User>(userKeys.detail(id));

      // Optimistically update list
      queryClient.setQueryData<User[]>(userKeys.lists(), (old) =>
        old?.map((user) => (user.id === id ? { ...user, ...data } : user))
      );

      // Optimistically update detail
      queryClient.setQueryData<User>(userKeys.detail(id), (old) =>
        old ? { ...old, ...data } : old
      );

      return { previousUsers, previousUser };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(userKeys.lists(), context.previousUsers);
      }
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.detail(id), context.previousUser);
      }
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onMutate: async (id) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });

      // Snapshot previous values
      const previousUsers = queryClient.getQueryData<User[]>(userKeys.lists());

      // Optimistically update list
      queryClient.setQueryData<User[]>(userKeys.lists(), (old) =>
        old?.filter((user) => user.id !== id)
      );

      return { previousUsers };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(userKeys.lists(), context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};
