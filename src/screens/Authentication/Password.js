import React, {useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {Page, Input, Button, Typography} from '../../components';

const Password = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const goTo = useCallback(
    route => {
      navigation[route === 'Home' ? 'reset' : 'navigate'](route);
    },
    [navigation],
  );

  const submit = useCallback(async () => {
    if (error || !password) {
      return;
    }

    setLoading(true);

    const data = JSON.parse((await AsyncStorage.getItem('authentication::data')) || '{}');
    const signin = await auth()
      .signInWithEmailAndPassword(data.email, password)
      .catch(async e => {
        console.error('Something went wrong with log in: ', e, JSON.stringify(e));
        switch (e.code) {
          case 'auth/wrong-password':
            setError('You entered the wrong email and password combination. Try again');
            break;
          default:
            setError(e.message);
            break;
        }
      });

    setLoading(false);

    if (signin) {
      const query = await firestore()
        .collection('users')
        .where('email', '==', data.email)
        .get()
        .catch(console.error);
      let route = 'Home';
      if (query && query.docs && query.docs.length > 0) {
        const {_data} = query.docs[0];
        const {
          fname: firstname,
          lname: lastname,
          email: _email,
          phoneNumber,
          birthDay,
          userImg: profilePicture,
          marketing,
          agreement,
          notification,
        } = _data;

        await AsyncStorage.setItem(
          'authentication::data',
          JSON.stringify({
            email: _email,
            firstname,
            lastname,
            birthDay,
            phoneNumber,
            profilePicture,
            marketing,
            agreement,
            notification,
          }),
        );

        if (!notification) {
          route = 'Notification';
        }

        if (!agreement) {
          route = 'Agreement';
        }

        if (!_email || !firstname || !lastname || !birthDay) {
          route = 'Finish';
        }
      }

      // This will throw an error because firebase's `onAuthStateChange`
      // will fire in Route.js
      // The router stack, should be rearranged into 1 single stack as
      // a fix for it
      setTimeout(() => {
        goTo(route);
      }, 1000);
    }
  }, [password, error, goTo]);

  const onPasswordChange = useCallback(async _password => {
    setPassword(_password);

    if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{6,}$/.test(_password)) {
      setDisabled(false);
      setError('');
    } else {
      setDisabled(true);
      setError('Enter a valid email address');
    }
  }, []);

  return (
    <Page header="Log in">
      <Input
        placeholder="Password"
        type="password"
        value={password}
        error={error}
        onChange={onPasswordChange}
      />

      <Button type="standard" disabled={disabled} loading={loading} onPress={submit}>
        Log in
      </Button>

      <Typography>Reset your password</Typography>
    </Page>
  );
};

export default Password;
