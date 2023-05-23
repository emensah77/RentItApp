import React from 'react'
import { View, Image } from 'react-native-animatable';
import Typography from '../../../componentsV2/DataDisplay/Typography';
import {styles} from './styles.js';

const AmenitiesItem = ({image, text}) => {
    return (
        <View style={styles.amentiesItem}>
            <Image source={image} width={24} height={26} style={styles.image} />
            <Typography variant="default">{text}</Typography>
        </View>
    )
}

export default AmenitiesItem;