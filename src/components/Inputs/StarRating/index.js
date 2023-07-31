import React from 'react';
import {View, Image} from 'react-native';
import Star from '../../../../assets/data/images/star.png';

import Typography from '../../DataDisplay/Typography';

const StarRating = ({rating}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Image source={Star} style={{width: 14, height: 13}} />
      <Typography variant="default"> {rating}</Typography>
    </View>
  );
};

export default StarRating;
