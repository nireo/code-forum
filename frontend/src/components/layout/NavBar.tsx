import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import { Link } from "react-router-dom";
import Code from "@material-ui/icons/Code";

const useStyles = makeStyles(theme => ({
  appBar: {
    borderBottom: `1px sp;od ${theme.palette.divider}`
  },
  toolbarTitle: {
    flexGrow: 1
  },
  toolbar: {
    flexWrap: "wrap"
  },
  link: {
    margin: theme.spacing(1, 1.5)
  }
}));

const NavBar: React.FC = () => {
  const classes = useStyles();

  const linkStyle = {
    color: "black",
    textDecoration: "none"
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      className={classes.appBar}
    >
      <ToolBar className={classes.toolbar}>
        <Typography
          variant="h6"
          color="inherit"
          noWrap
          className={classes.toolbarTitle}
        >
          code forum <Code />
        </Typography>
        <nav>
          <Link style={linkStyle} to="/posts" className={classes.link}>
            posts
          </Link>
          <Link style={linkStyle} to="/login" className={classes.link}>
            login
          </Link>
          <Link style={linkStyle} to="/create-post" className={classes.link}>
            create post
          </Link>
          <Link style={linkStyle} to="/users" className={classes.link}>
            users
          </Link>
        </nav>
      </ToolBar>
    </AppBar>
  );
};

export default NavBar;
