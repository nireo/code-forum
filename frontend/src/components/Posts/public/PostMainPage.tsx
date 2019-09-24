import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import CssBaseLine from "@material-ui/core/CssBaseline";
import NavBar from "../../layout/NavBar";
import Loading from "../../Loading";
import Container from "@material-ui/core/Container";
import { initPosts } from "../../../reducers/postReducer";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { PostInterface } from "../../../interfaces/post.interface";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Hidden from "@material-ui/core/Hidden";

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
    padding: theme.spacing(1.5),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(6),
      paddingRight: 0
    }
  },
  card: {
    display: "flex"
  },
  cardMedia: {
    width: 160
  },
  cardDetails: {
    flex: 1
  }
}));

type Props = {
  posts: PostInterface[];
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
      <Container maxWidth="md" style={{ paddingTop: "3rem" }}>
        {posts && posts.length !== 0 ? (
          posts.map(p => (
            <Grid item key={p._id} xs={12} md={12}>
              <CardActionArea>
                <Card className={classes.card}>
                  <div className={classes.cardDetails}>
                    <CardContent>
                      <Typography
                        component="h1"
                        variant="h4"
                        color="inherit"
                        gutterBottom
                      >
                        {p.title}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        @{p.byUser.username}
                      </Typography>
                      <Typography variant="subtitle1" paragraph>
                        {p.content}
                      </Typography>
                    </CardContent>
                  </div>
                  <Hidden xsDown>
                    <CardMedia
                      className={classes.cardMedia}
                      image="https://source.unsplash.com/1600x900/?code,coding,programming"
                      title="code image"
                    />
                  </Hidden>
                </Card>
              </CardActionArea>
            </Grid>
          ))
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
