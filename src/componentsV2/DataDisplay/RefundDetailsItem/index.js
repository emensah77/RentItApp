import React from 'react';
import {View} from 'react-native';
import Typography from '../Typography';
import {styles} from './styles';

const RefundDetailsItem = ({title, price, paid}) => {
  return (
    <View style={styles.mainContent}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}
      >
        <Typography style={styles.title}>{title}</Typography>
        <Typography style={styles.title}>{price}</Typography>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <Typography style={styles.text}>Full refund</Typography>
        <Typography style={styles.text}>of {paid} paid</Typography>
      </View>
    </View>
  );
};

export default RefundDetailsItem;
