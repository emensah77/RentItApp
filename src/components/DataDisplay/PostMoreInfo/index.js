import React from 'react';
import {View, Pressable, Image} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import Typography from '../Typography';

import {styles} from './styles';

import RightAngle from '../../../assets/images/arrow-right.png';

const PostMoreInfo = ({title, content, onPress}) => {
  return (
    <Pressable style={styles.postMoreInfo} onPress={onPress}>
      <View>
        <Typography variant="headingLarge" bold style={{paddingBottom: 10}}>
          {title}
        </Typography>
        <Typography style={{paddingBottom: 14, width: wp(80)}}>{content}</Typography>
      </View>

      <Image source={RightAngle} style={{width: 20, height: 20}} />
    </Pressable>
  );
};

export default PostMoreInfo;
