import React, {useEffect, useState} from 'react';
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
import {useNavigation, useRoute} from '@react-navigation/native';

import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from 'react-native-vector-icons/Fontisto';
import auth from '@react-native-firebase/auth';
import styles from './styles.js';

const OnboardingScreen2 = props => {
  const navigation = useNavigation();
  const [bed, setbed] = useState(0);
  const [bedroom, setbedroom] = useState(0);
  const [bathroom, setbathroom] = useState(0);
  const route = useRoute();
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

  const items = [
    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/fullhome.jpeg',
      title: 'Bed',
      key: '1',
    },
    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/apartment.jpeg',
      title: 'Bedrooms',
      key: '2',
    },
    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/1bedroom.jpeg',
      title: 'Bathrooms',
      key: '3',
    },
  ];

  return (
    <LinearGradient
      colors={['blue', 'deeppink']}
      start={{x: 0.1, y: 0.2}}
      end={{x: 1, y: 0.5}}
      style={styles.container}
    >
      <StatusBar hidden />
      <Pressable onPress={() => navigation.goBack()}>
        <Fontisto name="angle-left" size={25} style={{color: 'white', margin: 20, marginTop: 30}} />
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.text_header}> How many bedrooms {'\n'} and bathrooms </Text>
      </View>

      <Animatable.View
        useNativeDriver
        animation="fadeInUpBig"
        duration={1500}
        style={styles.footer}
      >
        <ScrollView>
          <View style={styles.row}>
            <View>
              <Text style={{fontSize: 18, fontFamily: 'Montserrat-Regular'}}>Beds</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Pressable onPress={() => setbed(Math.max(0, bed - 1))} style={styles.button1}>
                <Text style={{fontSize: 20, color: 'black'}}>-</Text>
              </Pressable>

              <Text style={{marginHorizontal: 20, fontSize: 20}}>{bed}</Text>

              <Pressable onPress={() => setbed(bed + 1)} style={styles.button1}>
                <Text style={{fontSize: 20, color: 'black'}}>+</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.row}>
            <View>
              <Text style={{fontSize: 18, fontFamily: 'Montserrat-Regular'}}>Bedrooms</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Pressable
                onPress={() => setbedroom(Math.max(0, bedroom - 1))}
                style={styles.button1}
              >
                <Text style={{fontSize: 20, color: 'black'}}>-</Text>
              </Pressable>

              <Text style={{marginHorizontal: 20, fontSize: 20}}>{bedroom}</Text>

              <Pressable onPress={() => setbedroom(bedroom + 1)} style={styles.button1}>
                <Text style={{fontSize: 20, color: 'black'}}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.row}>
            <View>
              <Text style={{fontSize: 18, fontFamily: 'Montserrat-Regular'}}>Bathrooms</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Pressable
                onPress={() => setbathroom(Math.max(0, bathroom - 1))}
                style={styles.button1}
              >
                <Text style={{fontSize: 20, color: 'black'}}>-</Text>
              </Pressable>

              <Text style={{marginHorizontal: 20, fontSize: 20}}>{bathroom}</Text>

              <Pressable onPress={() => setbathroom(bathroom + 1)} style={styles.button1}>
                <Text style={{fontSize: 20, color: 'black'}}>+</Text>
              </Pressable>
            </View>
          </View>

          <TouchableOpacity
            disabled={bedroom === 0}
            onPress={async () => {
              await saveProgress({
                type,
                mode,
                bedroom,
                bathroom,
                bed,
              });
              navigation.navigate('OnboardingScreen9', {
                type,
                mode,
                bed,
                bedroom,
                bathroom,
              });
            }}
            style={{
              left: 250,
              width: 100,
              backgroundColor: 'deeppink',
              borderRadius: 20,
              opacity: bedroom === 0 ? 0.4 : 1,
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontFamily: 'Montserrat-Bold',
                fontSize: 18,
              }}
            >
              Next
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animatable.View>
    </LinearGradient>
  );
};

export default OnboardingScreen2;
