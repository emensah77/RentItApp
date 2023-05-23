import React from 'react';
import {Pressable} from 'react-native';

import {styles} from './styles';

const CircleButton = ({style, onPress}) => {
  return <Pressable style={[styles.main, style]} onPress={onPress} />;
};

export default CircleButton;
