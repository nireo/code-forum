import BaseHttpService from "./base-service";

export default class UserService extends BaseHttpService {
  private userServiceUrl = "/api/user";

  async getUsers() {
    return this.get(this.userServiceUrl);
  }

  async getUserById(id: string) {
    return this.get(`${this.userServiceUrl}/${id}`);
  }

  async deleteUser(id: string) {
    return this.delete(`${this.userServiceUrl}/${id}`);
  }
}
