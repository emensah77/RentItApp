import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
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

export const storeFcmTokenInFirestore = async (userId, fcmToken) => {
  try {
    // Store the FCM token in Firestore
    await firestore().collection('deviceFcms').doc(userId).set(
      {
        deviceToken: fcmToken,
        userId,
      },
      {merge: true},
    ); // Use merge to avoid overwriting other fields

    console.debug('FCM Token stored in Firestore:', fcmToken);
  } catch (error) {
    console.error('Error storing FCM token in Firestore:', error);
  }
};

export const getFcmToken = async () => {
  const fcmToken = await AsyncStorage.getItem('fcmToken');

  if (!fcmToken) {
    try {
      // Attempt to retrieve the new FCM token
      const newFcmToken = await messaging().getToken();
      if (newFcmToken) {
        // Store the new token in AsyncStorage
        await AsyncStorage.setItem('fcmToken', newFcmToken);
        console.debug('New FCM Token:', newFcmToken);

        const userId = auth()?.currentUser?.uid;

        // Store the new token in Firestore
        await storeFcmTokenInFirestore(userId, newFcmToken);
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  } else {
    console.debug('Existing FCM Token:', fcmToken);
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
