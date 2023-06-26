import React from 'react';
import {View} from 'react-native';
import StarRating from '../StarRating';
import {calcRatingFromPost} from '../../../utils/calculations';
import Typography from '../../DataDisplay/Typography';

const PostAchievements = ({post, style, reviewsCount}) => {
  return (
    <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, style]}>
      <StarRating disabled rating={calcRatingFromPost(post)} />
      <Typography onPress={() => {}} style={{textDecorationLine: 'underline'}}>
        {reviewsCount} Reviews
      </Typography>
      <Typography />
    </View>
  );
};

export default PostAchievements;
