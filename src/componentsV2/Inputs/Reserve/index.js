import React from 'react';
import {View} from 'react-native';

import {styles} from './styles';

import Typography from '../../DataDisplay/Typography';
import Button from '../Button';
import {formatCurrency} from '../../../utils/formatter';

const Reserve = ({topComponent, bottomComponent, price, currency, onPress, buttonText}) => {
  return (
    <View style={styles.main} on>
      <View style={styles.reserveBlockInfo}>
        {!topComponent && (
          <Typography variant="large" bold>
            {formatCurrency(currency)}
            {` `}
            {price} / month
          </Typography>
        )}
        {!bottomComponent && (
          <>
            <Typography>night</Typography>
            <Typography>Feb 13 - 14</Typography>
          </>
        )}
        {topComponent}
        {bottomComponent}
      </View>
      <Button text={buttonText || 'Reserve'} onPress={onPress} />
    </View>
  );
};

export default Reserve;
