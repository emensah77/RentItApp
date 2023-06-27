import React from 'react';
import {View, Image, Pressable, ScrollView} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import IconWoman from '../../../assets/data/images/woman-big.png';
import DividedProgress from '../../componentsV2/DataDisplay/DividedProgress';
import {offsets} from '../../styles/globalStyles';
import BottomActionsBar from '../../componentsV2/Inputs/BottomActionsBar';

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
    navigation.navigate('OnboardingScreen12');
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.mainContent}>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={goBack}>
          <Image source={BackArrow} />
        </Pressable>
        <View style={styles.topButtons}>
          <Pressable
            style={styles.topButton}
            onPress={() => navigation.navigate('OnboardingScreen12')}
          >
            <Typography style={styles.topButtonText}>Save & exit</Typography>
          </Pressable>
          <Pressable style={styles.topButton} onPress={goFaqs}>
            <Typography style={styles.topButtonText}>FAQs</Typography>
          </Pressable>
        </View>
      </View>
      <ScrollView style={styles.scrollContent}>
        <View style={{width: '100%', alignItems: 'center'}}>
          <Image source={IconWoman} />
        </View>
        <Typography style={styles.stepText}>Step 1</Typography>
        <Typography bold style={styles.title}>
          Tell us about your place
        </Typography>
        <Typography style={styles.text}>
          In this step, we’ll ask you which type of property you have and if guest will book the
          entire place or just a room.{' '}
        </Typography>
      </ScrollView>
      <View
        style={{
          width: wp(100),
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
      >
        <View style={{paddingHorizontal: offsets.offsetB}}>
          <DividedProgress total={6} progress={1} style={{marginBottom: offsets.offsetB}} />
        </View>
        <BottomActionsBar
          leftText="Back"
          rightText="Next"
          rightAction={() => navigation.navigate('OnboardingScreen12')}
        />
      </View>
    </View>
  );
};

export default OnboardingScreen1;
