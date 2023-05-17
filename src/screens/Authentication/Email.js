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

    const query = await firestore().collection('users').where('email', '==', email).get();
    goTo(query.docs.length > 0 ? 'Password' : 'PhoneNumber');
  }, [email, error, goTo]);

  const onEmailChange = useCallback(async _email => {
    setEmail(_email);

    const auth = JSON.parse((await AsyncStorage.getItem('authentication::data')) || '{}');
    if (/.+@.+\..+/.test(_email)) {
      setDisabled(false);
      await AsyncStorage.setItem('authentication::data', JSON.stringify({...auth, email: _email}));
      setError('');
    } else {
      setDisabled(true);
      await AsyncStorage.setItem('authentication::data', JSON.stringify({...auth, email: ''}));
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

      <Button type="standard" disabled={disabled} onPress={submit}>
        Continue
      </Button>

      <Divider>or</Divider>

      <Social noEmail />
    </Page>
  );
};

export default Email;
