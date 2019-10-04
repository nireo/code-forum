import React from "react";
import TextField from "@material-ui/core/TextField";

type Props = {
  title: string;
  setTitle: any;
};

const ChooseTitle: React.FC<Props> = ({ setTitle, title }) => {
  return (
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      label="Title"
      autoFocus
      autoComplete="title"
      value={title}
      onChange={({ target }) => setTitle(target.value)}
    />
  );
};

export default ChooseTitle;
