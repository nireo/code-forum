import mongoose from "mongoose";
import Post from "./post.interface";

const postScheme: mongoose.Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  byUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  category: {
    type: String,
    required: true
  }
});

postScheme.set("toJSON", {
  transform: (document, object) => {
    delete object.__v;
  }
});

const post = mongoose.model<Post & mongoose.Document>("Post", postScheme);

export default post;
