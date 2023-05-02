import React, {useCallback, useEffect, useState} from 'react';
import {ImageBackground, Pressable, Text, TouchableOpacity} from 'react-native';
import styles from './styles.js';

import {useNavigation} from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import * as Animatable from 'react-native-animatable';
import Fontisto from 'react-native-vector-icons/Fontisto';

const HouseUploadScreen = props => {
  const navigation = useNavigation();
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [lastScreen, setLastScreen] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkHomeUploadProgress = useCallback(async () => {
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
        console.log('Home upload progress:', data);
        setLastScreen(data.screenName);
        setUploadInProgress(true);
      }
      setIsLoading(false); // Set loading state to false after fetching the data
    } catch (error) {
      console.error('Error checking home upload progress:', error);
    }
  }, []);

  useEffect(() => {
    checkHomeUploadProgress();
  }, [checkHomeUploadProgress]);

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
      <ImageBackground
        source={{
          uri: 'https://envato-shoebox-0.imgix.net/f553/d600-29fe-48ea-8e10-d88c190c4d37/7_T13A4174.jpg?auto=compress%2Cformat&fit=max&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark2.png&markalign=center%2Cmiddle&markalpha=18&w=1600&s=d36a454b3e1ca7c15572d8b4bcddad6a',
        }}
        style={styles.image}>
        <Pressable
          style={{
            margin: 20,
            shadowColor: 'black',
            shadowOpacity: 0.5,
            shadowRadius: 20,
            position: 'absolute',
            top: Platform.OS === 'ios' ? 30 : 0,
            left: 0,
            height: 40,
            width: 40,
            backgroundColor: 'white',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Fontisto name="angle-left" size={15} style={{color: 'black'}} />
        </Pressable>
      </ImageBackground>

      <Animatable.View
        useNativeDriver={true}
        animation="fadeInUpBig"
        duration={1500}
        style={styles.footer}>
        <Text style={styles.text_header}> Upload your home in {'\n'} 10 easy steps </Text>
        <TouchableOpacity
          onPress={() => {
            if (uploadInProgress && lastScreen) {
              navigation.navigate(lastScreen);
            } else {
              navigation.navigate('OnboardingScreen1');
            }
          }}
          style={{
            borderRadius: 10,
            paddingHorizontal: 10,
            marginHorizontal: 15,
            paddingVertical: 20,
            alignItems: 'center',
            backgroundColor: 'deeppink',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontFamily: 'Montserrat-Bold',
            }}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </>
  );
};

export default HouseUploadScreen;
