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

    async changeEmail(newEmail: string) {
        return this.post(`${this.userServiceUrl}/update/email`, {
            email: newEmail
        });
    }

    async changeUsername(newUsername: string) {
        return this.post(`${this.userServiceUrl}/update/username`, {
            username: newUsername
        });
    }

    async getUsersWithAmount(amount: string) {
        return this.get(`${this.userServiceUrl}/amount/${amount}`);
    }

    async getNumberOfUsers() {
        return this.get(`${this.userServiceUrl}/amount/main`);
    }
}
