import React from 'react';
import {View} from 'react-native';

import {styles} from './styles';

import Typography from '../../DataDisplay/Typography';
import Button from '../Button';
import {formatCurrency} from '../../../utils/formatter';

const Reserve = ({price, currency, onPress}) => {
  return (
    <View style={styles.main} on>
      <View style={styles.reserveBlockInfo}>
        <Typography variant="large" bold>
          {formatCurrency(currency)}
          {` `}
          {price} / month
        </Typography>
        <Typography>night</Typography>
        <Typography>Feb 13 - 14</Typography>
      </View>
      <Button text="Reserve" onPress={onPress} />
    </View>
  );
};

export default Reserve;
