import React, {useCallback, useState} from 'react';
import {View, Image, Pressable, FlatList} from 'react-native';
import auth from '@react-native-firebase/auth';

import {useNavigation, useRoute} from '@react-navigation/native';

import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import PlusIcon from '../../../assets/data/images/icons/plus-icon.svg';
import CameraIcon from '../../../assets/data/images/icons/camera-icon.svg';
import {TextInput} from 'react-native-gesture-handler';

const OnboardingScreen5 = () => {
  const navigation = useNavigation();
  const [currencyItem, setCurrencyItem] = useState(2);
  const [currencyData, setCurrencyData] = useState('1');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSelected, setisSelected] = useState(false);
  const [homeprice, sethomeprice] = useState(1);
  const [value, setValue] = useState(1);
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
  const [currency, setCurrency] = useState('');

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
    if (type === 'minus' && currencyData > 1) {
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

        <Typography style={{textAlign: 'center', paddingTop: 20, paddingBottom: 20}}>
          Places like yours in your area usually ranges froom 200gh to 400gh
        </Typography>
      </View>
    </View>
  );
};

export default OnboardingScreen5;
