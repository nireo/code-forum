import { User } from "./user.interface";

export interface CreatePostInterface {
  title: string;
  content: string;
}

export interface PostInterface {
  title: string;
  content: string;
  byUser: User;
  likes: number;
  dislikes: number;
  _id: string;
}
