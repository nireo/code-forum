import { HttpException } from "./HttpException";

class NotAuthorizedException extends HttpException {
  constructor() {
    super(403, "You're unauthorized.");
  }
}

export default NotAuthorizedException;
