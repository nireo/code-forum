import Login from "../interfaces/login.interface";
import users from "../services/users";
import { Dispatch } from "redux";
import { setTokens } from "../utils/helpers";

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

export const logUserIn = (credentials: Login, remember: boolean) => {
  return async (dispatch: Dispatch) => {
    const userData = await users.logUserIn(credentials);
    setTokens(userData.tokenData.token);
    if (remember) {
      window.localStorage.setItem("loggedUser", JSON.stringify(userData));
    }
    if (userData) {
      dispatch({
        type: "LOG_USER_IN",
        data: userData
      });
    }
  };
};

export const checkLocalStorage = () => {
  return async (dispatch: Dispatch) => {
    const user = window.localStorage.getItem("loggedUser");
    if (user) {
      const userInfoJson = JSON.parse(user);
      dispatch({
        type: "LOG_USER_IN",
        data: userInfoJson
      });
    }
  };
};

export const logUserOut = () => {
  return { type: "LOG_USER_OUT" };
};

export default reducer;
