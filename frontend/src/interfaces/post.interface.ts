import { User } from "./user.interface";

export interface CreatePostInterface {
  title: string;
  content: string;
  category: string;
}

export interface PostInterface {
  title: string;
  content: string;
  byUser: User;
  likes: number;
  dislikes: number;
  category: string;
  _id: string;
}
