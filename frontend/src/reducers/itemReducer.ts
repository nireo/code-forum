import { Dispatch } from "redux";
import PostService from "../services/post.service";
import UserService from "../services/user.service";

const postService = new PostService();
const userService = new UserService();

const reducer = (state = [0, 0], action: any) => {
    switch (action.type) {
        case "SET_POST_AMOUNT":
            const withAmount = [action.data, state[1]];
            return withAmount;
        case "SET_USER_AMOUNT":
            const withUsers = [state[0], action.data];
            return withUsers;
        default:
            return state;
    }
};

export const initPostAmount = () => {
    return async (dispatch: Dispatch) => {
        const amount = await postService.getPostAmount();
        dispatch({
            type: "SET_POST_AMOUNT",
            data: amount
        });
    };
};

export default reducer;
