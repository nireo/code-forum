import React, { useEffect, useState } from "react";
import { PostInterface } from "../../../interfaces/post.interface";
import { connect } from "react-redux";
import { getPostsByCategory } from "../../../reducers/postReducer";
import Container from "@material-ui/core/Container";
import Loading from "../../Loading";
import Post from "../Post";

type Props = {
  category: string;
  posts: PostInterface[];
};

const CategoryPage: React.FC<Props> = ({ category, posts }) => {
  const [filteredPosts, setFilteredPosts] = useState<
    PostInterface[] | undefined
  >(undefined);
  useEffect(() => {
    if (filteredPosts === undefined) {
      getPostsByCategory(category);
      setFilteredPosts(posts.filter(p => p.category === category));
    }
  }, [category, posts, filteredPosts, setFilteredPosts]);
  return (
    <Container maxWidth="md" style={{ paddingTop: "1rem" }}>
      {filteredPosts === undefined ? (
        <Loading />
      ) : (
        filteredPosts.map(p => <Post key={p._id} post={p} />)
      )}
    </Container>
  );
};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    posts: state.posts,
    category: ownProps.category
  };
};

export default connect(
  mapStateToProps,
  null
)(CategoryPage);
