import React from 'react';
import {ImageBackground} from 'react-native';

import Typography from '../Typography';
import {styles} from './styles';
import Bg from '../../../../assets/data/images/successFinalImage.png';

const SuccessScreen = ({title, text}) => {
  return (
    <ImageBackground
      style={styles.mainContent}
      source={Bg}
      imageStyle={{
        resizeMode: 'contain',
      }}
    >
      <Typography style={styles.successTitle}>{title}</Typography>
      <Typography style={styles.successText}>{text}</Typography>
    </ImageBackground>
  );
};

export default SuccessScreen;
