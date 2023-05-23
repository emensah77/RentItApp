import React from 'react';
import {View, Image} from 'react-native-animatable';
import Typography from '../../../componentsV2/DataDisplay/Typography';
import {styles} from './styles.js';

const RulesRow = ({image, text}) => {
  return (
    <View style={styles.rulesItem}>
      <Image source={image} width={22} height={22} style={styles.image} />
      <Typography variant="large">{text}</Typography>
    </View>
  );
};

export default RulesRow;
