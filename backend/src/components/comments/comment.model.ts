import mongoose from "mongoose";
import Comment from "./comment.interface";

const commentSchema: mongoose.Schema = new mongoose.Schema({
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
    toPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
});

commentSchema.set("toJSON", {
    transform: (document, object) => {
        delete object.__v;
    }
});

const comment = mongoose.model<Comment & mongoose.Document>(
    "Comment",
    commentSchema
);

export default comment;
