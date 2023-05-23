import React from 'react';
import {View, Image, Pressable} from 'react-native';
import Typography from '../Typography';
import {styles} from './styles';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const PostMoreInfo = ({title, content, image, onPress}) => {
  return (
    <Pressable style={styles.postMoreInfo} onPress={onPress}>
      <View>
        <Typography variant="headingLarge" bold style={{paddingBottom: 10}}>
          {title}
        </Typography>
        <Typography style={{paddingBottom: 14, width: wp(80)}}>{content}</Typography>
      </View>

      <Image source={image} />
    </Pressable>
  );
};

export default PostMoreInfo;
