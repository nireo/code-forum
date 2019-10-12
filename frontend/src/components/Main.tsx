import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Footer from "./Footer";
import Chat from "./Chat";
import Card from "@material-ui/core/Card";
import { connect } from "react-redux";
import "./styles.css";
import { PostInterface } from "../interfaces/post.interface";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import { initPosts } from "../reducers/postReducer";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2)
  }
}));

type Props = {
  posts: PostInterface[];
  initPosts: (page: string) => Promise<void>;
};

const Main: React.FC<Props> = ({ posts, initPosts }) => {
  const classes = useStyles();

  useEffect(() => {
    if (!posts) {
      initPosts("1");
    }
  }, [posts, initPosts]);

  return (
    <div className={classes.root}>
      <Container component="main" className={classes.main} maxWidth="lg">
        <Typography
          variant="h2"
          component="h1"
          align="center"
          color="textPrimary"
          gutterBottom
          className="main-page-heading"
        >
          Welcome to code forum
        </Typography>
        <Typography
          variant="h5"
          component="h1"
          align="center"
          color="textSecondary"
          paragraph
          className="main-page-sub-heading"
        >
          Code forum is a forum for discussing programming and learning new
          languages.
        </Typography>
      </Container>
      <Container maxWidth="md">
        <Chat />
      </Container>
      <Container maxWidth="md" style={{ marginTop: "2rem" }}>
        <Typography variant="h5" align="center" color="textSecondary">
          Recent
          {posts ? (
            posts.map(p => (
              <Card>
                <Typography variant="h6" component="h2">
                  {p.title}
                </Typography>
                <Link to={`/post/${p._id}`}>Read more</Link>
              </Card>
            ))
          ) : (
            <Loading />
          )}
        </Typography>
      </Container>
      <Footer />
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  posts: state.posts
});

export default connect(
  mapStateToProps,
  { initPosts }
)(Main);
