import React, {useMemo} from 'react';
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

  const style = useMemo(
    () => [
      typography[type] || typography.regular,
      left ? typography.left : {},
      center ? typography.center : {},
      width ? {width} : {},
      color ? {color} : {},
      height ? {lineHeight: height} : {},
      position ? {alignSelf: position} : {},
      weight ? {fontWeight: weight} : {},
      size ? {fontSize: size} : {},
    ],
    [center, color, height, left, position, size, type, weight, width],
  );

  return (
    <Text
      accessible
      accessibilityLabel={accessibilityLabel}
      numberOfLines={numberOfLines}
      allowFontScaling
      maxFontSizeMultiplier={2}
      style={style}>
      {children}
    </Text>
  );
};

export default Typography;
