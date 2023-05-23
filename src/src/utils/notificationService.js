import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {navigate} from '../navigation/Router';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.debug('Authorization Status:', authStatus);
    getFcmToken();
  }
}

export const getFcmToken = async () => {
  const fcmToken = await AsyncStorage.getItem('fcmToken');

  if (!fcmToken) {
    try {
      const newFcmToken = await messaging().getToken();
      // logic for the new installed app on device
      if (newFcmToken) {
        await AsyncStorage.setItem('fcmToken', newFcmToken);
        console.debug('New Token:', newFcmToken);
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    console.debug('Old Token:', fcmToken);
  }
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    // console.debug(
    //   'Notification caused app to open from background state:',
    //   remoteMessage,
    // );
    navigate('Post', remoteMessage.data);
  });

  messaging().onMessage(async (/* remoteMessage */) => {
    // console.debug('received in foreground', remoteMessage),
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        // console.debug(
        //   'Notification caused app to open from quit state:',
        //   remoteMessage,
        // );
        navigate('Post', remoteMessage.data);
      }
    });
};

export default requestUserPermission;
