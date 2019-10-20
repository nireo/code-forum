import { PostInterface } from "./post.interface";
import Comment from "./comment.interface";

interface CreateUser {
  username: string;
  email: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface PersonalUser {
  _id: string;
  username: string;
  email: string;
  posts: PostInterface[];
  comments: Comment[];
}

export default CreateUser;
