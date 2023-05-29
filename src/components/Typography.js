import React from 'react';
import {Text} from 'react-native';

import {typography} from '../assets/styles';

const Typography = props => {
  const {children, type, center, left, width, numberOfLines, color, position, size} = props;
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        typography[type] || typography.regular,
        left ? typography.left : {},
        center ? typography.center : {},
        width ? {width} : {},
        color ? {color} : {},
        position ? {alignSelf: position} : {},
        size ? {fontSize: size} : {},
      ]}>
      {children}
    </Text>
  );
};

export default Typography;
