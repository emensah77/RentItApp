import React from 'react';
import {Pressable, Image} from 'react-native';
import Typography from '../Typography';
import {styles} from './styles';
import RightArrow from '../../../../assets/data/images/icons/right-angle.png';

const ArrowLink = ({text, onPress}) => {
  return (
    <Pressable style={styles.mainLink} onPress={onPress}>
      <Typography variant="large">{text}</Typography>
      <Image source={RightArrow} width={6.5} height={12.5} />
    </Pressable>
  );
};

export default ArrowLink;
