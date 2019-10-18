import { User } from "./user.interface";

export interface Report {
  content: string;
  from: User;
  to: User;
}
