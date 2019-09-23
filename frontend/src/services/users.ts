import axios from "axios";
import CreateUser from "../interfaces/user.interface";
import Login from "../interfaces/login.interface";
const baseUrl: string = "/api/user";
const authUrl: string = "/api/auth";

let token: string = "";

const setToken = (token: string): void => {
  token = `bearer ${token}`;
};

const getConfig = () => ({
  headers: { Authorization: token }
});

const getUsers = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getUserById = async (id: string) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

const deleteUser = async (id: string) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig());
  return response.data;
};

const registerUser = async (newUser: CreateUser) => {
  const response = await axios.post(`${authUrl}/new`, newUser);
  return response.data;
};

const logUserIn = async (credentials: Login) => {
  const response = await axios.post(`${authUrl}/login`, credentials, {
    withCredentials: true
  });
  return response.data;
};

export default {
  getUsers,
  getUserById,
  deleteUser,
  registerUser,
  logUserIn,
  setToken
};
