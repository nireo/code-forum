import { PostInterface } from "../interfaces/post.interface";
import postService from "../services/posts";
import { Dispatch } from "redux";

const reducer = (state: PostInterface[] = [], action: any) => {
  switch (action.type) {
    case "SET_POSTS":
      return action.data;
    case "CLEAR_POSTS":
      return [];
    default:
      return state;
  }
};

export const getUsersPosts = (id: string) => {
  return async (dispatch: Dispatch) => {
    const posts = await postService.getPostsFromUser(id);
    dispatch({
      type: "SET_POSTS",
      data: posts
    });
  };
};

export const setData = (data: any) => {
  return { type: "SET_DATA", data: data };
};

export const clearUsersPosts = () => {
  return { type: "CLEAR_POSTS" };
};

export default reducer;
