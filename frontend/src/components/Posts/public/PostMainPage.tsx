import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import CssBaseLine from "@material-ui/core/CssBaseline";
import NavBar from "../../layout/NavBar";
import Loading from "../../Loading";
import Container from "@material-ui/core/Container";
import { initPosts } from "../../../reducers/postReducer";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  post: {
    position: "relative",
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4),
    backgroundImage:
      "url(https://source.unsplash.com/1600x900/?code,coding,programming)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center"
  },
  postContent: {
    position: "relative",
    padding: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(6),
      paddingRight: 0
    }
  }
}));

type Props = {
  posts?: Array<object>;
  initPosts: any;
};

const PostMainPage: React.FC<Props> = ({ posts, initPosts }) => {
  // since we don't want to only show a loading bar
  const [requested, setRequested] = useState(false);
  const classes = useStyles();
  useEffect(() => {
    if (posts) {
      if (!requested && posts.length === 0) {
        initPosts();
        setRequested(true);
      }
    }
  }, [posts, initPosts, requested]);
  return (
    <div>
      <CssBaseLine />
      <NavBar />
      <Container maxWidth="sm">
        {posts && posts.length !== 0 ? (
          <p>Posts loaded</p>
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
    posts: state.posts
  };
};

export default connect(
  mapStateToProps,
  { initPosts }
)(PostMainPage);
