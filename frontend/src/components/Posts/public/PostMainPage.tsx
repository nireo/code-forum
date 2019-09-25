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
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  post: {
    position: "relative",
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4),
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center"
  },
  postContent: {
    position: "relative",
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(1),
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
  },
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

  return (
    <div>
      <CssBaseLine />
      <Container maxWidth="md" style={{ paddingTop: "1rem" }}>
        {posts && posts.length !== 0 ? (
          posts.map(p => (
            <Grid container className={classes.mainGrid}>
              <Grid item key={p._id} xs={12} md={8}>
                <CardActionArea>
                  <Card className={classes.card}>
                    <div className={classes.cardDetails}>
                      <CardContent>
                        <Typography
                          component="h6"
                          variant="h6"
                          color="inherit"
                          gutterBottom
                        >
                          {p.title}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                          by @{p.byUser.username} in category
                        </Typography>
                      </CardContent>
                    </div>
                  </Card>
                </CardActionArea>
              </Grid>
              <Grid item xs={12} md={4} style={{ paddingLeft: "1rem" }}>
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
                  style={{ paddingTop: "2rem", marginBottom: "0" }}
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
