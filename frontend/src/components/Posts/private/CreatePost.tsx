import React, { useState, FormEvent } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Copyright from "../../Copyright";
import { connect } from "react-redux";
import { CreatePost } from "../../../reducers/postReducer";
import { CreatePostInterface } from "../../../interfaces/post.interface";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { MenuItem } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  },
  stepper: {
    padding: theme.spacing(3, 0, 5)
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: "100%"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150
  }
}));

type Props = {
  CreatePost?: any;
};

const CreatePostForm: React.FC<Props> = ({ CreatePost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState({
    category: ""
  });
  const classes = useStyles();

  const handlePostCreation = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (title && content) {
      const newPost: CreatePostInterface = {
        title,
        content
      };
      await CreatePost(newPost);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    setCategories(old => ({
      ...old,
      [event.target.name as string]: event.target.value
    }));
  };

  return (
    <div>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Create post
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={handlePostCreation}
          >
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Content"
              autoFocus
              autoComplete="content"
              value={content}
              onChange={({ target }) => setContent(target.value)}
            />
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="category-select">Category</InputLabel>
              <Select
                value={categories.category}
                onChange={handleChange}
                inputProps={{
                  name: "category",
                  id: "category-select"
                }}
              >
                <MenuItem value={"python"}>Python</MenuItem>
                <MenuItem value={"js"}>Javascript</MenuItem>
                <MenuItem value={"competetive"}>Competetive</MenuItem>
                <MenuItem value={"books"}>Books</MenuItem>
                <MenuItem value={"random"}>Random</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Create post
            </Button>
          </form>
        </Paper>
        <Copyright />
      </main>
    </div>
  );
};

export default connect(
  null,
  { CreatePost }
)(CreatePostForm);
