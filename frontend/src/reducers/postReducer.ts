import { Dispatch } from "redux";
import postService from "../services/posts";
import commentService from "../services/comments";
import {
  CreatePostInterface,
  PostInterface
} from "../interfaces/post.interface";

const reducer = (state: PostInterface[] = [], action: any) => {
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
    case "ADD_TO_EXISTING":
      let copyState = state;
      action.data.forEach((post: PostInterface | never) => {
        copyState = [...state, post];
      });
      return copyState;
    case "ADD_COMMENTS":
      const post = state.find(p => p._id === action.id);
      if (post) {
        post.comments = action.data;
      }
      // refresh the posts
      return state.map(p => (p._id === action.id ? post : p));
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
    const newPost = await postService.createPost(post);
    dispatch({
      type: "INIT_SINGLE",
      data: newPost
    });
  };
};

export const getPostsByCategory = (category: string) => {
  return async (dispatch: Dispatch) => {
    const posts = await postService.getPostsFromCategory(category);
    dispatch({
      type: "ADD_TO_EXISTING",
      data: posts
    });
  };
};

export const getCommentsInPost = (id: string) => {
  return async (dispatch: Dispatch) => {
    const comments = await commentService.getCommentsInPost(id);
    dispatch({
      type: "ADD_COMMENTS_TO_POST",
      data: comments,
      id: id
    });
  };
};

export const clearPosts = () => {
  return { type: "CLEAR_POSTS" };
};

export default reducer;
