import BaseHttpService from "./base-service";
import axios from "axios";
import CreateUser from "../interfaces/user.interface";

export default class AuthService extends BaseHttpService {
  async logIn(username: string, password: string) {
    const result = await axios.post("/api/auth/login", { username, password });
    const token = result.data.token;
    this.saveToken(token);
    return result.data.user;
  }

  async registerUser(newUser: CreateUser) {
    await this.post("/api/auth/new", newUser);
  }
}
