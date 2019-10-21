import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import userReducer from "./reducers/userReducer";
import postReducer from "./reducers/postReducer";
import usersReducer from "./reducers/usersReducer";
import ownPostsReducer from "./reducers/ownPosts";
import notificationReducer from "./reducers/notification";

const reducer = combineReducers({
  user: userReducer,
  posts: postReducer,
  users: usersReducer,
  ownPosts: ownPostsReducer,
  notification: notificationReducer
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
