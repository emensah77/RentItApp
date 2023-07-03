import React, {useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import Social from './Social';

import {Page, Input, Button, Divider} from '../../components';

const Email = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);

  const navigation = useNavigation();

  const goTo = useCallback(
    route => {
      navigation.navigate(route);
    },
    [navigation],
  );

  const submit = useCallback(async () => {
    if (error || !email) {
      return;
    }

    const query = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get()
      .catch(console.error);
    if (query && query.docs) {
      const authData = JSON.parse((await AsyncStorage.getItem('authentication::data')) || '{}');
      await AsyncStorage.setItem('authentication::data', JSON.stringify({...authData, email}));
      goTo(query.docs.length > 0 ? 'Password' : 'PhoneNumber');
    } else {
      setError('An unknown error occured. Try again');
    }
  }, [email, error, goTo]);

  const onEmailChange = useCallback(async _email => {
    setEmail(_email);

    if (/.+@.+\..+/.test(_email)) {
      setDisabled(false);
      setError('');
    } else {
      setDisabled(true);
      setError('Enter a valid email address');
    }
  }, []);

  return (
    <Page header="Log in or sign up">
      <Input
        placeholder="Email"
        type="email-address"
        value={email}
        error={error}
        onChange={onEmailChange}
      />

      <Button
        accessibilityLabel="Sign in or sign up"
        type="standard"
        disabled={disabled}
        onPress={submit}>
        Continue
      </Button>

      <Divider>or</Divider>

      <Social noEmail />
    </Page>
  );
};

export default Email;
