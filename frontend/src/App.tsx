import React, { useEffect } from "react";
import { connect } from "react-redux";
import "./App.css";
import Main from "./components/Main";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import LoginPage from "./components/Login/LoginPage";
import CreateAccount from "./components/Login/CreateAccount";
import CreatePost from "./components/Posts/private/CreatePost";
import PostMainPage from "./components/Posts/public/PostMainPage";
import { checkLocalStorage } from "./reducers/userReducer";
import UserMainPage from "./components/Users/public/UserMainPage";
import SinglePostView from "./components/Posts/public/SinglePostView";

type Props = {
  user?: object;
  checkLocalStorage: () => Promise<void>;
};

const App: React.FC<Props> = ({ user, checkLocalStorage }) => {
  useEffect(() => {
    if (!user) {
      checkLocalStorage();
    }
  }, [checkLocalStorage, user]);

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
      <Route exact path="/users" render={() => <UserMainPage />} />
      <Route exact path="/posts" render={() => <PostMainPage />} />
      <Route
        exact
        path="/posts/:id"
        render={({ match }) => <SinglePostView id={match.params.id} />}
      />
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
  { checkLocalStorage }
)(App);
