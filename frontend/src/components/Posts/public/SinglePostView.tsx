import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { getSinglePost } from "../../../reducers/postReducer";
import { PostInterface } from "../../../interfaces/post.interface";
import Loading from "../../Loading";

type Props = {
  id: string;
  posts: PostInterface[];
  getSinglePost: (id: string) => void;
};

const findPost = (
  posts: PostInterface[],
  id: string
): Boolean | PostInterface => {
  const post = posts.find(p => p._id === id);
  if (post) {
    return post;
  }
  return false;
};

const SinglePostView: React.FC<Props> = ({ posts, id, getSinglePost }) => {
  const [post, setPost] = useState();
  const [notFound, setNotFound] = useState({});
  useEffect(() => {
    setPost(findPost(posts, id));
  }, [id, getSinglePost, setPost, post]);
  return (
    <div>
      <Container maxWidth="md">
        {!post ? (
          <Loading />
        ) : (
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {post.title}
            </Typography>
            <Typography variant="body2">{post.content}</Typography>
          </Grid>
        )}
      </Container>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    posts: state.posts
  };
};

export default connect(
  mapStateToProps,
  { getSinglePost }
)(SinglePostView);
