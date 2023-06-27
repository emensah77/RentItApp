import React from 'react';
import {View, Pressable} from 'react-native';
import Typography from '../../DataDisplay/Typography';

import {styles} from './styles';

const PlusMinus = ({value = 0, min, max, onChange}) => {
  return (
    <View style={styles.main}>
      <Pressable
        style={styles.button}
        onPress={() => {
          if (!onChange) {
            return;
          }
          if (min === undefined || value - 1 >= min) {
            onChange(value - 1);
          }
        }}
      >
        <Typography>-</Typography>
      </Pressable>
      <Typography style={styles.value}>{value}</Typography>
      <Pressable
        style={styles.button}
        onPress={() => {
          if (!onChange) {
            return;
          }
          if (max === undefined || value + 1 <= max) {
            onChange(value + 1);
          }
        }}
      >
        <Typography>+</Typography>
      </Pressable>
    </View>
  );
};

export default PlusMinus;
