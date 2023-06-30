import React from 'react';
import {View} from 'react-native';
import Typography from '../Typography';
import {styles} from './styles.js';

const RatingItem = ({text, raiting}) => {
  return (
    <View style={styles.ratingItem}>
      <Typography style={styles.text}>{text}</Typography>
      <View style={styles.ratingProgressBody}>
        <View style={styles.ratingProgressContent}>
          <View style={styles.ratingProgress} />
        </View>
        <Typography variant="large" bold>
          {raiting}
        </Typography>
      </View>
    </View>
  );
};

export default RatingItem;
