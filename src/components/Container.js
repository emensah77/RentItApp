import React from 'react';
import {Pressable} from 'react-native';

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

  return (
    <Pressable
      onPress={onPress}
      android_ripple={ripple}
      hitSlop={hitSlop}
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[
        row ? global.row : {},
        global[type],
        left ? global.left : {},
        center ? global.center : {},
        width ? {width} : {},
        height ? {maxHeight: height, height} : {},
        color ? {backgroundColor: color} : {},
        position ? {alignSelf: position} : {},
      ]}>
      {children}
    </Pressable>
  );
};

export default Container;
