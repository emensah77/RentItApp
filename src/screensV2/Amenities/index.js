import React, {useCallback} from 'react';
import {View, FlatList, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import CircleButton from '../../componentsV2/Inputs/CircleButton';
import AmenitiesItem from '../../componentsV2/DataDisplay/AmentiesItem/index';
import Typography from '../../componentsV2/DataDisplay/Typography';
import {offsets} from '../../styles/globalStyles';

import {styles} from './styles';

import Divider from '../../componentsV2/DataDisplay/Divider';
import Icon1 from '../../../assets/data/images/icons/amenities/icon1.png';
import Icon2 from '../../../assets/data/images/icons/amenities/icon2.png';
import Icon3 from '../../../assets/data/images/icons/amenities/icon3.png';
import Icon4 from '../../../assets/data/images/icons/amenities/icon4.png';
import Icon5 from '../../../assets/data/images/icons/amenities/icon5.png';
import Icon6 from '../../../assets/data/images/icons/amenities/icon6.png';

const Amenities = () => {
  const navigation = useNavigation();
  const data = [
    {
      image: 1,
      text: 'Bathroom',
    },
    {
      image: 2,
      text: 'Hair dryer',
    },
    {
      image: 3,
      text: 'Cleaning products',
    },
    {
      image: 4,
      text: 'Shampoo',
    },
    {
      image: 5,
      text: 'Conditioner',
    },
    {
      image: 6,
      text: 'Body soap',
    },
    {
      image: 7,
      text: 'Hot water',
    },
  ];

  const goBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const renderItem = useCallback(({item}) => {
    return (
      <>
        <AmenitiesItem image={item.image} text={item.text} />
        <Divider />
      </>
    );
  }, []);

  const keyExtractor = useCallback(item => item.id, []);

  return (
    <SafeAreaView>
      <View style={styles.mainContent}>
        <CircleButton onPress={goBack} />
        <Typography
          variant="headingLarge"
          bold
          style={{marginTop: offsets.offsetC, marginBottom: 40}}
        >
          Amenities
        </Typography>
        <Typography variant="large" bold style={{marginBottom: 20}}>
          Bathroom
        </Typography>
        <View style={styles.amenitiesList}>
          <FlatList data={data} renderItem={renderItem} keyExtractor={keyExtractor} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Amenities;
