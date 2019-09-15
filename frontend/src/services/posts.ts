import axios from 'axios';
const baseUrl = '/api/posts';

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

const createPost = async (newPost: object) => {
  const response = await axios.post(baseUrl, newPost);
  return response.data;
};

export default { deletePost, getPostById, getPosts, createPost };
