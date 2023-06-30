import React from 'react';
import {Image, View} from 'react-native';
import {styles} from './styles.js';
import Typography from '../../componentsV2/DataDisplay/Typography/index.js';

const UploadingProcess = ({icon, text, loadedText}) => {
  return (
    <View style={styles.content}>
      <Image source={icon} style={styles.icon} />
      <Typography style={styles.text} bold>
        {text}
      </Typography>
      <Typography style={styles.uploadProcessText}>{loadedText}</Typography>
    </View>
  );
};

export default UploadingProcess;
