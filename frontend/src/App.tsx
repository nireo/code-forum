import React from "react";
import { connect } from "react-redux";
import "./App.css";
import Main from "./components/Main";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import LoginPage from "./components/Login/LoginPage";
import CreateAccount from "./components/Login/CreateAccount";
import CreatePost from "./components/Posts/private/CreatePost";
import PostMainPage from "./components/Posts/public/PostMainPage";

type Props = {
  user?: object;
};

const App: React.FC<Props> = ({ user }) => {
  return (
    <Router>
      <Route exact path="/" render={() => <Main />} />
      <Route
        exact
        path="/login"
        render={() => (!user ? <LoginPage /> : <Redirect to="/" />)}
      />
      <Route
        exact
        path="/signup"
        render={() => (!user ? <CreateAccount /> : <Redirect to="/" />)}
      />
      <Route
        exact
        path="/create-post"
        render={() => (user ? <CreatePost /> : <Redirect to="/login" />)}
      />
      <Route exact path="/posts" render={() => <PostMainPage />} />
    </Router>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  null
)(App);
