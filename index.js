/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Amplify from 'aws-amplify';
import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {GoogleSignin} from '@react-native-community/google-signin';
import AWS from 'aws-sdk';
import {AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, GOOGLE_WEB_CLIENT_ID} from 'react-native-dotenv';

import config from './src/aws-exports';
import {name as appName} from './app.json';
import App from './App';
import {navigate} from './src/navigation/Router';
import 'react-native-gesture-handler';

Amplify.configure(config);
AWS.config.update({
  region: 'us-east-2',
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.debug('Message handled in the background!', remoteMessage);
});

messaging().onNotificationOpenedApp(async remoteMessage => {
  console.debug(
    'Notification caused app to open from background state:',
    remoteMessage.notification,
  );
  navigate('Post', remoteMessage.data);
});

Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({host: '10.0.2.2'}) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!

AppRegistry.registerComponent(appName, () => App);
