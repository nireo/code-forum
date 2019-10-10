import React, { useState, FormEvent } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Copyright from "../../Copyright";
import { connect } from "react-redux";
import { CreatePost } from "../../../reducers/postReducer";
import { CreatePostInterface } from "../../../interfaces/post.interface";
import FormControl from "@material-ui/core/FormControl";
import Container from "@material-ui/core/Container";
import Markdown from "../../Markdown";
import ChooseTitle from "./CreatePostSteps/Title";
import Content from "./CreatePostSteps/Content";
import SelectCategory from "./CreatePostSteps/SelectCategory";

const useStyles = makeStyles((theme: Theme) => ({
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
    const newPost: CreatePostInterface = {
      title,
      content,
      category: categories.category
    };
    CreatePost(newPost);
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
      <Container maxWidth="lg">
        <Paper className={classes.paper}>
          <form
            className={classes.form}
            noValidate
            onSubmit={handlePostCreation}
          >
            <ChooseTitle setTitle={setTitle} title={title} />
            <Content content={content} setContent={setContent} />
            <FormControl className={classes.formControl}>
              <SelectCategory
                handleChange={handleChange}
                categories={categories}
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Create post
            </Button>
            <Typography variant="body2">
              Note: the content and comments work with markdown try it out!
            </Typography>
          </form>
          <Copyright />
        </Paper>
        <Typography variant="h5">Preview of content</Typography>
        <Markdown>{content}</Markdown>
      </Container>
    </div>
  );
};

export default connect(
  null,
  { CreatePost }
)(CreatePostForm);
