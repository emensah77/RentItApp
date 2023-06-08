import React, {useCallback, useState} from 'react';
import {View, Image, Pressable, TextInput, FlatList} from 'react-native';
import auth from '@react-native-firebase/auth';

import {useNavigation} from '@react-navigation/native';

import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import InputField from '../../componentsV2/Inputs/InputField';

const OnboardingScreen7 = () => {
  const navigation = useNavigation();
  const [checkItem, setCheckItem] = useState(0);

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
    navigation.navigate('OnboardingScreen8');
  };
  const data = [
    {
      id: 1,
      title: 'For Rent',
      text: 'You are renting your home to tenants, and require monthly payments and offering a stay limited by a time agreed upon.',
    },
    {
      id: 2,
      title: 'For Sale',
      text: 'You are selling your home for a stipulated amount and are not offering a stay limited by time.',
    },
  ];
  const checkData = id => {
    setCheckItem(id);
  };
  const renderItems = useCallback(
    ({item}) => {
      return (
        <Pressable
          style={[styles.itemData, item.id === checkItem ? styles.itemCheckData : '']}
          onPress={() => checkData(item.id)}>
          <Typography bold>{item.title}</Typography>
          <Typography style={{color: '#4D4D4D'}}>{item.text}</Typography>
        </Pressable>
      );
    },
    [checkItem],
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
        Are you renting or selling your home?
      </Typography>
      <FlatList data={data} renderItem={renderItems} />
    </View>
  );
};

export default OnboardingScreen7;
