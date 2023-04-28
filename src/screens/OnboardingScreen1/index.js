import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';
import { useNavigation, useRoute } from '@react-navigation/native';

import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from 'react-native-vector-icons/Fontisto';
import auth from '@react-native-firebase/auth';
import styles from './styles.js';

const OnboardingScreen1 = (props) => {
  const navigation = useNavigation();
  const [uploadProgress, setUploadProgress] = useState({});
  const route = useRoute();

  const saveProgress = async progressData => {
    try {
      const user = auth().currentUser;
      const screenName = route.name;
      const userId = user.uid;
      await fetch(
        'https://a27ujyjjaf7mak3yl2n3xhddwu0dydsb.lambda-url.us-east-2.on.aws/',
        {
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
        },
      );
    } catch (error) {
      console.error('Error saving progress:', error);
    }
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
      image:
        'https://media-cdn.tripadvisor.com/media/photo-s/11/d7/82/0c/single-room.jpg',
      title: 'Single Room',
      key: '6',
    },

    {
      image:
        'https://media-cdn.tripadvisor.com/media/photo-s/11/d7/82/0c/single-room.jpg',
      title: 'Chamber and Hall',
      key: '7',
    },
    {
      image:
        'https://photos.zillowstatic.com/fp/fe45b984d1aca2ff57d2455ebcd8b95f-p_e.jpg',
      title: 'Condos',
      key: '8',
    },
    {
      image:
        'https://photos.zillowstatic.com/fp/f1d119d24d4c011b9e3b7b177b1a6907-p_e.jpg',
      title: 'Villas',
      key: '9',
    },
    {
      image:
        'https://photos.zillowstatic.com/fp/72a6b2bf4667a1ffa15ddccacd1ba124-p_e.jpg',
      title: 'Townhouse',
      key: '10',
    },
  ];

  return (
    <LinearGradient
      colors={['purple', 'deeppink']}
      start={{x: 0.1, y: 0.2}}
      end={{x: 1, y: 0.5}}
      style={styles.container}>
      <StatusBar hidden />
      <Pressable onPress={() => navigation.goBack()}>
        <Fontisto
          name="angle-left"
          size={25}
          style={{color: 'white', margin: 20, marginTop: 30}}
        />
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.text_header}>
{' '}
Tell us about{'\n'}
{' '}
your home
{' '}
</Text>
      </View>

      <Animatable.View
        useNativeDriver
        animation="fadeInUpBig"
        duration={1500}
        style={styles.footer}
      >
        <ScrollView>
          <Text style={{fontSize: 18, fontFamily: 'Montserrat-Bold'}}>
            {' '}
            Select the type
            {'\n'}
{' '}
of your home{' '}
          </Text>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={async () => {
                  await saveProgress({homeType: item.title});
                  navigation.navigate('OnboardingScreen10', {
                    type: item.title,
                  });
                }}>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={{fontWeight: 'bold'}}>{item.title}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FastImage
                    source={{
                      uri: item.image,
                      headers: {Authorization: 'token'},
                      priority: FastImage.priority.high,
                    }}
                    style={{
                      height: 70,
                      width: 70,
                      borderRadius: 15,
                      resizeMode: 'cover',
                    }}
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      </Animatable.View>
    </LinearGradient>
  );
};

export default OnboardingScreen1;
