import mongoose from "mongoose";
import User from "./user.interface";

const userSchema: mongoose.Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  posts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  },
  comments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }
});

userSchema.set("toJSON", {
  transform: (document, object) => {
    delete object.__v;

    // since it's bad to send the password even though it's hashed
    delete object.password;
  }
});

const user = mongoose.model<User & mongoose.Document>("User", userSchema);

export default user;
