import BaseHttpService from "./base-service";

export default class UserService extends BaseHttpService {
  private userServiceUrl: string = "/api/user";

  async getUsers() {
    return this.get(`${this.userServiceUrl}/1`);
  }

  async getUserById(id: string) {
    return this.get(`${this.userServiceUrl}/${id}`);
  }

  async deleteUser(id: string) {
    return this.delete(`${this.userServiceUrl}/${id}`);
  }

  async updatePassword(password: string) {
    return this.post(`${this.userServiceUrl}/update`, { password });
  }
}
