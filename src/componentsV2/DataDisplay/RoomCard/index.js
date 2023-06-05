import React from 'react';
import { Pressable, View, ImageBackground} from 'react-native';

import Typography from '../Typography';
import Divider from '../Divider';
import {styles} from './styles';


const RoomCard = ({tagInfoText, name, infoText, date, year, city, country, image}) => {
  
  return (
    <View style={styles.content}>
       <ImageBackground style={styles.roomImageBox} source={image}>
            <View style={styles.tagInfo}>
                <Typography style={styles.tagInfoText}>{tagInfoText}</Typography>
            </View>
       </ImageBackground>
       <View style={styles.roomInfoBox}>
            <Typography style={styles.name}>{name}</Typography>
            <Typography style={styles.infoText}>{infoText}</Typography>
            <Divider />
            <View style={styles.roomInfoBoxBottom}>
                <View style={styles.dateBox}>
                    <Typography style={styles.date}>{date}</Typography>
                    <Typography style={styles.year}>{year}</Typography>
                </View>
                <View style={styles.placeBox}>
                    <Typography style={styles.city}>{city}</Typography>
                    <Typography style={styles.country}>{country}</Typography>
                </View>
            </View>
       </View>
    </View>
  );
};

export default RoomCard;
