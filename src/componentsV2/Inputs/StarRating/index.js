import React from 'react';
import {View} from 'react-native';

import Typography from '../../DataDisplay/Typography';

const StarRating = ({rating}) => {
  return (
    <View>
      <Typography variant="default">Stars ({rating})</Typography>
    </View>
  );
};

export default StarRating;
