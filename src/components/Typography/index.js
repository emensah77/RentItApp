import React from 'react';
import propTypes from 'prop-types';
import {Text} from 'react-native';

const Typography = props => {
  <Text>{props.children}</Text>;
};

Typography.prototype = {
  children: propTypes.string.isRequired,
  type: propTypes.oneOf(['h1', 'h2', 'h3', 'body1']),
};

export default Typography;
