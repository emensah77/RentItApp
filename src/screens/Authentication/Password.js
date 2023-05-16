import React, {useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import {Page, Input, Button, Typography} from '../../components';

const Password = () => {
  const [password, setPassword] = useState('Password100%');
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);

  const navigation = useNavigation();

  const goToHome = useCallback(() => {
    navigation.reset('Home');
  }, [navigation]);

  const submit = useCallback(async () => {
    if (error || !password) {
      return;
    }

    const data = JSON.parse((await AsyncStorage.getItem('authentication::data')) || '{}');
    const signin = await auth()
      .signInWithEmailAndPassword(data.email, password)
      .catch(e => {
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

    // Firebase's onAuthStateChanged will fire and make this redundant
    if (signin) {
      setTimeout(() => {
        goToHome();
      }, 1000);
    }
  }, [password, error, goToHome]);

  const onPasswordChange = useCallback(async _password => {
    setPassword(_password);

    const data = JSON.parse((await AsyncStorage.getItem('authentication::data')) || '{}');
    if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{6,}$/.test(_password)) {
      setDisabled(false);
      await AsyncStorage.setItem(
        'authentication::data',
        JSON.stringify({...data, password: _password}),
      );
      setError('');
    } else {
      setDisabled(true);
      await AsyncStorage.setItem('authentication::data', JSON.stringify({...data, email: ''}));
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

      <Button type="standard" disabled={disabled} onPress={submit}>
        Log in
      </Button>

      <Typography>Reset your password</Typography>
    </Page>
  );
};

export default Password;
