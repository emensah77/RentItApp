import React from 'react';
import {View} from 'react-native';
import Star from '../../../../assets/data/images/icons/star.svg';

import Typography from '../../DataDisplay/Typography';

const StarRating = ({rating}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Star width={14} height={13} />
      <Typography variant="default"> {rating}</Typography>
    </View>
  );
};

export default StarRating;
