import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { initAllUsers } from "../../../reducers/usersReducer";
import { User } from "../../../interfaces/user.interface";
import Loading from "../../Loading";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { PostInterface } from "../../../interfaces/post.interface";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import userService from "../../../services/users";

type Props = {
  id: string;
  users: User[];
  posts: PostInterface[];
  initAllUsers: () => Promise<void>;
};

const SingleUserPage: React.FC<Props> = ({
  users,
  initAllUsers,
  id,
  posts
}) => {
  const [user, setUser] = useState<any>(undefined);
  const [userPosts, setUserPosts] = useState<PostInterface[] | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<Boolean>(false);
  useEffect(() => {
    // if (users === []) {
    //   initAllUsers();
    // } else {
    //   setUser(users.find(u => u._id === id));
    // }
    // if (posts && user) {
    //   setUserPosts(posts.filter(p => p.byUser._id === user._id));
    // } else {
    //   initPosts();
    // }
    if (user === undefined) {
      setLoading(true);
      const userData = userService.getUserById(id);
      setUser(userData);
      setLoading(false);
    }
  }, [users]);

  if (loading) {
    return <Loading />;
  }

  if (users === [] || user === undefined) {
    return <Loading />;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h3">@{user.username}</Typography>
      {userPosts && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>title</TableCell>
              <TableCell>username</TableCell>
              <TableCell>id</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userPosts.map(row => (
              <TableRow key={row._id}>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.content.slice(0, 25)}</TableCell>
                <TableCell>{row._id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  users: state.users,
  posts: state.posts
});

export default connect(
  mapStateToProps,
  { initAllUsers }
)(SingleUserPage);
