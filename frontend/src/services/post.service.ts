import BaseHttpService from "./base-service";
import { CreatePostInterface } from "../interfaces/post.interface";

export default class PostService extends BaseHttpService {
  private postServiceUrl: string = "/api/post";

  async getPostById(id: string) {
    return this.get(`${this.postServiceUrl}/${id}`);
  }

  async getPosts(page: string) {
    return this.get(`${this.postServiceUrl}/${page}`);
  }

  async getPostsFromUser(userId: string) {
    return this.get(`${this.postServiceUrl}/user/${userId}`);
  }

  async getPostsFromCategory(category: string) {
    return this.get(`${this.postServiceUrl}/c/${category}`);
  }

  async deletePost(id: string) {
    return this.delete(`${this.postServiceUrl}/${id}`);
  }

  async createPost(newPost: CreatePostInterface) {
    return this.post(`${this.postServiceUrl}`, newPost);
  }
}
