import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { User } from "../../../../interfaces/user.interface";
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
  removePost: (id: string) => Promise<void>;
};

const MainPostManager: React.FC<Props> = ({ user, removePost }) => {
  const [search, setSearch] = useState<string>("");
  useEffect(() => {
    if (user) {
    }
  }, [user]);

  const handleRemove = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete ${id}`)) {
      await removePost(id);
    }
  };

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
        <TableBody></TableBody>
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
  { removePost }
)(MainPostManager);
