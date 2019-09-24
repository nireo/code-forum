interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  posts: Array<string>;
  comments: Array<string>;
}

export default User;
