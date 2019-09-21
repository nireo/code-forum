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

export default CreateUser;
