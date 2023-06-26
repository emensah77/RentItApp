import React, {useCallback, useState} from 'react';
import {View, Image, Pressable, TextInput, SafeAreaView, FlatList, ScrollView} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import DividedProgress from '../../componentsV2/DataDisplay/DividedProgress';
import {offsets} from '../../styles/globalStyles';
import BottomActionsBar from '../../componentsV2/Inputs/BottomActionsBar';

const OnboardingScreen12 = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const [selectedItem, setSelectedItem] = useState(null);

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
    navigation.navigate('OnboardingScreen7');
  };
  const items = [
    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/fullhome.jpeg',
      title: 'Full Home',
      key: '1',
    },
    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/apartment.jpeg',
      title: 'Apartment',
      key: '2',
    },
    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/1bedroom.jpeg',
      title: 'Entire Flat',
      key: '3',
    },
    {
      image: 'https://i.insider.com/5ed812183ad861312272b2f5?width=700',
      title: 'Self-Contained',
      key: '4',
    },

    {
      image: 'https://pbs.twimg.com/media/CTbpP-AVEAARjVx.jpg',
      title: 'Mansion',
      key: '5',
    },

    {
      image: 'https://media-cdn.tripadvisor.com/media/photo-s/11/d7/82/0c/single-room.jpg',
      title: 'Single Room',
      key: '6',
    },

    {
      image: 'https://media-cdn.tripadvisor.com/media/photo-s/11/d7/82/0c/single-room.jpg',
      title: 'Chamber and Hall',
      key: '7',
    },
    {
      image: 'https://photos.zillowstatic.com/fp/fe45b984d1aca2ff57d2455ebcd8b95f-p_e.jpg',
      title: 'Condos',
      key: '8',
    },
    {
      image: 'https://photos.zillowstatic.com/fp/f1d119d24d4c011b9e3b7b177b1a6907-p_e.jpg',
      title: 'Villas',
      key: '9',
    },
    {
      image: 'https://photos.zillowstatic.com/fp/72a6b2bf4667a1ffa15ddccacd1ba124-p_e.jpg',
      title: 'Townhouse',
      key: '10',
    },
  ];

  const saveAndGo = useCallback(async item => {
    await saveProgress({homeType: item.title});
    navigation.navigate('OnboardingScreen7', {
      type: item.title,
    });
  }, []);

  const renderItem = useCallback(
    ({item}) => {
      return (
        <Pressable
          style={[styles.itemHome]}
          // eslint-disable-next-line react/jsx-no-bind
          onPress={async () => {
            setSelectedItem(item);
            // await saveAndGo(item)
          }}>
          <Typography
            style={{paddingLeft: 20}}
            bold
            style={item.key === selectedItem?.key && styles.selectedItemText}>
            {item.title}
          </Typography>
          <Image
            source={{uri: item.image}}
            style={[styles.itemImage, item.key === selectedItem?.key && styles.selectedItemImage]}
          />
        </Pressable>
      );
    },
    [selectedItem],
  );
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView>
      <View style={styles.mainContent}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={goBack}>
            <Image source={BackArrow} />
          </Pressable>
          <View style={styles.topButtons}>
            {/* <Pressable
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
            </Pressable> */}
            <Pressable style={styles.topButton} onPress={goFaqs}>
              <Typography style={styles.topButtonText}>FAQs</Typography>
            </Pressable>
          </View>
        </View>
        <Typography bold style={styles.title}>
          Which of these best describe your place?
        </Typography>
        <ScrollView>
          <FlatList data={items} renderItem={renderItem} />
          <View style={styles.bottomItem}></View>
        </ScrollView>
      </View>
      <View
        style={{
          width: wp(100),
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}>
        <View style={{paddingHorizontal: offsets.offsetB}}>
          <DividedProgress total={6} progress={2} style={{marginBottom: offsets.offsetB}} />
        </View>
        <BottomActionsBar
          leftText="Back"
          rightText="Next"
          rightAction={async () => {
            if (!selectedItem) {
              return;
            }
            await saveAndGo(selectedItem);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen12;
