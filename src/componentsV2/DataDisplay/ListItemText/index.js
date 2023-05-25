import React from 'react';
import {View} from 'react-native';
import globalStyles, {offsets} from '../../../styles/globalStyles';
import Typography from '../Typography';

import Union from '../../../../assets/data/images/icons/union.svg';

const ListItemText = ({
  primaryVariant,
  primary,
  secondaryVariant,
  secondary,
  icon,
  reverse,
  center,
  union,
}) => {
  return (
    <View
      style={[
        globalStyles.rowBetween,
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
      {union && <Union width={20} height={20} />}
    </View>
  );
};

export default ListItemText;
