import React, { useEffect, useState, FormEvent } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import {
  getSinglePost,
  getCommentsInPost,
  addNewComment
} from "../../../reducers/postReducer";
import { PostInterface } from "../../../interfaces/post.interface";
import Loading from "../../Loading";
import { makeStyles } from "@material-ui/core/styles";
import Markdown from "../../Markdown";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { CreateComment } from "../../../interfaces/comment.interface";

const useStyles = makeStyles(theme => ({
  markdown: {
    ...theme.typography.body2,
    padding: theme.spacing(3, 0)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: "100%"
  }
}));

type Props = {
  id: string;
  posts: PostInterface[];
  getSinglePost: (id: string) => void;
  getCommentsInPost: (id: string) => void;
  addNewComment: (id: string, newComment: CreateComment) => Promise<void>;
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

const SinglePostView: React.FC<Props> = ({
  posts,
  id,
  getSinglePost,
  getCommentsInPost,
  addNewComment
}) => {
  const [post, setPost] = useState<PostInterface | undefined>(undefined);
  const [comment, setComment] = useState<string>("");
  const [commentsLoaded, setCommentsLoaded] = useState<Boolean>(false);
  const classes = useStyles();
  useEffect(() => {
    if (post === undefined) {
      if (!posts.find(p => p._id === id)) {
        getSinglePost(id);
      } else {
        setPost(posts.find(p => p._id === id));
      }
      const checkPostType = (
        post: PostInterface | undefined
      ): post is PostInterface => {
        if (post as PostInterface) {
          return true;
        }
        return false;
      };
      // just checking the type so that we don't get comments for undefined
      if (checkPostType(post)) {
        if (commentsLoaded === false) {
          getCommentsInPost(id);
          setCommentsLoaded(true);
        }
      }
    }
  }, [id, getSinglePost, setPost, post]);

  const createComment = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    if (comment) {
      const commentObject: CreateComment = {
        content: comment
      };
      await addNewComment(id, commentObject);
    }
  };

  return (
    <div>
      {post === undefined ? (
        <Loading />
      ) : (
        <div>
          <Container maxWidth="md">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                {post.title}
              </Typography>
              <Markdown>{post.content}</Markdown>
            </Grid>
          </Container>

          <Container maxWidth="md">
            <form onSubmit={createComment}>
              <TextField
                label="Comment"
                multiline
                rows="8"
                margin="normal"
                variant="filled"
                id="outlined-multiline-flexible"
                style={{
                  width: "100%"
                }}
                value={comment}
                onChange={({ target }) => setComment(target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Submit comment
              </Button>
              <Typography variant="body2">
                Note: the content and comments work with markdown try it out!
              </Typography>
            </form>
            <Typography variant="h5">Preview of comment</Typography>
            <Markdown>{comment}</Markdown>
          </Container>
        </div>
      )}
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
  { getSinglePost, getCommentsInPost, addNewComment }
)(SinglePostView);
