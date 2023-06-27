import React from 'react';
import {Pressable, View} from 'react-native';

import Typography from '../Typography';
import {styles} from './styles';

const YesNoOptions = () => {
  return (
    <View style={styles.optionsBox}>
      <Pressable style={styles.optionBtn}>
        <Typography style={styles.optionBtnText}>Yes</Typography>
      </Pressable>
      <Pressable style={styles.optionBtn}>
        <Typography style={styles.optionBtnText}>No</Typography>
      </Pressable>
    </View>
  );
};

export default YesNoOptions;
