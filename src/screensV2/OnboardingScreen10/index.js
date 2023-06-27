import React, {useState, useCallback} from 'react';
import {View, Image, Pressable, SafeAreaView, TextInput} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import {offsets} from '../../styles/globalStyles';
import DividedProgress from '../../componentsV2/DataDisplay/DividedProgress';
import BottomActionsBar from '../../componentsV2/Inputs/BottomActionsBar';

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
            <Pressable style={styles.topButton} onPress={async () => {}}>
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
        <View
          style={{
            width: wp(100),
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}
        >
          <View style={{paddingHorizontal: offsets.offsetB}}>
            <DividedProgress total={6} progress={5} style={{marginBottom: offsets.offsetB}} />
          </View>
          <BottomActionsBar
            leftText="Back"
            rightText="Next"
            rightAction={async () => {
              if (!value) {
                return;
              }
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
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen10;
