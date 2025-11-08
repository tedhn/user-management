import { User } from "@/types/type";
import axios from "axios";

const baseURL = "https://68ff8c08e02b16d1753e6ed3.mockapi.io/maia/api/v1";

const fetchSingleUser = async (id: string): Promise<User> => {
  const data = await axios.get(`${baseURL}/user/${id}`);

  return data.data;
};

const fetchUsers = async (): Promise<User[]> => {
  const data = await axios.get(`${baseURL}/user`);
  return data.data;
};

const createUser = async (userData: Partial<User>): Promise<User> => {
  const data = await axios.post(`${baseURL}/user`, userData);
  return data.data;
};

const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<User> => {
  const data = await axios.put(`${baseURL}/user/${id}`, userData);
  return data.data;
};

const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${baseURL}/user/${id}`);
};

export { fetchUsers, fetchSingleUser, createUser, updateUser, deleteUser };
