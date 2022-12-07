/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import Amplify from 'aws-amplify'
import config from './src/aws-exports'
import Reactotron from 'reactotron-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
Amplify.configure(config)
import 'react-native-gesture-handler';

Reactotron
  .setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect() // let's connect!

AppRegistry.registerComponent(appName, () => App);
