import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import { Link } from "react-router-dom";
import Code from "@material-ui/icons/Code";
import { connect } from "react-redux";
import { User } from "../../interfaces/user.interface";

const useStyles = makeStyles(theme => ({
    appBar: {
        borderBottom: `1px sp;od ${theme.palette.divider}`
    },
    toolbarTitle: {
        flexGrow: 1
    },
    toolbar: {
        flexWrap: "wrap"
    },
    link: {
        margin: theme.spacing(1, 1.5)
    }
}));

type Props = {
    user?: User;
};

const NavBar: React.FC<Props> = ({ user }) => {
    const classes = useStyles();

    const linkStyle = {
        color: "black",
        textDecoration: "none"
    };

    return (
        <AppBar
            position="static"
            color="default"
            elevation={0}
            className={classes.appBar}
        >
            <ToolBar className={classes.toolbar}>
                <Typography
                    variant="h6"
                    color="inherit"
                    noWrap
                    className={classes.toolbarTitle}
                >
                    <Link
                        to="/"
                        style={{ color: "black", textDecoration: "none" }}
                    >
                        code forum <Code />
                    </Link>
                </Typography>
                <nav>
                    <Link style={linkStyle} to="/chat" className={classes.link}>
                        chat
                    </Link>
                    <Link
                        style={linkStyle}
                        to="/posts"
                        className={classes.link}
                    >
                        posts
                    </Link>
                    {user && (
                        <Link
                            style={linkStyle}
                            to="/dashboard"
                            className={classes.link}
                        >
                            dashboard
                        </Link>
                    )}
                    {!user && (
                        <Link
                            style={linkStyle}
                            to="/login"
                            className={classes.link}
                        >
                            login
                        </Link>
                    )}

                    <Link
                        style={linkStyle}
                        to="/create-post"
                        className={classes.link}
                    >
                        create post
                    </Link>
                    <Link
                        style={linkStyle}
                        to="/users"
                        className={classes.link}
                    >
                        users
                    </Link>
                    <Link
                        style={linkStyle}
                        to="/settings"
                        className={classes.link}
                    >
                        settings
                    </Link>
                </nav>
            </ToolBar>
        </AppBar>
    );
};

const mapStateToProps = (state: any) => {
    return {
        user: state.user
    };
};

export default connect(
    mapStateToProps,
    null
)(NavBar);
