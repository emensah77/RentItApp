import React, {useEffect} from 'react';
import {View, Image, Pressable} from 'react-native';
import auth from '@react-native-firebase/auth';
import LoadingDots from 'react-native-loading-dots';
import {useNavigation, useRoute} from '@react-navigation/native';

import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';
import Checkbox from '../../../assets/data/images/icons/checkbox-green.svg';

const OnboardingScreen17 = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const title = route.params?.title;
  const type = route.params?.type;
  const description = route.params?.description;
  const bed = route.params?.bed;
  const bedroom = route.params?.bedroom;
  const bathroom = route.params?.bathroom;
  const imageUrls = route.params?.imageUrls;
  const mode = route.params?.mode;
  const amenities = route.params?.amenities;

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

  const next = async () => {
    await saveProgress({
      type,
      title,
      description,
      bed,
      bedroom,
      bathroom,
      imageUrls,
      mode,
      amenities,
    });
    navigation.navigate('OnboardingScreen5', {
      type,
      title,
      description,
      bed,
      bedroom,
      bathroom,
      imageUrls,
      amenities,
      mode,
    });
  };
  useEffect(() => {
    setTimeout(() => {
      next();
    }, 2000);
  }, []);
  return (
    <View style={styles.mainContent}>
      <Checkbox width={20} height={20} />
      <Typography bold style={styles.title}>
        Photos looking awesome!
      </Typography>
    </View>
  );
};

export default OnboardingScreen17;
