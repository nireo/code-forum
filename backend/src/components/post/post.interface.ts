interface Post {
  title: string;
  content: string;
  likes: number;
  dislikes: number;
  byUser: string;
  comments: string[];
  category: string;
}

export default Post;
