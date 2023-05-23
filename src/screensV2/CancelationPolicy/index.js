import React from 'react';
import {View, FlatList, Text, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {styles} from './styles';

import Typography from '../../componentsV2/DataDisplay/Typography';
import PrivacyItem from '../../componentsV2/DataDisplay/PrivacyItem';
import CircleButton from '../../componentsV2/Inputs/CircleButton';
import Divider from '../../componentsV2/DataDisplay/Divider';

const CancelationPolicy = () => {
  const navigation = useNavigation();

  const privacyData = [
    {date: '25 Oct', time: '16:00', text: 'Full refund: Get back 100% of what you paid'},
    {
      date: '25 Oct',
      time: '16:00',
      text: 'Partial refund: Get back 50% of every night but the first one. No refund of the first night or the service fee',
      checkIn: '(check-in)',
    },
  ];

  const renderItem = ({item}) => {
    return (
      <>
        <PrivacyItem item={item} />
        <Divider />
      </>
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.mainContent]}>
      <CircleButton onPress={goBack} />
      <Typography
        variant="xlarge"
        bold
        style={{textAlign: 'center', paddingTop: 40, marginBottom: 52}}>
        Cancelation policy
      </Typography>
      <Typography variant="large">
        Before you book, make sure you’re comfortable with the Host’s cancellation policy. Keep in
        mind that Renit’s Extenuating Circumstance policy doesn’t cover cancellations due to illness
        or travel disruptions caused by COVID-19.
      </Typography>
      <Typography variant="large" bold style={{marginTop: 35, marginBottom: 30}}>
        Cancel by
      </Typography>
      <FlatList data={privacyData} renderItem={renderItem} keyExtractor={item => item.id} />
      <Text style={styles.polictyText}>Learn more about cancellation policies</Text>
    </View>
  );
};

export default CancelationPolicy;
