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
    await firestore().collection('deviceFcms').doc(userId).set(
      {
        deviceToken: fcmToken,
        userId,
      },
      {merge: true},
    );
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

export const getFcmToken = async () => {
  // Check if the user is signed in
  const user = auth().currentUser;
  if (!user) {
    return;
  }

  const userId = user.uid;
  const fcmToken = await AsyncStorage.getItem('fcmToken');

  if (!fcmToken) {
    try {
      const newFcmToken = await messaging().getToken();
      if (newFcmToken) {
        await AsyncStorage.setItem('fcmToken', newFcmToken);
        console.debug('New FCM Token:', newFcmToken);
        await storeFcmTokenInFirestore(userId, newFcmToken);
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  } else {
    console.debug('Existing FCM Token:', fcmToken);
    await storeFcmTokenInFirestore(userId, fcmToken);
  }
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    if (remoteMessage.data && remoteMessage.data.screen === 'Marketer Home') {
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
      navigate('MarketerDashboard', {
        screen: 'Marketer Home',
        params: {itemDetails},
      });
    }
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage && remoteMessage.data && remoteMessage.data.screen === 'Marketer Home') {
        const itemDetails = JSON.parse(remoteMessage.data.itemDetails);
        navigate('MarketerDashboard', {
          screen: 'Marketer Home',
          params: {itemDetails},
        });
      }
      navigate('Post', remoteMessage.data);
    });
};

export default requestUserPermission;
