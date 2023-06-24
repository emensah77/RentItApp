/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import Amplify from '@aws-amplify/core';
import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';

import config from './src/aws-exports';
import {name as appName} from './app.json';
import App from './App';
import {navigate} from './src/navigation/Router';
import 'react-native-gesture-handler';

Amplify.configure(config);
['ViewPropTypes', 'ColorPropType', 'PointPropType'].map(item =>
  LogBox.ignoreLogs([
    `${item} will be removed from React Native. Migrate to ${item} exported from 'deprecated-react-native-prop-types'`,
  ]),
);

Sentry.init({
  dsn: 'https://885eb00f1fb24206a506bef30f3bc2b1@o1224815.ingest.sentry.io/6369972',
  environment: __DEV__ ? 'development' : 'production',
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
