import React from "react";
import TextField from "@material-ui/core/TextField";

type Props = {
  content: string;
  setContent: any;
};

const Content: React.FC<Props> = ({ content, setContent }) => {
  return (
    <TextField
      label="Content"
      multiline
      rows="8"
      margin="normal"
      variant="filled"
      id="outlined-multiline-flexible"
      style={{ width: "100%" }}
      onChange={({ target }) => setContent(target.value)}
      value={content}
    />
  );
};

export default Content;
