import React, {useCallback, useState} from 'react';
import {View, Image, Pressable, FlatList, SafeAreaView, ScrollView} from 'react-native';
import auth from '@react-native-firebase/auth';

import {useNavigation, useRoute} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import {offsets} from '../../styles/globalStyles';
import DividedProgress from '../../componentsV2/DataDisplay/DividedProgress';
import BottomActionsBar from '../../componentsV2/Inputs/BottomActionsBar';

const OnboardingScreen5 = () => {
  const navigation = useNavigation();
  const [currencyItem, setCurrencyItem] = useState(2);
  const [currencyData, setCurrencyData] = useState('200');

  const [value, setValue] = useState(200);
  const route = useRoute();
  const title = route.params?.title;
  const type = route.params?.type;
  const description = route.params?.description;
  const bed = route.params?.bed;
  const bedroom = route.params?.bedroom;
  const bathroom = route.params?.bathroom;
  const imageUrls = route.params?.imageUrls;
  const mode = route.params?.mode;
  const amenities = route.params?.amenities;

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
    navigation.navigate('OnboardingScreen6');
  };

  // const hellod = text => {
  //   setValue(parseInt(text));

  //   sethomeprice(value);
  // };

  // const setHomePrice = () => {};
  // const handle = () => {
  //   setCurrency('usd');
  // };
  // const handle1 = () => {
  //   setCurrency('ghs');
  // };
  const currencyDataItem = [
    {text: 'US Dollar', id: 1},
    {text: 'Ghana Cedis', id: 2},
  ];
  const changeItem = useCallback(id => {
    setCurrencyItem(id);
  }, []);

  const changeCount = type => {
    if (type === 'minus' && currencyData > 200) {
      setCurrencyData(Number(currencyData) - 1);
    }
    if (type === 'plus') {
      setCurrencyData(Number(currencyData) + 1);
    }
  };

  const renderItems = useCallback(
    ({item}) => {
      return (
        <Pressable
          style={[styles.currencyBlock, currencyItem === item.id ? styles.currencySelect : '']}
          onPress={() => changeItem(item.id)}>
          <Typography
            style={[currencyItem === item.id ? styles.selectText : '', styles.textStyle]}
            bold>
            {item.text}
          </Typography>
        </Pressable>
      );
    },
    [currencyItem],
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
              onPress={async () => {
                await saveProgress({
                  title,
                  type,
                  description,
                  bed,
                  bedroom,
                  bathroom,
                  imageUrls,
                  homeprice: value,
                  mode,
                  amenities,
                  currencyData,
                });
              }}>
              <Typography style={styles.topButtonText}>Save & exit</Typography>
            </Pressable>
            <Pressable style={styles.topButton} onPress={goFaqs}>
              <Typography style={styles.topButtonText}>FAQs</Typography>
            </Pressable>
          </View>
        </View>

        <ScrollView>
          <Typography bold style={styles.title}>
            Let’s set the price of your home
          </Typography>
          <Typography style={styles.titleText}>You can change it anytime.</Typography>
          <FlatList data={currencyDataItem} renderItem={renderItems} />

          <View style={styles.currencyContent}>
            <View style={styles.currencyType}>
              <Pressable onPress={() => changeCount('minus')} style={styles.changeMinus}>
                <Typography style={styles.textMinus}>-</Typography>
              </Pressable>
              <TextInput
                value={String(currencyData)}
                onChange={e => setCurrencyData(Number(e.target.value))}
                name="currencyData"
                style={styles.currencyInput}
              />
              <Pressable onPress={() => changeCount('plus')} style={styles.changeMinus}>
                <Typography style={styles.textMinus}>+</Typography>
              </Pressable>
            </View>
            <Typography style={{textAlign: 'center'}}>per month</Typography>

            <Typography style={styles.placesText}>
              Places like yours in your area usually ranges from 200gh to 400gh
            </Typography>
          </View>
        </ScrollView>
        <View
          style={{
            width: wp(100),
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}>
          <View style={{paddingHorizontal: offsets.offsetB}}>
            <DividedProgress total={4} progress={3} style={{marginBottom: offsets.offsetB}} />
          </View>
          <BottomActionsBar
            leftText="Back"
            rightText="Next"
            rightAction={async () => {
              await saveProgress({
                title,
                type,
                description,
                bed,
                bedroom,
                bathroom,
                imageUrls,
                homeprice: value,
                mode,
                amenities,
                currencyData,
              });
              navigation.navigate('OnboardingScreen6', {
                title,
                type,
                description,
                bed,
                bedroom,
                bathroom,
                imageUrls,
                homeprice: value,
                mode,
                amenities,
                currencyData,
              });
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen5;
