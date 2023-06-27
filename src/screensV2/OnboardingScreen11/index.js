import React, {useState} from 'react';
import {View, Image, Pressable, TextInput, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import {offsets} from '../../styles/globalStyles';
import DividedProgress from '../../componentsV2/DataDisplay/DividedProgress';
import BottomActionsBar from '../../componentsV2/Inputs/BottomActionsBar';

const OnboardingScreen11 = () => {
  const navigation = useNavigation();

  const [value, setValue] = useState('');
  const route = useRoute();
  const title = route.params?.title;
  const type = route.params?.type;
  const bed = route.params?.bed;
  const bedroom = route.params?.bedroom;
  const bathroom = route.params?.bathroom;
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
    navigation.navigate('OnboardingScreen9');
  };
  const goBack = () => {
    navigation.goBack();
  };
  const hellod = text => {
    setValue(text);
  };
  return (
    <SafeAreaView>
      <View style={styles.mainContent}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={goBack}>
            <Image source={BackArrow} />
          </Pressable>
          <View style={styles.topButtons}>
            <Pressable style={styles.topButton} onPress={async () => {}}>
              <Typography style={styles.topButtonText}>Save & exit</Typography>
            </Pressable>
            <Pressable style={styles.topButton} onPress={goFaqs}>
              <Typography style={styles.topButtonText}>FAQs</Typography>
            </Pressable>
          </View>
        </View>

        <Typography bold style={styles.title}>
          Describe your home in detail.
        </Typography>

        <TextInput
          placeholder="Tell us about where your home is located,
          including landmarks and amenities available"
          onChangeText={text => hellod(text)}
          style={styles.input}
        />
        <View
          style={{
            width: wp(100),
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}>
          <View style={{paddingHorizontal: offsets.offsetB}}>
            <DividedProgress total={6} progress={6} style={{marginBottom: offsets.offsetB}} />
          </View>
          <BottomActionsBar
            leftText="Back"
            rightText="Next"
            rightAction={async () => {
              if (!value) {
                return;
              }
              await saveProgress({
                mode,
                title,
                type,
                bed,
                bedroom,
                bathroom,
                description: value,
              });
              navigation.navigate('OnboardingScreen14', {
                title,
                bed,
                bedroom,
                bathroom,
                description: value,
                type,
                mode,
              });
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen11;
