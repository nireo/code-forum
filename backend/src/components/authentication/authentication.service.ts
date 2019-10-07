import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../user/user.model";
import CreateUserDto from "../user/user.dto";
import { HttpException } from "../../exceptions/HttpException";
import User from "../user/user.interface";
import TokenData from "../../interfaces/token.data.interface";
import DataStoredInToken from "../../interfaces/data.in.token.interface";

class AuthenticationService {
  public user = userModel;

  public async register(userData: CreateUserDto) {
    if (await this.user.findOne({ username: userData.username })) {
      throw new HttpException(401, "Bad request");
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.user.create({
      ...userData,
      password: hashedPassword
    });

    // more efficient way of using delete
    user.password = undefined;
    const token = this.createToken(user);
    return {
      token,
      user
    };
  }
  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id
    };
    // 60 * 60 * 24 === 1 day
    const expiresIn = 60 * 60 * 24;
    const secret: string = "EnvSecret";
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    };
  }
}
