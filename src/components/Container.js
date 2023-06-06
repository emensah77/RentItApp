import React from 'react';
import {View} from 'react-native';

import {global} from '../assets/styles';

const Container = props => {
  const {row, type, children, center, left, width, color, position} = props;
  return (
    <View
      style={[
        row ? global.row : {},
        global[type],
        left ? global.left : {},
        center ? global.center : {},
        width ? {width} : {},
        color ? {backgroundColor: color} : {},
        position ? {alignSelf: position} : {},
      ]}>
      {children}
    </View>
  );
};

export default Container;
