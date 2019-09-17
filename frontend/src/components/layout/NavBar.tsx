import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import Code from '@material-ui/icons/Code';

const useStyles = makeStyles(theme => ({
  appBar: {
    borderBottom: `1px sp;od ${theme.palette.divider}`
  },
  toolbarTitle: {
    flexGrow: 1
  },
  toolbar: {
    flexWrap: 'wrap'
  },
  link: {
    margin: theme.spacing(1, 1.5)
  }
}));

const NavBar: React.FC = () => {
  const classes = useStyles();
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
          <Link
            variant="button"
            color="textPrimary"
            href="/posts"
            className={classes.link}
          >
            Posts
          </Link>
          <Link
            variant="button"
            color="textPrimary"
            href="/login"
            className={classes.link}
          >
            Login
          </Link>
        </nav>
      </ToolBar>
    </AppBar>
  );
};

export default NavBar;
