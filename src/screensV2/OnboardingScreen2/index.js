import React, {useState} from 'react';
import {View, Image, Text, Pressable} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';

import Typography from '../../componentsV2/DataDisplay/Typography';
import Divider from '../../components/Divider';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';

const OnboardingScreen2 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [bedCount, setBedCount] = useState(1);
  const [bedRoomCount, setBedRoomCount] = useState(1);
  const [bathRoomsCount, setBathRoomsCount] = useState(1);
  const type = route.params?.type;
  const mode = route.params?.mode;

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
    navigation.navigate('OnboardingScreen3');
  };

  const bedPlus = type => {
    if (type === 'plus') {
      setBedCount(bedCount + 1);
    }
    if (type === 'minus' && bedCount > 1) {
      setBedCount(bedCount - 1);
    }
  };
  const bedRoomPlus = type => {
    if (type === 'plus') {
      setBedRoomCount(bedRoomCount + 1);
    }
    if (type === 'minus' && bedRoomCount > 1) {
      setBedRoomCount(bedRoomCount - 1);
    }
  };
  const bathroomsPlus = type => {
    if (type === 'plus') {
      setBathRoomsCount(bathRoomsCount + 1);
    }
    if (type === 'minus' && bathRoomsCount > 1) {
      setBathRoomsCount(bathRoomsCount - 1);
    }
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
                mode,
                bedRoomCount,
                bathRoomsCount,
                bedCount,
              });
              navigation.navigate('OnboardingScreen10', {
                type,
                mode,
                bedCount,
                bedRoomCount,
                bathRoomsCount,
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
        How many bedrooms and bathrooms?
      </Typography>
      <View style={styles.placesList}>
        <View style={styles.placeItem}>
          <Typography style={styles.placeName}>Beds</Typography>
          <View style={styles.bedCount}>
            <Pressable onPress={() => bedPlus('minus')} style={styles.increment}>
              <Text style={styles.incrementText}>-</Text>
            </Pressable>
            <Typography style={styles.bedCountText} bold>
              {bedCount}
            </Typography>
            <Pressable onPress={() => bedPlus('plus')} style={styles.increment}>
              <Text style={styles.incrementText}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.placeItem, styles.placeSecondItem]}>
          <Typography style={styles.placeName}>Bedrooms</Typography>
          <View style={styles.bedCount}>
            <Pressable onPress={() => bedRoomPlus('minus')} style={styles.increment}>
              <Text style={styles.incrementText}>-</Text>
            </Pressable>
            <Typography style={styles.bedCountText} bold>
              {bedRoomCount}
            </Typography>
            <Pressable onPress={() => bedRoomPlus('plus')} style={styles.increment}>
              <Text style={styles.incrementText}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.placeItem, styles.placeSecondItem]}>
          <Typography style={styles.placeName}>Bathrooms</Typography>
          <View style={styles.bedCount}>
            <Pressable onPress={() => bathroomsPlus('minus')} style={styles.increment}>
              <Text style={styles.incrementText}>-</Text>
            </Pressable>
            <Typography style={styles.bedCountText} bold>
              {bathRoomsCount}
            </Typography>
            <Pressable onPress={() => bathroomsPlus('plus')} style={styles.increment}>
              <Text style={styles.incrementText}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OnboardingScreen2;
