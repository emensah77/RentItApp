import React, {useMemo} from 'react';
import {Pressable, Text} from 'react-native';
import {styles} from './styles';

const Button = ({text, onPress, variant = 'default', style}) => {
  const mainStyle = useMemo(() => {
    return {
      ...(styles[variant] || {}),
    };
  }, [style, variant]);

  const textStyle = useMemo(() => {
    return {
      ...(styles[`${variant}Text`] || {}),
    };
  }, [style, variant]);

  return (
    <Pressable onPress={onPress} style={[mainStyle, style]}>
      <Text style={textStyle}>{text}</Text>
    </Pressable>
  );
};

export default Button;
