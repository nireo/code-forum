import axios from "axios";
import { CreateComment } from "../interfaces/comment.interface";
const baseUrl = "/api/comment";

let token: string = "";

const setToken = (token: string): void => {
  token = `bearer ${token}`;
};

const getConfig = () => ({
  headers: { Authorization: token }
});

const getCommentsInPost = async (id: string) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

const createComment = async (id: string, newComment: CreateComment) => {
  const response = await axios.post(
    `${baseUrl}/${id}`,
    newComment,
    getConfig()
  );
  return response.data;
};

const deleteComment = async (id: string) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig());
  return response.data;
};

const updateComment = async (updated: Comment, id: string) => {
  const response = await axios.patch(`${baseUrl}/${id}`, updated, getConfig());
  return response.data;
};

export default {
  createComment,
  getCommentsInPost,
  deleteComment,
  updateComment,
  setToken
};
