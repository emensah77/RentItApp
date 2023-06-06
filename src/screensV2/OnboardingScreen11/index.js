import React from 'react';
import {View, Image, Pressable, TextInput, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';

import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';

const OnboardingScreen11 = () => {
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
    <SafeAreaView>
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
          Describe your home in detail.
        </Typography>

        <TextInput
          placeholder="Tell us about where your home is located,
          including landmarks and amenities available"
          style={styles.input}
        />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen11;
