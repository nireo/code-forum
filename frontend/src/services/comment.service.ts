import BaseHttpService from "./base-service";
import { CreateComment } from "../interfaces/comment.interface";

export default class CommentService extends BaseHttpService {
  private commentServiceUrl: string = "/api/comment";

  async createComment(id: string, newComment: CreateComment) {
    return this.post(`${this.commentServiceUrl}/${id}`, newComment);
  }

  async deleteComment(id: string) {
    return this.delete(`${this.commentServiceUrl}/${id}`);
  }

  async updateComment(updated: Comment, id: string) {
    return this.patch(`${this.commentServiceUrl}/${id}`, updated);
  }
}
