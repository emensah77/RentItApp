import React, {useCallback, useState, useEffect} from 'react';
import {Image, Platform, PermissionsAndroid, Linking} from 'react-native';
import Permissions from 'react-native-permissions';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

import {
  Page,
  Button,
  Typography,
  Whitespace,
  Container,
  Error,
  PageSpinner,
} from '../../components';
import {global} from '../../assets/styles';
import notificationImg from '../../assets/images/notification.png';
import switchOff from '../../assets/images/switch-off.png';
import switchOn from '../../assets/images/switch-on.png';

const Notification = () => {
  const [enabled, setEnabled] = useState(null);
  const [count, setCount] = useState(1);
  const [error, setError] = useState('');

  const navigation = useNavigation();

  const goToHome = useCallback(
    async _enabled => {
      const {
        email,
        firstname,
        lastname,
        birthDay,
        phoneNumber,
        password,
        profilePicture,
        marketing,
        agreement,
        provider,
        location,
        providerCredential,
      } = JSON.parse((await AsyncStorage.getItem('authentication::data')) || '{}');
      const newData = {
        fname: firstname,
        lname: lastname,
        email,
        phoneNumber: phoneNumber || '',
        birthDay: birthDay || '',
        userImg: profilePicture || '',
        marketing: marketing || false,
        agreement: agreement || true,
        notification: _enabled || enabled,
        location,
        type: 'default',
        createdAt: firestore.Timestamp.fromDate(new Date()),
      };
      if (provider && providerCredential) {
        await auth().signInWithCredential(providerCredential).catch(console.error);
        await firestore()
          .collection('users')
          .doc(auth().currentUser.uid)
          .set({...newData, location: location || false})
          .catch(console.error);
        return setTimeout(() => navigation.replace('Home'), 1000);
      }

      const authenticated = await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          return firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .set({...newData, uid: auth().currentUser.uid})
            .catch(e => {
              console.error(
                'Something went wrong with adding user to firestore: ',
                e,
                JSON.stringify(e),
              );
              setError('An error occurred while setting up your account.');
            });
        })
        .catch(e => {
          console.error('Something went wrong with sign up: ', e, JSON.stringify(e));
          switch (e.code) {
            case 'auth/email-already-in-use':
              setError('You appear to already have an account, try signing in instead.');
              break;
            case 'auth/invalid-email':
              setError('The email address is invalid.');
              break;
            case 'auth/operation-not-allowed':
              setError('An error occurred while creating your account.');
              break;
            case 'auth/weak-password':
              setError(
                'Password is not strong enough. Add additional characters including special characters and numbers.',
              );
              break;
            default:
              setError(e.message);
              break;
          }
        });

      if (authenticated) {
        return setTimeout(() => navigation.reset('Home'), 400);
      }
    },
    [navigation, enabled, setError],
  );

  const init = useCallback(async () => {
    return (
      Platform.OS === 'ios'
        ? Permissions.request('notification')
        : PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.SEND_SMS)
    )
      .then(async grant => {
        await messaging().requestPermission();
        const authStatus = await messaging().hasPermission();
        return (
          grant === 'authorized' ||
          grant === PermissionsAndroid.RESULTS.GRANTED ||
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
      })
      .catch(console.error);
  }, []);

  const request = useCallback(async () => {
    const notification = await init();

    setCount(count + 1);
    setEnabled(notification);
    const data = JSON.parse((await AsyncStorage.getItem('authentication::data')) || '{}');
    await AsyncStorage.setItem('authentication::data', JSON.stringify({...data, notification}));

    if (!notification && count > 2) {
      Linking.openSettings();
      return notification;
    }
    setTimeout(goToHome, 1000);
    return notification;
  }, [count, goToHome, init]);

  useEffect(() => {
    (async () => {
      const notification = await init();

      setEnabled(!!notification);
      if (notification) {
        return goToHome(notification);
      }
    })();
  }, [goToHome, init]);

  if (enabled === null) {
    return <PageSpinner />;
  }

  return (
    <Page>
      <Image source={notificationImg} style={global.largeIcon} />

      <Typography type="largeHeading">Turn on notifications?</Typography>

      <Whitespace marginTop={24} />

      <Typography type="heading" width="100%">
        Don&apos;t miss important messages like check-in details and account activity
      </Typography>

      <Whitespace marginTop={28} />

      <Container row type="spaceBetween">
        <Typography type="heading">
          Get travel deals, personalized recommendations, and more
        </Typography>
        <Whitespace marginLeft={-100} />
        <Image
          onPress={request}
          source={enabled ? switchOn : switchOff}
          style={global.mediumIcon}
        />
      </Container>

      <Whitespace marginTop={64} />

      <Error text={error} />

      <Whitespace marginBottom={-30} />

      <Button type="standard" onPress={request} fitWidth>
        Yes, notify me
      </Button>

      <Button type="primary" onPress={goToHome} fitWidth>
        Skip
      </Button>
    </Page>
  );
};

export default Notification;
