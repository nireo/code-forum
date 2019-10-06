import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { User } from "../../../../interfaces/user.interface";
import { OwnPostInterface } from "../../../../interfaces/ownpost.interface";
import { getUsersPosts, setData } from "../../../../reducers/ownPosts";
import postService from "../../../../services/posts";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import { removePost } from "../../../../reducers/postReducer";
import Loading from "../../../Loading";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

type Props = {
  user: User;
  ownPosts: OwnPostInterface[];
  getUsersPosts: (id: string) => Promise<void>;
  removePost: (id: string) => Promise<void>;
  setData: (data: any) => void;
};

const MainPostManager: React.FC<Props> = ({
  user,
  ownPosts,
  getUsersPosts,
  setData,
  removePost
}) => {
  const [search, setSearch] = useState<string>("");
  useEffect(() => {
    if (user) {
      if (ownPosts === []) {
        postService
          .getPostsFromUser(user._id)
          .then(data => {
            setData(data);
          })
          .catch(e => {
            console.log(e);
          });
      }
    }
  }, [ownPosts, user]);

  const handleRemove = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete ${id}`)) {
      await removePost(id);
    }
  };

  if (ownPosts === []) {
    return <Loading />;
  }

  const filteredSearch = search
    ? ownPosts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    : ownPosts;

  return (
    <Container maxWidth="md">
      <TextField
        style={{ width: "100%", paddingTop: "0", marginTop: "0" }}
        id="outlined-dense"
        label="Search"
        type="text"
        name="Search"
        autoComplete="Search"
        variant="outlined"
        margin="dense"
        value={search}
        onChange={({ target }) => setSearch(target.value)}
      />
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>title</TableCell>
            <TableCell>content</TableCell>
            <TableCell>actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredSearch.map(p => (
            <TableRow key={p._id}>
              <TableCell>{p.title}</TableCell>
              <TableCell>{p.content.slice(0, 20)}</TableCell>
              <TableCell onClick={() => handleRemove(p._id)}>Delete</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  ownPosts: state.ownPosts
});

export default connect(
  mapStateToProps,
  { getUsersPosts, removePost, setData }
)(MainPostManager);
