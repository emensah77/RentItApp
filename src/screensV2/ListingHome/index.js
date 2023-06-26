import React, {useState, useEffect, useCallback} from 'react';
import {Pressable, View, Image, ScrollView} from 'react-native';
import auth from '@react-native-firebase/auth';
import Typography from '../../componentsV2/DataDisplay/Typography';
import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import Icon1 from '../../../assets/data/images/woman.png';
import Icon2 from '../../../assets/data/images/man-1.png';
import Icon3 from '../../../assets/data/images/man-2.png';

import ListingSteps from '../ListingSteps';
import {useNavigation} from '@react-navigation/native';

const ListingHome = () => {
  const navigation = useNavigation();
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [lastScreen, setLastScreen] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const goOnboardingScreen = useCallback(() => {
    if (uploadInProgress && lastScreen) {
      // navigation.navigate(lastScreen);
      console.log(1);
      navigation.navigate('OnboardingScreen1');
    } else {
      console.log(2);
      navigation.navigate('OnboardingScreen1');
    }
  }, []);

  useEffect(() => {
    checkHomeUploadProgress();
  }, []);

  const checkHomeUploadProgress = async () => {
    const userId = auth().currentUser.uid;
    try {
      const response = await fetch(
        `https://a27ujyjjaf7mak3yl2n3xhddwu0dydsb.lambda-url.us-east-2.on.aws/?userId=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();

      if (data) {
        console.log('Data', data);
        setLastScreen(data.screenName);
        setUploadInProgress(true);
      }
      setIsLoading(false); // Set loading state to false after fetching the data
    } catch (error) {
      console.error('Error checking home upload progress:', error);
    }
  };
  let buttonText;

  if (isLoading) {
    buttonText = 'Loading...';
  } else if (uploadInProgress && lastScreen) {
    buttonText = 'Continue';
  } else {
    buttonText = "Let's go";
  }
  return (
    <>
      <View style={styles.mainContent}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={BackArrow} />
        </Pressable>
        <ScrollView style={styles.scrollContent}>
          <Typography bold style={styles.title}>
            It's easy to get started on Rentit
          </Typography>
          <View style={styles.item}>
            <View style={styles.left}>
              <Typography style={styles.boldText}>1 Tell us about your place</Typography>
              <Typography style={styles.lightText}>
                Share some basic info like how many guest can stay.
              </Typography>
            </View>
            <Image source={Icon1} width={65} />
          </View>
          <View style={styles.item}>
            <View style={styles.left}>
              <Typography style={styles.boldText}>2 Make it stand out</Typography>
              <Typography style={styles.lightText}>
                Share some basic info like how many guest can stay.
              </Typography>
            </View>
            <Image source={Icon2} width={65} />
          </View>
          <View style={styles.item}>
            <View style={styles.left}>
              <Typography style={styles.boldText}>3 Finish up and publish</Typography>
              <Typography style={styles.lightText}>
                Set a starting price, and publish your listing.
              </Typography>
            </View>
            <Image source={Icon3} width={65} />
          </View>
        </ScrollView>
      </View>
      <View style={styles.bottomFixedButtonBox}>
        <Pressable style={styles.bottomFixedButton} onPress={goOnboardingScreen}>
          <Typography style={styles.bottomFixedButtonText} bold>
            Get Started
          </Typography>
        </Pressable>
      </View>
    </>

    // <ListingSteps />
  );
};

export default ListingHome;
