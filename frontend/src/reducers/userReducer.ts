import Login from "../interfaces/login.interface";
import users from "../services/users";
import { Dispatch } from "redux";

const reducer = (state = null, action: any) => {
  switch (action.type) {
    case "LOG_USER_IN":
      return action.data;
    case "LOG_USER_OUT":
      return null;
    default:
      return state;
  }
};

export const logUserIn = (credentials: Login) => {
  return async (dispatch: Dispatch) => {
    const userData = await users.logUserIn(credentials);
    console.log(userData);
    if (userData) {
      dispatch({
        type: "LOG_USER_IN",
        data: userData
      });
    }
  };
};

export const logUserOut = () => {
  return { type: "LOG_USER_OUT" };
};

export default reducer;
