import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Markdown from "./Markdown";

const getModalStyles = () => {
  return {
    top: "20%",
    left: "20%",
    transform: "translate(-20%, -20%)"
  };
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 500,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    }
  })
);

type Props = {
  content: string;
};

const PreviewModal: React.FC<Props> = ({ content }) => {
  const classes = useStyles();
  const [modalStyle] = React.useState<object>(getModalStyles);
  const [open, setOpen] = React.useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <p>Click to see a preview of the content.</p>
      <button type="button" onClick={handleOpen}>
        Open Preview
      </button>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">Preview of content</h2>
          <p id="simple-modal-description">
            <Markdown>{content}</Markdown>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default PreviewModal;
