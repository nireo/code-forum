import React from "react";
import { connect } from "react-redux";
import CssBaseLine from "@material-ui/core/CssBaseline";
import NavBar from "../../layout/NavBar";
import Loading from "../../Loading";
import Container from "@material-ui/core/Container";

type Props = {
  posts?: Array<object>;
};

const PostMainPage: React.FC<Props> = ({ posts }) => {
  return (
    <div>
      <CssBaseLine />
      <NavBar />
      <Container maxWidth="sm">
        {posts ? (
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
  null
)(PostMainPage);
