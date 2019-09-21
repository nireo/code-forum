import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import userReducer from "./reducers/userReducer";
import postReducer from "./reducers/postReducer";
import usersReducer from "./reducers/usersReducer";

const reducer = combineReducers({
  user: userReducer,
  posts: postReducer,
  users: usersReducer
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
