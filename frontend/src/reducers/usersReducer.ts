import { Dispatch } from "redux";
import userService from "../services/users";
import { User } from "../interfaces/user.interface";
import UserService from "../services/user.service";

const classUserService = new UserService();

const reducer = (state: User[] = [], action: any) => {
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
    case "ADD_MORE_USERS":
      if (state === []) {
        return action.data;
      }

      return [...state, action.data];
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

export const initAmountOfUsers = (amount: string) => {
  return async (dispatch: Dispatch) => {
    const users = await classUserService.getUsersWithAmount(amount);
    dispatch({
      type: "ADD_MORE_USERS",
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
