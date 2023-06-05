import React from 'react';
import {Image, Pressable} from 'react-native';
import {styles} from './styles.js';
import Typography from '../../componentsV2/DataDisplay/Typography/index.js';

const BigRoundedButton = ({icon, text}) => {
  return (
    <Pressable style={styles.button}>
        <Image source={icon} width={20} height={20} style={styles.image} />
        <Typography style={styles.text}>{text}</Typography>
    </Pressable>
  );
};

export default BigRoundedButton;
