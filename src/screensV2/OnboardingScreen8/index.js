import React, {useCallback} from 'react';
import {View, Image, Pressable, ScrollView, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import IconMan from '../../../assets/data/images/man-big.png';
import {offsets} from '../../styles/globalStyles';
import DividedProgress from '../../componentsV2/DataDisplay/DividedProgress';
import BottomActionsBar from '../../componentsV2/Inputs/BottomActionsBar';

const OnboardingScreen8 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const title = route.params?.title;
  const type = route.params?.type;
  const description = route.params?.description;
  const bed = route.params?.bed;
  const bedroom = route.params?.bedroom;
  const bathroom = route.params?.bathroom;
  const imageUrls = route.params?.imageUrls;
  const homeprice = route.params?.homeprice;
  const mode = route.params?.mode;
  const amenities = route.params?.amenities;
  const currency = route.params?.currency;
  const latitude = route.params?.latitude;
  const longitude = route.params?.longitude;
  const locality = route.params?.locality;
  const sublocality = route.params?.sublocality;
  const address = route.params?.address;
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

  const next = useCallback(async () => {
    await saveProgress({
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
      address,
      currency,
    });
    navigation.navigate('OnboardingScreen13', {
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
      address,
      currency,
    });
  }, [
    address,
    amenities,
    bathroom,
    bed,
    bedroom,
    currency,
    description,
    homeprice,
    imageUrls,
    latitude,
    locality,
    longitude,
    mode,
    navigation,
    saveProgress,
    sublocality,
    title,
    type,
  ]);

  return (
    <SafeAreaView>
      <View style={styles.mainContent}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton}>
            <Image source={BackArrow} />
          </Pressable>
          <View style={styles.topButtons}>
            <Pressable style={styles.topButton} onPress={next}>
              <Typography style={styles.topButtonText}>Save & exit</Typography>
            </Pressable>
            <Pressable style={styles.topButton} onPress={goFaqs}>
              <Typography style={styles.topButtonText}>FAQs</Typography>
            </Pressable>
          </View>
        </View>
        <ScrollView>
          <View style={styles.mainImgWrapper}>
            <Image source={IconMan} style={styles.imgItem} />
          </View>
          <Typography style={styles.stepText}>Step 3</Typography>
          <Typography bold style={styles.title}>
            Finish and publish
          </Typography>
          <Typography style={styles.text}>
            In this step, we’ll ask for your mobile phone number and if your home is negotiable or
            furnished, then finnaly some ID’s and bills.
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
            <DividedProgress total={4} progress={0} style={{marginBottom: offsets.offsetB}} />
          </View>
          <BottomActionsBar leftText="Back" rightText="Next" rightAction={next} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen8;
