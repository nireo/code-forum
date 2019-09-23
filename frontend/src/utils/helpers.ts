import userService from "../services/users";
import postService from "../services/posts";
import commentService from "../services/comments";

export const setTokens = (token: string) => {
  userService.setToken(token);
  postService.setToken(token);
  commentService.setToken(token);
};
