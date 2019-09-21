import { Dispatch } from "redux";
import userService from "../services/users";

const reducer = (state: Array<object> = [], action: any) => {
  switch (action.type) {
    case "INIT_SINGLE":
      if (state === []) {
        return action.data;
      }
      return [...state, action.data];
    case "INIT_USERS":
      return action.data;
    case "CLEAR_USERS":
      return [];
    default:
      return state;
  }
};

export const initSingleUser = (id: string) => {
  return async (dispatch: Dispatch) => {
    const user = await userService.getUserById(id);
    if (user) {
      dispatch({
        type: "INIT_SINGLE",
        data: user
      });
    }
  };
};

export const initAllUsers = () => {
  return async (dispatch: Dispatch) => {
    const users = await userService.getUsers();
    dispatch({
      type: "INIT_USERS",
      data: users
    });
  };
};

export const clearUsers = () => {
  return (dispatch: Dispatch) => {
    dispatch({ type: "CLEAR_USERS" });
  };
};

export default reducer;
