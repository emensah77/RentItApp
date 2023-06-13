import React from 'react';
import {View, Image, Pressable} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';

import TopBar from '../../componentsV2/DataDisplay/TopBar';
import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import IconWoman from '../../../assets/data/images/woman-big.png';
import DividedProgress from '../../componentsV2/DataDisplay/DividedProgress';
import {offsets} from '../../styles/globalStyles';

const OnboardingScreen1 = () => {
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
    navigation.navigate('OnboardingScreen2');
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

      <Image source={IconWoman} style={{marginBottom: 44}} />
      <Typography style={styles.stepText}>Step 1</Typography>
      <Typography bold style={styles.title}>
        Tell us about your place
      </Typography>
      <Typography style={styles.text}>
        In this step, we’ll ask you which type of property you have and if guest will book the
        entire place or just a room.{' '}
      </Typography>
      <View
        style={{
          width: '100%',
          paddingHorizontal: offsets.offsetB,
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}>
        <DividedProgress />
      </View>
    </View>
  );
};

export default OnboardingScreen1;
