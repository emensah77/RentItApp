import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}

export const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('old Token', fcmToken);
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      // logic for the new installed app on device
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
        console.log('The new token', fcmToken);
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export const notificationListener = async () => {
  console.log('notification listener me agya hia ');
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage,
    );
  });
  messaging().onMessage(async remoteMessage =>
    console.log('received in foreground', remoteMessage),
  );

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
};

export default requestUserPermission;
