import React, { SyntheticEvent, useState, useEffect } from "react";
import { connect } from "react-redux";
import clsx from "clsx";
import WarningIcon from "@material-ui/icons/Warning";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import { amber, green } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";

const iconVariants = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const useStyles = makeStyles((theme: Theme) => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    background: theme.palette.primary.main
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
}));

type Props = {
  notification: Notification | null;
};

type ContentProps = {
  content?: string;
  type: keyof typeof iconVariants;
  className?: string;
  onClose: () => void;
};

const contentWrapper: React.FC<ContentProps> = (props: ContentProps) => {
  const classes = useStyles();
  const { className, content, onClose, type, ...other } = props;
  const Icon = iconVariants[type];

  return (
    <SnackbarContent
      className={clsx(classes[type], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {content}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
};

const Notification: React.FC<Props> = ({ notification }) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!(notification === null)) {
      setOpen(true);
    }
    if (notification === null) {
      setOpen(false);
    }
  }, [notification, open, setOpen]);

  const handleClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      ></Snackbar>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    notification: state.notification
  };
};

export default connect(
  mapStateToProps,
  null
)(Notification);
