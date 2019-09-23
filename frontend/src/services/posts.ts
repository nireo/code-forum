import axios from "axios";
import { CreatePostInterface } from "../interfaces/post.interface";
const baseUrl = "/api/post";

let token: string = "";

const setToken = (token: string): void => {
  token = `bearer ${token}`;
};

const getConfig = () => ({
  headers: { Authorization: token }
});

const getPostById = async (id: string) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

const getPosts = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const deletePost = async (id: string) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
};

const createPost = async (newPost: CreatePostInterface) => {
  const response = await axios.post(baseUrl, newPost, getConfig());
  return response.data;
};

export default { deletePost, getPostById, getPosts, createPost, setToken };
