import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import React, {useEffect} from 'react';

import {Settings} from 'react-native-fbsdk-next';

import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import awsconfig from './src/aws-exports';
import feed from './assets/data/feed';
import Providers from './src/navigation/Providers';
import Amplify from '@aws-amplify/core';
import requestUserPermission, {
  notificationListener,
} from './src/utils/notificationService';
Amplify.configure(awsconfig);

import {ApplicationProvider} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import {WishListProvider} from './src/context/WishlistContext';

import * as Sentry from '@sentry/react-native';

Sentry.init({ 
  dsn: 'https://885eb00f1fb24206a506bef30f3bc2b1@o1224815.ingest.sentry.io/6369972', 
});

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  useEffect(() => {
    SplashScreen.hide();
    requestUserPermission();
    notificationListener();
  });
  return (
    <>
      <ApplicationProvider {...eva} theme={eva.light}>
        <WishListProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

          <Providers />

        </WishListProvider>
      </ApplicationProvider>
    </>
  );
};

export default App;
