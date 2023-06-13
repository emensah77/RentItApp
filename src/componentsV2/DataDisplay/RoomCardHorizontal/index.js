import React from 'react';
import {View, Image} from 'react-native';
import Typography from '../Typography';
import {styles} from './styles';
import RoomImage from '../../../../assets/data/images/room-example.png';

const RoomCardHorizontal = ({
  imageUrl,
  title,
  infoDateText,
  infoText,
  infoBottomText,
  infoSuperhost,
}) => {
  return (
    <View style={styles.content}>
      {imageUrl && <Image source={{uri: imageUrl}} style={styles.image} />}
      <View style={styles.textBox}>
        <Typography style={styles.title} bold>
          {title}
        </Typography>
        <Typography style={styles.infoDateText}>{infoDateText}</Typography>
        <Typography style={styles.infoText}>{infoText}</Typography>
        <View style={styles.bottomBlock}>
          <Typography>{infoBottomText}</Typography>
          <Typography>{infoSuperhost}</Typography>
        </View>
      </View>
    </View>
  );
};

export default RoomCardHorizontal;
