interface Post {
  title: string;
  content: string;
  likes: number;
  dislikes: number;
  byUser: string;
  comments: Comment[];
}

export default Post;
