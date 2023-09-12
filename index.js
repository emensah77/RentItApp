/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import {Amplify} from 'aws-amplify';
import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {GoogleSignin} from '@react-native-community/google-signin';
import AWS from 'aws-sdk';
import CodePush from 'react-native-code-push';
import {
  REACT_NATIVE_APP_ENV,
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  GOOGLE_WEB_CLIENT_ID,
  ANDROID_PRODUCTION_KEY,
  ANDROID_STAGING_KEY,
  IOS_PRODUCTION_KEY,
} from 'react-native-dotenv';

import {name as appName} from './app.json';
import App from './App';
import {navigate} from './src/navigation/Router';
import 'react-native-gesture-handler';
import awsmobile from './src/aws-exports';

let deploymentKey;
if (Platform.OS === 'android') {
  deploymentKey =
    REACT_NATIVE_APP_ENV === 'production' ? ANDROID_PRODUCTION_KEY : ANDROID_STAGING_KEY;
} else if (Platform.OS === 'ios') {
  deploymentKey = REACT_NATIVE_APP_ENV === 'production' ? IOS_PRODUCTION_KEY : IOS_STAGING_KEY;
}

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  installMode: CodePush.InstallMode.IMMEDIATE,
  deploymentKey, // <-- Use the dynamically determined deployment key
};

const AppWithCodePush = CodePush(codePushOptions)(App);

Amplify.configure(awsmobile);
if (REACT_NATIVE_APP_ENV === 'development') {
  // Amplify.Logger.LOG_LEVEL = 'DEBUG';
}
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

AppRegistry.registerComponent(appName, () => AppWithCodePush);
