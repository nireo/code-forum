import { Request } from "express";
import User from "../components/user/user.interface";
import TokenData from "./token.data.interface";

interface RequestWithUser extends Request {
    user?: User;
    token?: string;
}

export default RequestWithUser;
