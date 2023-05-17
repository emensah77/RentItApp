import React, {useCallback, useState} from 'react';
import {Image, Platform, PermissionsAndroid, Linking} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Permissions from 'react-native-permissions';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {Page, Button, Typography, Whitespace, Container, Error} from '../../components';
import {global} from '../../assets/styles';
import notificationImg from '../../assets/images/notification.png';
import switchOff from '../../assets/images/switch-off.png';
import switchOn from '../../assets/images/switch-on.png';

const Notification = () => {
  const [enabled, setEnabled] = useState(false);
  const [count, setCount] = useState(1);
  const [error, setError] = useState('');

  const navigation = useNavigation();

  const goToHome = useCallback(async () => {
    const data = JSON.parse((await AsyncStorage.getItem('authentication::data')) || '{}');
    const {email, firstname, lastname, birthDay, password, profilePicture, marketing} = data;
    const authenticated = await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        return firestore()
          .collection('users')
          .doc(auth().currentUser.uid)
          .set({
            fname: firstname,
            lname: lastname,
            email,
            birthDay,
            userImg: profilePicture,
            marketing,
            createdAt: firestore.Timestamp.fromDate(new Date()),
          })
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
      navigation.replace('Home');
    }
  }, [navigation, setError]);

  const request = useCallback(async () => {
    let notification;
    if (Platform.OS === 'ios') {
      notification = Permissions.request('notification')
        .then(async response => {
          if (response === 'authorized') {
            // Permission granted
            console.debug('Permission for notification granted.');
            return true;
          } else {
            const authStatus = await messaging().requestPermission();
            return (
              authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
              authStatus === messaging.AuthorizationStatus.PROVISIONAL
            );
          }
        })
        .catch(console.error);
    } else {
      console.debug(
        'Permission starting.',
        PermissionsAndroid,
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
      );
      // Request permission to send notifications
      notification = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.SEND_SMS)
        .then(async granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // Permission granted
            console.debug('Permission for notification granted.');
            return true;
          } else {
            const authStatus = await messaging().hasPermission();
            return (
              authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
              authStatus === messaging.AuthorizationStatus.PROVISIONAL
            );
          }
        })
        .catch(console.error);
    }

    setCount(count + 1);
    setEnabled(notification);
    const data = await AsyncStorage.getItem('authentication::data');
    await AsyncStorage.setItem('authentication::data', JSON.stringify({...data, notification}));

    if (!notification && count > 1) {
      return Linking.openSettings();
    }
    setTimeout(goToHome, 1000);
  }, [count, goToHome]);

  return (
    <Page>
      <Image source={notificationImg} style={global.largeIcon} />

      <Typography type="largeHeading">Turn on notifications?</Typography>

      <Whitespace marginTop={24} />

      <Typography type="heading">
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
