import React, {useState, useCallback} from 'react';
import {View, Image, Pressable, SafeAreaView, TextInput} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';

import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';

const OnboardingScreen10 = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const [value, setValue] = useState('');
  const type = route.params?.type;
  const mode = route.params?.mode;
  const bed = route.params?.bed;
  const bedroom = route.params?.bedroom;
  const bathroom = route.params?.bathroom;
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
    navigation.navigate('OnboardingScreen11');
  };
  const hellod = text => {
    setValue(text);
  };
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
            <Pressable
              style={styles.topButton}
              onPress={async () => {
                await saveProgress({
                  title: value,
                  type,
                  bed,
                  bedroom,
                  bathroom,
                  mode,
                });
                navigation.navigate('OnboardingScreen11', {
                  type,
                  bed,
                  bedroom,
                  bathroom,
                  title: value,
                  mode,
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
          Let's give your place a title.
        </Typography>

        <TextInput
          placeholder="Eg. Beautiful 3 bedroom flat "
          style={styles.input}
          onChangeText={text => hellod(text)}
        />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen10;
