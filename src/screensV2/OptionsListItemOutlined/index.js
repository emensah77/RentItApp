import React from 'react';
import {View} from 'react-native';

import Typography from '../../componentsV2/DataDisplay/Typography';
import {styles} from './styles';

const OptionsListItemOutlined = ({boldText, lightText}) => {
  return (
    <View style={styles.option}>
      <Typography style={styles.optionTextBold}>{boldText}</Typography>
      <Typography style={styles.optionTextLight}>{lightText}</Typography>
    </View>
  );
};

export default OptionsListItemOutlined;
