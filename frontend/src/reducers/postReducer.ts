import { Dispatch } from "redux";
import postService from "../services/posts";
import commentService from "../services/comments";
import {
  CreatePostInterface,
  PostInterface
} from "../interfaces/post.interface";
import { CreateComment } from "../interfaces/comment.interface";

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
      return state.map(p => (p._id === action.id ? action.data : p));
    case "NEW_COMMENT":
      const postToComment = state.find(p => p._id === action.id);
      if (postToComment) {
        postToComment.comments = postToComment.comments.concat(action.data);
      }
      return state.map(p => (p._id === action.id ? postToComment : p));
    case "REMOVE_POST":
      return state.filter(p => p._id !== action.data);
    default:
      return state;
  }
};

export const initPosts = (page: string) => {
  return async (dispatch: Dispatch) => {
    const posts = await postService.getPosts(page);
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

export const removePost = (id: string) => {
  return async (dispatch: Dispatch) => {
    await postService.deletePost(id);
    dispatch({
      type: "REMOVE_POST"
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

export const addNewComment = (id: string, newComment: CreateComment) => {
  return async (dispatch: Dispatch) => {
    const comment = await commentService.createComment(id, newComment);
    dispatch({
      type: "NEW_COMMENT",
      data: comment,
      id: id
    });
  };
};

export const clearPosts = () => {
  return { type: "CLEAR_POSTS" };
};

export default reducer;
