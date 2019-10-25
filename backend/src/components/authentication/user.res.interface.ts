import User from "../user/user.interface";
import TokenData from "../../interfaces/token.data.interface";

export interface ResponseUser {
    user: User;
    tokenData: TokenData;
}
