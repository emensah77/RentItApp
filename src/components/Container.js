import React, {useMemo} from 'react';
import {Pressable, View} from 'react-native';

import {global} from '../assets/styles';

const Container = props => {
  const {
    row,
    type,
    children,
    center,
    left,
    width,
    height,
    color,
    position,
    onPress,
    ripple,
    hitSlop,
    accessibilityLabel,
  } = props;

  const style = useMemo(
    () => [
      row ? global.row : {},
      global[type],
      left ? global.left : {},
      center ? global.center : {},
      width ? {width} : {},
      height ? {maxHeight: height, height} : {},
      color ? {backgroundColor: color} : {},
      position ? {alignSelf: position} : {},
    ],
    [center, color, height, left, position, row, type, width],
  );

  const Display = useMemo(() => (onPress ? Pressable : View), [onPress]);

  return (
    <Display
      onPress={onPress && onPress}
      android_ripple={ripple}
      hitSlop={hitSlop}
      accessible
      accessibilityLabel={accessibilityLabel}
      style={style}>
      {children}
    </Display>
  );
};

export default Container;
