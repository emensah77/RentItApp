import React, {useCallback} from 'react';
import {View, Pressable, Image, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Typography from '../../componentsV2/DataDisplay/Typography';
import {styles} from './styles';
import ArrowLink from '../../componentsV2/DataDisplay/ArrowLink';
import Divider from '../../componentsV2/DataDisplay/Divider';
import CloseIcon from '../../../assets/data/images/icons/close-icon.png';

const SelectReason = () => {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  const goCancelationScreen = () => {
    navigation.navigate('Cancelation');
  };
  const data = [
    {text: 'I no longer need  accommodations'},
    {text: 'I made the reservation by accident'},
    {text: 'My host needs to cancel'},
    {text: 'I’m uncomfortable with the host'},
    {text: 'My travel dates changed'},
    {text: 'Other'},
  ];
  const keyExtractor = useCallback(item => item.id, []);
  const cancelationItem = useCallback(({item}) => {
    return (
      <>
        <ArrowLink text={item.text} onPress={goCancelationScreen} />
        <Divider />
      </>
    );
  }, []);
  return (
    <View style={styles.mainContent}>
      <Pressable style={{marginBottom: 36}} onPress={goBack}>
        <Image source={CloseIcon} width={24} height={24} />
      </Pressable>
      <Typography variant="xlarge" bold style={{marginBottom: 30}}>
        Please select a reason
      </Typography>
      <FlatList data={data} renderItem={cancelationItem} keyExtractor={keyExtractor} />
      {/*
      <ArrowLink text={'I made the reservation by accident'} onPress={goCancelationScreen} />
      <Divider />
      <ArrowLink text={'My host needs to cancel'} onPress={goCancelationScreen} />
      <Divider />
      <ArrowLink text={'I’m uncomfortable with the host'} onPress={goCancelationScreen} />
      <Divider />
      <ArrowLink text={'My travel dates changed'} onPress={goCancelationScreen} />
      <Divider />
      <ArrowLink text={'Other'} onPress={goCancelationScreen} />
      <Divider /> */}
    </View>
  );
};

export default SelectReason;
