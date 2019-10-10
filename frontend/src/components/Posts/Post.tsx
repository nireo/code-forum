import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { PostInterface } from "../../interfaces/post.interface";
import CardContent from "@material-ui/core/CardContent";
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
      padding: theme.spacing(0),
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
  post: PostInterface;
};

const Post: React.FC<Props> = ({ post }) => {
  const classes = useStyles();
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <Link style={{ textDecoration: "none" }} to={`/post/${post._id}`}>
        <Card className={classes.card}>
          <div className={classes.cardDetails}>
            <CardContent>
              <Typography
                component="h6"
                variant="h6"
                color="inherit"
                gutterBottom
              >
                {post.title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                by @{post.byUser.username} in category {post.category}
              </Typography>
            </CardContent>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default Post;
