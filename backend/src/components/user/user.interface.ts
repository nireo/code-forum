import Post from "../post/post.interface";

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  posts: Array<string>;
}

export default User;
