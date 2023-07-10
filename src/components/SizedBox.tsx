import React from 'react';
import {View} from 'react-native';
/* ANCHOR SIZED BOX */
interface SizedBoxProps {
  height?: number | string;
  width?: number | string;
  backgroundColor?: any;
  flex?: number;
  style?: any;
}
export const SizedBox = ({width, height, flex, backgroundColor, style}: SizedBoxProps) => {
  return (
    <View
      style={[
        {
          width,
          height,
          flex,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};
