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
    const userId = auth()?.currentUser?.uid;
    getFcmToken(userId);
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
    await firestore().collection('users').doc(userId).set(
      {
        fcmToken,
      },
      {merge: true},
    );

    console.debug('FCM Token stored in Firestore:', fcmToken);
  } catch (error) {
    console.error('Error storing FCM token in Firestore:', error);
  }
};

export const getFcmToken = async userId => {
  const fcmToken = await AsyncStorage.getItem('fcmToken');

  if (!fcmToken) {
    try {
      // Attempt to retrieve the new FCM token
      const newFcmToken = await messaging().getToken();
      if (newFcmToken) {
        // Store the new token in AsyncStorage
        await AsyncStorage.setItem('fcmToken', newFcmToken);
        console.debug('New FCM Token:', newFcmToken);

        // Store the new token in Firestore
        await storeFcmTokenInFirestore(userId, newFcmToken);
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  } else if (fcmToken && userId) {
    // Existing token in AsyncStorage and the user is logged in
    console.debug('Existing FCM Token:', fcmToken);

    await storeFcmTokenInFirestore(userId, fcmToken); // Update Firestore with the existing token
  } else {
    console.error('FCM token retrieval failed or user is not logged in');
  }
};
export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    // console.debug(
    //   'Notification caused app to open from background state:',
    //   remoteMessage,
    // );
    if (remoteMessage.data && remoteMessage.data.screen === 'Marketer Home') {
      // Navigate to the MarketerHome screen with the notification data
      const itemDetails = JSON.parse(remoteMessage.data.itemDetails);
      navigate('MarketerDashboard', {
        screen: 'Marketer Home',
        params: {itemDetails},
      });
    }
    navigate('Post', remoteMessage.data);
  });

  messaging().onMessage(async remoteMessage => {
    const itemDetails = JSON.parse(remoteMessage.data.itemDetails);

    if (remoteMessage.data && remoteMessage.data.screen === 'Marketer Home') {
      // Navigate to the MarketerHome screen with the notification data
      navigate('MarketerDashboard', {
        screen: 'Marketer Home',
        params: {itemDetails},
      });
    }
    // console.debug('received in foreground', remoteMessage),
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      const itemDetails = JSON.parse(remoteMessage.data.itemDetails);

      if (remoteMessage && remoteMessage.data && remoteMessage.data.screen === 'Marketer Home') {
        // Navigate to the MarketerHome screen with the notification data
        navigate('MarketerDashboard', {
          screen: 'Marketer Home',
          params: {itemDetails},
        });
      }

      navigate('Post', remoteMessage.data);
    });
};

export default requestUserPermission;
