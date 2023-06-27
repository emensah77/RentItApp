import React, {useEffect, useState} from 'react';
import {View, Image, Pressable, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import IconMan from '../../../assets/data/images/second-step.png';
import {offsets} from '../../styles/globalStyles';
import DividedProgress from '../../componentsV2/DataDisplay/DividedProgress';
import BottomActionsBar from '../../componentsV2/Inputs/BottomActionsBar';

const OnboardingScreen14 = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const title = route.params?.title;
  const bed = route.params?.bed;
  const bedroom = route.params?.bedroom;
  const bathroom = route.params?.bathroom;
  const imageUrls = route.params?.imageUrls;
  const homeprice = route.params?.homeprice;
  const latitude = route.params?.latitude;
  const longitude = route.params?.longitude;
  const type = route.params?.type;
  const description = route.params?.description;
  const mode = route.params?.mode;
  const amenities = route.params?.amenities;
  const locality = route.params?.locality;
  const sublocality = route.params?.sublocality;
  const address = route.params?.address;
  const currency = route.params?.currency;
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
  const goFaqs = () => {};

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
              // eslint-disable-next-line react/jsx-no-bind
              onPress={async () => {
                await saveProgress({
                  type,
                  title,
                  description,
                  bed,
                  bedroom,
                  bathroom,
                  imageUrls,
                  homeprice,
                  latitude,
                  longitude,
                  mode,
                  amenities,
                  locality,
                  sublocality,
                  currency,
                  address,
                });
                navigation.navigate('OnboardingScreen3', {
                  title,
                  type,
                  description,
                  bed,
                  bedroom,
                  bathroom,
                  imageUrls,
                  homeprice,
                  latitude,
                  longitude,
                  mode,
                  amenities,
                  locality,
                  sublocality,
                  currency,
                  address,
                });
              }}>
              <Typography style={styles.topButtonText}>Save & exit</Typography>
            </Pressable>
            {/* //OnboardingScreen13 */}
            <Pressable style={styles.topButton} onPress={goFaqs}>
              <Typography style={styles.topButtonText}>FAQs</Typography>
            </Pressable>
          </View>
        </View>
        <Image source={IconMan} style={styles.imgItem} />
        <Typography style={styles.stepText}>Step 2</Typography>
        <Typography bold style={styles.title}>
          Make it stand out
        </Typography>
        <Typography style={styles.text}>
          In this step, we’ll ask you which type of amenities your home offers, pictures of your
          home, the location, the price.
        </Typography>
        <View
          style={{
            width: wp(100),
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}>
          <View style={{paddingHorizontal: offsets.offsetB}}>
            <DividedProgress total={6} progress={0} style={{marginBottom: offsets.offsetB}} />
          </View>
          <BottomActionsBar
            leftText="Back"
            rightText="Next"
            rightAction={async () => {
              navigation.navigate('OnboardingScreen3');
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen14;
