import React from "react";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

const NotFound: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Page not found.</Typography>
      <Link to="/" style={{ color: "black", textDecoration: "none" }}>
        Go back home
      </Link>
    </Container>
  );
};

export default NotFound;
