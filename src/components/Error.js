import React from 'react';

import Container from './Container';
import Typography from './Typography';

const Error = ({text}) =>
  text ? (
    <Container type="flexStart">
      <Typography type="regular" color="red" left width="100%">
        {text}
      </Typography>
    </Container>
  ) : null;

export default Error;
