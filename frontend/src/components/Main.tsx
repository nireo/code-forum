import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Footer from "./Footer";
import Chat from "./Chat";
import "./styles.css";

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

const Main: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
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
      <Container maxWidth="sm">
        <Chat />
      </Container>
      <Footer />
    </div>
  );
};

export default Main;
