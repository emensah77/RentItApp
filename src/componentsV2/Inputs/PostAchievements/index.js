import React from 'react';
import {View} from 'react-native';
import StarRating from '../StarRating';
import {calcRatingFromPost} from '../../../utils/calculations';
import Typography from '../../DataDisplay/Typography';

const PostAchievements = ({post, style}) => {
  return (
    <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, style]}>
      <StarRating disabled rating={calcRatingFromPost(post)} />
      <Typography onPress={() => {}} style={{textDecorationLine: 'underline'}}>
        28 Reviews
      </Typography>
      <Typography>() Superhost</Typography>
    </View>
  );
};

export default PostAchievements;
