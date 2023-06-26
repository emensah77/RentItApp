import React, {useCallback, useState} from 'react';
import {View, Image, Pressable, FlatList, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';

import {useNavigation, useRoute} from '@react-navigation/native';

import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import Checkbox from '../../../assets/data/images/checkbox.svg';
import CheckboxActive from '../../../assets/data/images/checkbox-active.svg';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {offsets} from '../../styles/globalStyles';
import DividedProgress from '../../componentsV2/DataDisplay/DividedProgress';
import BottomActionsBar from '../../componentsV2/Inputs/BottomActionsBar';

const OnboardingScreen3 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [uniqueItem, setUniqueItem] = useState([]);

  const type = route.params?.type;
  const description = route.params?.description;
  const title = route.params?.title;
  const bed = route.params?.bed;
  const bedroom = route.params?.bedroom;
  const bathroom = route.params?.bathroom;
  const mode = route.params?.mode;

  const items = [
    {
      name: 'Air Conditioner',
      id: 'Air Conditioner',
      unique: 1,
    },
    {
      name: 'WiFi',
      id: 'WiFi',
      unique: 2,
    },
    {
      name: 'Kitchen',
      id: 'Kitchen',
      unique: 3,
    },
    {
      name: 'Water',
      id: 'Water',
      unique: 4,
    },
    {
      name: 'Toilet',
      id: 'Toilet',
      unique: 5,
    },

    {
      name: 'Bathroom',
      id: 'Bathroom',
      unique: 6,
    },
  ];

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

  const changeItem = id => {
    const _data = [...uniqueItem];
    const index = _data.indexOf(id);

    if (index === -1) {
      _data.push(id);
    } else {
      _data.splice(index, 1);
    }
    setUniqueItem(_data);
  };

  const renderItems = useCallback(
    ({item}) => {
      return (
        <View style={styles.amenetitesItem}>
          <Typography>{item.name}</Typography>
          <Pressable onPress={() => changeItem(item.unique)}>
            {uniqueItem?.includes(item.unique) ? (
              <CheckboxActive width={20} height={20} />
            ) : (
              <Checkbox width={20} height={20} />
            )}
          </Pressable>
        </View>
      );
    },
    [uniqueItem],
  );

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
                  amenities: uniqueItem,
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
          Tell your guest what your place has to offer.
        </Typography>

        <View style={styles.placesList}>
          <Typography style={{marginBottom: 20}} bold>
            Amenities
          </Typography>
          <FlatList data={items} renderItem={renderItems} />
        </View>
        <View
          style={{
            width: wp(100),
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}>
          <View style={{paddingHorizontal: offsets.offsetB}}>
            <DividedProgress total={4} progress={1} style={{marginBottom: offsets.offsetB}} />
          </View>
          <BottomActionsBar
            leftText="Back"
            rightText="Next"
            rightAction={async () => {
              navigation.navigate('OnboardingScreen4', {
                type,
                title,
                description,
                bed,
                bedroom,
                bathroom,
                mode,
                amenities: uniqueItem,
              });
              await saveProgress({
                type,
                title,
                description,
                bed,
                bedroom,
                bathroom,
                mode,
                amenities: uniqueItem,
              });
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen3;
