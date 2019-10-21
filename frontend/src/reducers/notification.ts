import { Dispatch } from "redux";

const reducer = (state: null | Notification = null, action: any) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.data;
    case "CLEAR_NOTIFICATION":
      return null;
    default:
      return state;
  }
};

export const setNotification = (
  content: string,
  type: string,
  time: number
) => {
  return async (dispatch: Dispatch) => {
    dispatch({
      type: "SET_NOTIFICATION",
      data: {
        content,
        type
      }
    });
    setTimeout(() => {
      dispatch({
        type: "CLEAR_NOTIFICATION"
      });
    }, time * 1000);
  };
};

export default reducer;
