import React, {useCallback, useState} from 'react';
import {View, Image, Pressable, TextInput, FlatList, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';

import {useNavigation, useRoute} from '@react-navigation/native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import {offsets} from '../../styles/globalStyles';
import DividedProgress from '../../componentsV2/DataDisplay/DividedProgress';
import BottomActionsBar from '../../componentsV2/Inputs/BottomActionsBar';

const OnboardingScreen7 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [checkItem, setCheckItem] = useState(0);
  const [isSelected, setisSelected] = useState(false);
  const [mode, setMode] = useState('');

  const type = route.params?.type;
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
      isSelected,
      title: 'For Rent',
      text: 'You are renting your home to tenants, and require monthly payments and offering a stay limited by a time agreed upon.',
    },
    {
      id: 2,
      title: 'For Sale',
      isSelected,
      text: 'You are selling your home for a stipulated amount and are not offering a stay limited by time.',
    },
  ];
  const checkData = (id, isSelect, title) => {
    setCheckItem(id);
    setisSelected(!isSelect);
    setMode(title);
  };
  const renderItems = useCallback(
    ({item}) => {
      return (
        <Pressable
          style={[styles.itemData, item.id === checkItem ? styles.itemCheckData : '']}
          onPress={() => checkData(item.id, item.isSelected, item.title)}
        >
          <Typography bold>{item.title}</Typography>
          <Typography style={{color: '#4D4D4D'}}>{item.text}</Typography>
        </Pressable>
      );
    },
    [checkItem],
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
            <Pressable
              style={styles.topButton}
              // eslint-disable-next-line react/jsx-no-bind
              onPress={async () => {}}
            >
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
      <View
        style={{
          width: wp(100),
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
      >
        <View style={{paddingHorizontal: offsets.offsetB}}>
          <DividedProgress total={6} progress={3} style={{marginBottom: offsets.offsetB}} />
        </View>
        <BottomActionsBar
          leftText="Back"
          rightText="Next"
          rightAction={async () => {
            if (!isSelected) {
              return;
            }
            await saveProgress({homeType: type, mode});
            navigation.navigate('OnboardingScreen2', {
              type,
              mode,
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen7;
