import React from 'react';
import {Text} from 'react-native';

import {typography} from '../assets/styles';

const Typography = props => {
  const {
    children,
    type,
    center,
    left,
    width,
    numberOfLines,
    color,
    position,
    size,
    weight,
    height,
    accessibilityLabel,
  } = props;
  return (
    <Text
      accessible
      accessibilityLabel={accessibilityLabel}
      numberOfLines={numberOfLines}
      style={[
        typography[type] || typography.regular,
        left ? typography.left : {},
        center ? typography.center : {},
        width ? {width} : {},
        color ? {color} : {},
        height ? {lineHeight: height} : {},
        position ? {alignSelf: position} : {},
        weight ? {fontWeight: weight} : {},
        size ? {fontSize: size} : {},
      ]}>
      {children}
    </Text>
  );
};

export default Typography;
