import React, {useMemo} from 'react';
import {View, Image, Pressable} from 'react-native';

import {styles} from './styles';
import Typography from '../Typography';
import {offsets} from '../../../assets/styles/global';
import {formatCurrency} from '../../../utils/formatter';

const RoomItem = ({image, title, currency, newPrice, locality, subLocality, onPress}) => {
  const formattedCurrency = useMemo(() => formatCurrency(currency), [currency]);
  return (
    <Pressable onPress={onPress} style={styles.main}>
      {image && <Image source={{uri: image}} style={styles.image} />}
      <View style={styles.textWrapper}>
        <Typography bold>{title}</Typography>
        <Typography style={{marginTop: offsets.offsetA}}>
          {locality}, {subLocality}
        </Typography>
        <Typography style={{marginTop: offsets.minor}}>
          {formattedCurrency} {newPrice} / month
        </Typography>
      </View>
    </Pressable>
  );
};

export default RoomItem;
