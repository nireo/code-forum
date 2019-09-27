import { User } from "./user.interface";
import Comment from "./comment.interface";

export interface CreatePostInterface {
  title: string;
  content: string;
  category: string;
}

export interface PostInterface {
  title: string;
  content: string;
  byUser: User;
  comments: Comment[];
  likes: number;
  dislikes: number;
  category: string;
  _id: string;
}
