import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { getSinglePost } from "../../../reducers/postReducer";
import { PostInterface } from "../../../interfaces/post.interface";
import Loading from "../../Loading";
import { makeStyles } from "@material-ui/core/styles";
import Markdown from "../../Markdown";

const useStyles = makeStyles(theme => ({
  markdown: {
    ...theme.typography.body2,
    padding: theme.spacing(3, 0)
  }
}));

type Props = {
  id: string;
  posts: PostInterface[];
  getSinglePost: (id: string) => void;
};

const findPost = (
  posts: PostInterface[],
  id: string
): undefined | PostInterface => {
  const post = posts.find(p => p._id === id);
  if (post) {
    return post;
  }
  return undefined;
};

const SinglePostView: React.FC<Props> = ({ posts, id, getSinglePost }) => {
  const [post, setPost] = useState<PostInterface | undefined>(undefined);
  useEffect(() => {
    if (post === undefined) {
      const checkPost = posts.find(p => p._id === id);
      if (checkPost === undefined) {
        getSinglePost(id);
      } else {
        setPost(checkPost);
      }
    }
  }, [id, getSinglePost, setPost, post]);
  return (
    <div>
      <Container maxWidth="md">
        {post === undefined ? (
          <Loading />
        ) : (
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {post.title}
            </Typography>
            <Markdown>{post.content}</Markdown>
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
