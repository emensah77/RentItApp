import React, {useCallback, useState} from 'react';
import {View, Image, Pressable} from 'react-native';
import auth from '@react-native-firebase/auth';

import {useNavigation, useRoute} from '@react-navigation/native';

import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import PlusIcon from '../../../assets/data/images/icons/plus-icon.svg';
import CameraIcon from '../../../assets/data/images/icons/camera-icon.svg';

const ImagePicker = require('react-native-image-picker');

const OnboardingScreen3 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [uniqueItem, setUniqueItem] = useState([]);
  const [images, setImages] = useState([]);

  const handleChoosePhoto = useCallback(async () => {
    let _data = [...images];
    const options = {};
    ImagePicker.launchImageLibrary(options, response => {
      _data = [..._data, ...(response?.assets || [])];
      setImages(_data);
    });
  }, []);
  const handleLaunchCamera = useCallback(async () => {
    let _data = [...images];
    const options = {};
    ImagePicker.launchCamera(options, response => {
      _data = [..._data, ...(response?.assets || [])];

      setImages(_data);
    });
  }, []);

  const saveProgress = async progressData => {
    try {
      const user = auth().currentUser;
      const screenName = route.name;
      const userId = user.uid;
      await fetch('https://a27ujyjjaf7mak3yl2n3xhddwu0dydsb.lambda-url.us-east-2.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          progress: {
            screenName,
            progressData,
          },
        }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const goFaqs = () => {
    navigation.navigate('OnboardingScreen5');
  };

  const changeItem = id => {
    const _data = [...uniqueItem];
    const index = _data.indexOf(id);

    if (index === -1) {
      _data.push(id);
    } else {
      _data.splice(index, 1);
    }
    setUniqueItem(_data);
  };

  return (
    <View style={styles.mainContent}>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton}>
          <Image source={BackArrow} />
        </Pressable>
        <View style={styles.topButtons}>
          <Pressable
            style={styles.topButton}
            onPress={async () => {
              await saveProgress({
                type,
                title,
                description,
                bed,
                bedroom,
                bathroom,
                mode,
                amenities: selectedItems,
              });
              navigation.navigate('OnboardingScreen4', {
                type,
                title,
                description,
                bed,
                bedroom,
                bathroom,
                mode,
                amenities: selectedItems,
              });
            }}>
            <Typography style={styles.topButtonText}>Save & exit</Typography>
          </Pressable>
          <Pressable style={styles.topButton} onPress={goFaqs}>
            <Typography style={styles.topButtonText}>FAQs</Typography>
          </Pressable>
        </View>
      </View>

      <Typography bold style={styles.title}>
        Let’s add pictures of your home.
      </Typography>

      <View style={styles.placesList}>
        <Pressable style={styles.upload} onPress={handleChoosePhoto}>
          <PlusIcon width={20} height={20} />
          <Typography style={{color: '#717171', paddingLeft: 10}}>Upload photos</Typography>
        </Pressable>
        <Pressable style={styles.upload} onPress={handleLaunchCamera}>
          <CameraIcon width={20} height={20} />
          <Typography style={{color: '#717171', paddingLeft: 10}}>Upload photos</Typography>
        </Pressable>
      </View>
    </View>
  );
};

export default OnboardingScreen3;
