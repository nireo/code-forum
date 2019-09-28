import { User } from "./user.interface";

interface Comment {
  content: string;
  byUser: User;
}

export interface CreateComment {
  content: string;
}

export default Comment;
