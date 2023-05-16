import React, {useCallback} from 'react';
import {Image, BackHandler} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Page, Button, Typography, Whitespace} from '../../components';
import logo from '../../assets/images/logo.png';
import {global} from '../../assets/styles';

const Agreement = () => {
  const navigation = useNavigation();

  const goToNotification = useCallback(async () => {
    const authData = await AsyncStorage.getItem('authentication::data');
    await AsyncStorage.setItem(
      'authentication::data',
      JSON.stringify({...authData, agreement: true}),
    );
    navigation.replace('Notification');
  }, [navigation]);

  return (
    <Page>
      <Image source={logo} style={global.largeIcon} />

      <Whitespace marginTop={40} />

      <Typography type="heading">Our community commitment</Typography>

      <Whitespace marginTop={8} />

      <Typography type="largeHeading">Rentit is a community where anyone can belong</Typography>

      <Whitespace marginTop={24} />

      <Typography type="standard">
        To ensure this, we&apos;re asking you to commit to the following:
      </Typography>

      <Whitespace marginTop={24} />

      <Typography type="standard">
        I agree to treat everyone in the Rentit community --regardless of their race, religon,
        national origin, ethnicity, skin color, disability, sex, gender identity, sexual orientation
        or age -- with respect, and without judgment or bias.
      </Typography>

      <Whitespace marginTop={64} />

      <Button type="standard" onPress={goToNotification}>
        Agree and continue
      </Button>

      <Button type="primary" onPress={BackHandler.exitApp}>
        Decline
      </Button>
    </Page>
  );
};

export default Agreement;
