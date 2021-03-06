import React, { useEffect, useState, FormEvent } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import {
    getSinglePost,
    addNewComment,
    updatePost
} from "../../../reducers/postReducer";
import { PostInterface } from "../../../interfaces/post.interface";
import Loading from "../../Loading";
import { makeStyles } from "@material-ui/core/styles";
import Markdown from "../../Markdown";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { CreateComment } from "../../../interfaces/comment.interface";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Pagination from "../../Pagination";

const useStyles = makeStyles(theme => ({
    markdown: {
        ...theme.typography.body2,
        padding: theme.spacing(3, 0)
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        width: "100%"
    },
    markdownClass: {
        ...theme.typography.body2,
        padding: theme.spacing(3, 0)
    },
    paper: {
        padding: theme.spacing(3, 2)
    }
}));

type Props = {
    id: string;
    posts: PostInterface[];
    getSinglePost: (id: string) => void;
    addNewComment: (id: string, newComment: CreateComment) => Promise<void>;
    updatePost: (post: PostInterface, id: string) => Promise<void>;
};

// const findPost = (
//   posts: PostInterface[],
//   id: string
// ): undefined | PostInterface => {
//   const post = posts.find(p => p._id === id);
//   if (post) {
//     return post;
//   }
//   return undefined;
// };

const SinglePostView: React.FC<Props> = ({
    posts,
    id,
    getSinglePost,
    addNewComment,
    updatePost
}) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [amountInPage] = useState<number>(3);
    const [post, setPost] = useState<PostInterface | undefined>(undefined);
    const [comment, setComment] = useState<string>("");
    const classes = useStyles();
    useEffect(() => {
        if (posts === []) {
            getSinglePost(id);
        }
        if (post === undefined) {
            if (!posts.find(p => p._id === id)) {
                getSinglePost(id);
            } else {
                setPost(posts.find(p => p._id === id));
            }
        }
    }, [id, getSinglePost, setPost, post, posts]);

    const createComment = async (
        event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();
        if (comment) {
            const commentObject: CreateComment = {
                content: comment
            };
            await addNewComment(id, commentObject);
        }
    };

    if (post === undefined) {
        return <Loading />;
    }

    const handleLike = async (
        event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();
        try {
            const newPost = { ...post, likes: post.likes + 1 };
            await updatePost(newPost, post._id);
        } catch (e) {
            console.log(e);
        }
    };

    const handleDislike = async (
        event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();
        try {
            const newPost = { ...post, dislikes: post.dislikes + 1 };
            await updatePost(newPost, post._id);
        } catch (e) {
            console.log(e);
        }
    };

    const lastCommentIndex: number = currentPage * amountInPage;
    const firstCommentIndex: number = lastCommentIndex - amountInPage;
    const currentComments = post.comments.slice(
        firstCommentIndex,
        lastCommentIndex
    );
    const paginate = (pageNum: number): void => {
        setCurrentPage(pageNum);
    };

    return (
        <div>
            {post === undefined ? (
                <Loading />
            ) : (
                <div>
                    <Container maxWidth="md">
                        <Grid
                            item
                            xs={12}
                            md={8}
                            style={{ paddingBottom: "2rem" }}
                        >
                            <Typography variant="h4" gutterBottom>
                                {post.title}
                            </Typography>
                            <Markdown className={classes.markdownClass}>
                                {post.content}
                            </Markdown>
                        </Grid>
                        <div>
                            <form onSubmit={handleLike}>
                                <Button
                                    variant="contained"
                                    style={{ marginLeft: "0.25rem" }}
                                    type="submit"
                                >
                                    Like
                                </Button>
                            </form>
                            <form onSubmit={handleDislike}>
                                <Button type="submit" variant="contained">
                                    Dislike
                                </Button>
                            </form>
                        </div>
                    </Container>
                    <Container maxWidth="md">
                        {currentComments.map(c => (
                            <Paper
                                className={classes.paper}
                                style={{ marginBottom: "1rem" }}
                            >
                                Posted by{" "}
                                <Link
                                    style={{ textDecoration: "none" }}
                                    to={`/users/${c.byUser._id}`}
                                >
                                    @{c.byUser.username}
                                </Link>
                                <Markdown className={classes.markdownClass}>
                                    {c.content}
                                </Markdown>
                            </Paper>
                        ))}
                        <Pagination
                            amountInPage={amountInPage}
                            totalPosts={post.comments.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
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
                                onChange={({ target }) =>
                                    setComment(target.value)
                                }
                            />
                            <Grid>
                                <Grid item xs={7}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                    >
                                        Submit comment
                                    </Button>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button
                                        variant="contained"
                                        className={classes.submit}
                                        color="primary"
                                    >
                                        Show preview
                                    </Button>
                                </Grid>
                            </Grid>

                            <Typography variant="body2">
                                Note: the content and comments work with
                                markdown try it out!
                            </Typography>
                        </form>
                        <Typography variant="h5">Preview of comment</Typography>
                        <Markdown className={classes.markdownClass}>
                            {comment}
                        </Markdown>
                    </Container>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state: any) => ({
    posts: state.posts
});

export default connect(
    mapStateToProps,
    { getSinglePost, addNewComment, updatePost }
)(SinglePostView);
