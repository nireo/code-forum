import React, { useEffect } from "react";
import { connect } from "react-redux";
import "./App.css";
import Main from "./components/Main";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import LoginPage from "./components/Login/LoginPage";
import CreateAccount from "./components/Login/CreateAccount";
import CreatePost from "./components/Posts/private/CreatePost";
import PostMainPage from "./components/Posts/public/PostMainPage";
import { checkLocalStorage } from "./reducers/userReducer";
import UserMainPage from "./components/Users/public/UserMainPage";
import SinglePostView from "./components/Posts/public/SinglePostView";
import NavBar from "./components/layout/NavBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import CategoryPage from "./components/Posts/public/CategoryPage";
import SingleUserPage from "./components/Users/public/SingleUserPage";

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
      <CssBaseline />
      <NavBar />
      <Switch>
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
          path="/post/:id"
          render={({ match }) => <SinglePostView id={match.params.id} />}
        />
        <Route
          exact
          path="/programming/:category"
          render={({ match }) => (
            <CategoryPage category={match.params.category} />
          )}
        />
        <Route
          exact
          path="/misc/:category"
          render={({ match }) => (
            <CategoryPage category={match.params.category} />
          )}
        />
        <Route
          exact
          path="/users/:id"
          render={({ match }) => <SingleUserPage id={match.params.id} />}
        />
      </Switch>
    </Router>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  { checkLocalStorage }
)(App);
