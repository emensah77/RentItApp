import React from 'react';
import { Pressable, View, Image} from 'react-native';
import Divider from '../../componentsV2/DataDisplay/Divider';

import Typography from '../../componentsV2/DataDisplay/Typography';
import {styles} from './styles';

import UserIcon from '../../../assets/data/images/icons/user-big-icon.png'
import Button from '../../componentsV2/Inputs/Button'

const AddProfilePhoto = () => {
  
  return (
    <View style={styles.mainContent}>
        <View style={styles.head}>
            <Typography style={styles.headText}>Finish signing up</Typography>
        </View>
        <Divider />
        <View style={styles.body}>
            <Typography style={styles.title}>Add a profile photo</Typography>
            <Typography style={styles.text}>Pick an image that shows your face. Hosts won’t be able to see your profile photo until your reservation is confirmed</Typography>
        <Image source={UserIcon} />
        </View>
        <Button text="Upload photo" />
    </View>
  );
};

export default AddProfilePhoto;
