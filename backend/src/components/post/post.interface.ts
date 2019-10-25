import Document from "mongoose";

interface Post {
    title: string;
    content: string;
    likes: number;
    dislikes: number;
    byUser: string;
    comments: Comment[];
    category: string;
}

export default Post;
