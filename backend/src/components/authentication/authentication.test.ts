import { AuthenticationController } from "./authentication.controller";
import TokenData from "../../interfaces/token.data.interface";

describe("Auth controller tests", () => {
    const service = new AuthenticationController();
    describe("when creating a cookie", () => {
        const tokenData: TokenData = {
            token: "",
            expiresIn: 1
        };
    });
});
