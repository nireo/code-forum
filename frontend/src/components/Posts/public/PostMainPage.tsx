import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import CssBaseLine from "@material-ui/core/CssBaseline";
import Loading from "../../Loading";
import Container from "@material-ui/core/Container";
import { initPosts } from "../../../reducers/postReducer";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { PostInterface } from "../../../interfaces/post.interface";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Post from "../Post";
import Pagination from "../../Pagination";
import { initPostAmount } from "../../../reducers/itemReducer";

const useStyles = makeStyles(theme => ({
    sidebarBox: {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.grey[200]
    },
    mainGrid: {
        marginTop: theme.spacing(3)
    }
}));

type Props = {
    posts: PostInterface[];
    amounts: any;
    initPosts: (page: string) => Promise<void>;
    initPostAmount: () => Promise<void>;
};

const PostMainPage: React.FC<Props> = ({
    posts,
    initPosts,
    amounts,
    initPostAmount
}) => {
    // since we don't want to only show a loading bar
    const [requested, setRequested] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [amountInPage] = useState<number>(3);
    const [loaded, setLoaded] = useState<boolean>(false);

    // to see which pages have content, so we can get the posts smartly
    // const [pagesWithContent, setPagesWithContent] = useState<number[]>([]);
    const classes = useStyles();
    useEffect(() => {
        if (posts) {
            if (!requested && posts.length === 0) {
                initPosts(String(currentPage));
                setRequested(true);
            }
        }

        // check if the post amounts have been loaded
        if (amounts[0] === 0 && loaded === false) {
            try {
                initPostAmount();

                // might not be needed but just incase
                setLoaded(true);
            } catch (e) {
                console.log(e);
            }
        }
    }, [posts, initPosts, requested, currentPage]);

    const programmingSubjects = [
        {
            link: "/python",
            name: "Python"
        },
        {
            link: "/js",
            name: "Javascript"
        },
        {
            link: "/competetive",
            name: "Competetive Programming"
        }
    ];

    const miscSubjects = [
        {
            link: "/books",
            name: "Books"
        },
        {
            link: "/random",
            name: "Random"
        }
    ];

    const lastPostIndex: number = currentPage * amountInPage;
    const firstPostIndex: number = lastPostIndex - amountInPage;
    const currentPosts: PostInterface[] = posts.slice(
        firstPostIndex,
        lastPostIndex
    );
    const paginate = (pageNum: number): void => {
        setCurrentPage(pageNum);
    };

    if (amounts[0] === 0 && loaded === false) {
        return <Loading />;
    }
    console.log(amounts[0]);

    return (
        <div>
            <CssBaseLine />
            <Container maxWidth="md" style={{ paddingTop: "1rem" }}>
                {posts && posts.length !== 0 ? (
                    <Grid container className={classes.mainGrid}>
                        <Grid item xs={12} md={8}>
                            {currentPosts.map(p => (
                                <Post key={p._id} post={p} />
                            ))}
                            <div style={{ paddingTop: "0.5rem" }}>
                                <Pagination
                                    amountInPage={amountInPage}
                                    totalPosts={posts.length}
                                    paginate={paginate}
                                    currentPage={currentPage}
                                />
                            </div>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={4}
                            style={{ paddingLeft: "1rem" }}
                        >
                            <Typography
                                variant="h6"
                                gutterBottom
                                style={{ marginBottom: "0" }}
                            >
                                Programming
                            </Typography>
                            {programmingSubjects.map(s => (
                                <Link
                                    style={{
                                        display: "block",
                                        color: "#23374d",
                                        textDecoration: "none"
                                    }}
                                    key={s.name}
                                    to={`/programming${s.link}`}
                                >
                                    {s.name}
                                </Link>
                            ))}
                            <Typography
                                variant="h6"
                                gutterBottom
                                style={{
                                    paddingTop: "2rem",
                                    marginBottom: "0"
                                }}
                            >
                                Misc
                            </Typography>
                            {miscSubjects.map(s => (
                                <Link
                                    style={{
                                        display: "block",
                                        color: "#23374d",
                                        textDecoration: "none"
                                    }}
                                    key={s.name}
                                    to={`/misc${s.link}`}
                                >
                                    {s.name}
                                </Link>
                            ))}
                        </Grid>
                    </Grid>
                ) : (
                    <div style={{ alignItems: "center" }}>
                        <Loading />
                    </div>
                )}
            </Container>
        </div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        posts: state.posts,
        amounts: state.amounts
    };
};

export default connect(
    mapStateToProps,
    { initPosts, initPostAmount }
)(PostMainPage);
