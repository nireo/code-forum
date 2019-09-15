import axios from 'axios';
const baseUrl = '/api/comment';

const getCommentsInPost = async (id: string) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

const createComment = async (newComment: Comment) => {
  const response = await axios.post(`${baseUrl}`, newComment);
  return response.data;
};

const deleteComment = async (id: string) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
};

const updateComment = async (updated: Comment, id: string) => {
  const response = await axios.patch(`${baseUrl}/${id}`, updated);
  return response.data;
};

export default {
  createComment,
  getCommentsInPost,
  deleteComment,
  updateComment
};
