import React from 'react';
import {View} from 'react-native';

import {styles} from './styles';

import Typography from '../../DataDisplay/Typography';
import Button from '../Button';

const Reserve = () => {
  return (
    <View style={styles.main}>
      <View style={styles.reserveBlockInfo}>
        <Typography variant="large" bold>
          32$
        </Typography>
        <Typography>night</Typography>
        <Typography>Feb 13 - 14</Typography>
      </View>

      <Button text="Reserve" />
    </View>
  );
};

export default Reserve;
