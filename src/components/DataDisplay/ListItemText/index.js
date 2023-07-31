import React from 'react';
import {View} from 'react-native';
import global, {offsets} from '../../../assets/styles/global';
import Typography from '../Typography';

const ListItemText = ({
  primaryVariant,
  primary,
  secondaryVariant,
  secondary,
  icon,
  reverse,
  center,
}) => {
  return (
    <View
      style={[
        global.rowBetween,
        {flexDirection: reverse ? 'row-reverse' : 'row'},
        {marginVertical: offsets.offsetA, alignItems: center ? 'center' : undefined},
      ]}>
      <View style={{width: icon ? '88%' : undefined}}>
        {typeof primary === 'string' ? (
          <Typography variant={primaryVariant} bold>
            {primary}
          </Typography>
        ) : (
          primary
        )}
        {typeof secondary === 'string' ? (
          <Typography variant={secondaryVariant}>{secondary}</Typography>
        ) : (
          secondary
        )}
      </View>
      <View style={{width: icon ? '12%' : undefined}}>{icon}</View>
    </View>
  );
};

export default ListItemText;
