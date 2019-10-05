import React, { useEffect } from "react";
import { connect } from "react-redux";
import { User } from "../../../../interfaces/user.interface";
import { OwnPostInterface } from "../../../../interfaces/ownpost.interface";
import { getUsersPosts } from "../../../../reducers/ownPosts";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

type Props = {
  user: User;
  ownPosts: OwnPostInterface[];
  getUsersPosts: (id: string) => Promise<void>;
};

const MainPostManager: React.FC<Props> = ({
  user,
  ownPosts,
  getUsersPosts
}) => {
  useEffect(() => {
    if (user) {
      if (ownPosts === []) {
        getUsersPosts(user._id);
      }
    }
  }, [ownPosts, user]);
  return (
    <Container maxWidth="md">
      <Typography variant="h4">Delete</Typography>
      {ownPosts.length > 0 && ownPosts.map(m => <li>{m.title}</li>)}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  ownPosts: state.ownPosts
});

export default connect(
  mapStateToProps,
  { getUsersPosts }
)(MainPostManager);
