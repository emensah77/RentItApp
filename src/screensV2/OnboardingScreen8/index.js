import React from 'react';
import {View, Image, Pressable} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';

import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import IconMan from '../../../assets/data/images/man-big.png';

const OnboardingScreen8 = () => {
  const navigation = useNavigation();
  const route = useRoute();
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
    navigation.navigate('OnboardingScreen9');
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
              await saveProgress({homeType: item.title});
              navigation.navigate('OnboardingScreen2', {
                type: item.title,
              });
            }}>
            <Typography style={styles.topButtonText}>Save & exit</Typography>
          </Pressable>
          <Pressable style={styles.topButton} onPress={goFaqs}>
            <Typography style={styles.topButtonText}>FAQs</Typography>
          </Pressable>
        </View>
      </View>

      <Image source={IconMan} style={styles.imgItem} />
      <Typography style={styles.stepText}>Step 3</Typography>
      <Typography bold style={styles.title}>
        Finish and publish
      </Typography>
      <Typography style={styles.text}>
        In this step, we’ll ask for your mobile phone number and if your home is negotiable or
        furnished, then finnaly some ID’s and bills.
      </Typography>
    </View>
  );
};

export default OnboardingScreen8;
