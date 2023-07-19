import React, {useCallback} from 'react';
import {View, Pressable} from 'react-native';
import {Text} from '@components';

import {styles} from './styles';

const PlusMinus = ({value = 0, min, max, onChange}) => {
  const minus = useCallback(() => {
    if (!onChange) {
      return;
    }
    if (min === undefined || value - 1 >= min) {
      onChange(value - 1);
    }
  }, [min, onChange, value]);

  const plus = useCallback(() => {
    if (!onChange) {
      return;
    }
    if (max === undefined || value + 1 <= max) {
      onChange(value + 1);
    }
  }, [max, onChange, value]);
  return (
    <View style={styles.main}>
      <Pressable style={styles.button} onPress={minus}>
        <Text text="-" />
      </Pressable>
      <Text text={value || '0'} style={styles.value} />
      <Pressable style={styles.button} onPress={plus}>
        <Text text="+" />
      </Pressable>
    </View>
  );
};

export default PlusMinus;
