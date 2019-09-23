import { Dispatch } from "redux";
import postService from "../services/posts";
import { CreatePostInterface } from "../interfaces/post.interface";

const reducer = (state = [], action: any) => {
  switch (action.type) {
    case "INIT_POSTS":
      return action.data;
    case "CLEAR_POSTS":
      return null;
    case "INIT_SINGLE":
      if (!state) {
        return action.data;
      }
      return [...state, action.data];
    default:
      return state;
  }
};

export const initPosts = () => {
  return async (dispatch: Dispatch) => {
    const posts = await postService.getPosts();
    dispatch({
      type: "INIT_POSTS",
      data: posts
    });
  };
};

export const getSinglePost = (id: string) => {
  return async (dispatch: Dispatch) => {
    const post = await postService.getPostById(id);
    dispatch({
      type: "INIT_SINGLE",
      data: post
    });
  };
};

export const CreatePost = (post: CreatePostInterface) => {
  return async (dispatch: Dispatch) => {
    await postService.setToken();
    const newPost = await postService.createPost(post);
    dispatch({
      type: "INIT_SINGLE",
      data: newPost
    });
  };
};

export const clearPosts = () => {
  return { type: "CLEAR_POSTS" };
};

export default reducer;
