import React from 'react';
import {Text} from 'react-native';

import {typography} from '../assets/styles';

const Typography = props => {
  const {children, type, center, left, width} = props;
  return (
    <Text
      style={[
        typography[type] || typography.regular,
        left ? typography.left : {},
        center ? typography.center : {},
        width ? {width} : {},
      ]}>
      {children}
    </Text>
  );
};

export default Typography;
