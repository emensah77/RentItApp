import React from 'react';
import {Pressable} from 'react-native';

import {styles} from './styles';

const CircleButton = ({style, onPress, image, minimal}) => {
  return (
    <Pressable style={[styles.main, style, minimal && styles.minimal]} onPress={onPress}>
      {image}
    </Pressable>
  );
};

export default CircleButton;
