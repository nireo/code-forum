import React from 'react';
import { Toolbar, Button, Typography } from '@material-ui/core';

const NavBar: React.FC = () => {
  return (
    <div>
      <Toolbar>
        <Button size="small">Subscribe</Button>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
        >
          code forum
        </Typography>
        <Button variant="outlined" size="small">
          Sign up
        </Button>
      </Toolbar>
    </div>
  );
};

export default NavBar;
