import BaseHttpService from "./base-service";
import axios from "axios";
import CreateUser from "../interfaces/user.interface";

export default class AuthService extends BaseHttpService {
  private authServiceUrl: string = "/api/auth";

  async logIn(username: string, password: string) {
    const result = await axios.post(`${this.authServiceUrl}/login`, {
      username,
      password
    });
    const token = result.data.token;
    this.saveToken(token);
    return result.data.user;
  }

  async registerUser(newUser: CreateUser) {
    await this.post(`${this.authServiceUrl}/new`, newUser);
  }
}
