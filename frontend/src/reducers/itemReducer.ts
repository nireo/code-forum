import { Dispatch } from "redux";
import PostService from "../services/post.service";
import UserService from "../services/user.service";

const postService = new PostService();
const userService = new UserService();

interface Amount {
    amount: number;
}

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
        const amount: Amount = await postService.getPostAmount();
        dispatch({
            type: "SET_POST_AMOUNT",
            data: amount.amount
        });
    };
};

export const getUserAmount = () => {
    return async (dispatch: Dispatch) => {
        const amount: Amount = await userService.getNumberOfUsers();
        dispatch({
            type: "SET_USER_AMOUNT",
            data: amount.amount
        });
    };
};

export default reducer;
