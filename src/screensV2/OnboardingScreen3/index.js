import React, {useCallback, useState} from 'react';
import {View, Image, Pressable, FlatList} from 'react-native';
import auth from '@react-native-firebase/auth';

import {useNavigation, useRoute} from '@react-navigation/native';

import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import Checkbox from '../../../assets/data/images/checkbox.svg';
import CheckboxActive from '../../../assets/data/images/checkbox-active.svg';

const OnboardingScreen3 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [uniqueItem, setUniqueItem] = useState([]);

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

  const goFaqs = () => {
    navigation.navigate('OnboardingScreen4');
  };

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
        Tell your guest what your place has to offer.
      </Typography>

      <View style={styles.placesList}>
        <Typography style={{marginBottom: 20}} bold>
          Amenities
        </Typography>
        <FlatList data={items} renderItem={renderItems} />
      </View>
    </View>
  );
};

export default OnboardingScreen3;
