import axios from "axios";
import { CreatePostInterface } from "../interfaces/post.interface";
const baseUrl = "/api/post";

let token = "";

const setToken = (newToken: string) => {
  token = `bearer ${newToken}`;
};

const getConfig = () => ({
  headers: { Authorization: token }
});

const getPostById = async (id: string) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

const getPosts = async (page: string) => {
  const response = await axios.get(`${baseUrl}/${page}`);
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

const getPostsFromCategory = async (category: string) => {
  const response = await axios.get(`${baseUrl}/c/${category}`);
  return response.data;
};

const getPostsFromUser = async (userId: string) => {
  const response = await axios.get(`${baseUrl}/user/${userId}`);
  return response.data;
};

export default {
  deletePost,
  getPostById,
  getPosts,
  createPost,
  setToken,
  getPostsFromCategory,
  getPostsFromUser
};
