import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import React, {useEffect} from 'react';
import {StatusBar, useColorScheme, AppState} from 'react-native';
import Amplify from '@aws-amplify/core';
import {ApplicationProvider} from '@ui-kitten/components';
import {Host} from 'react-native-portalize';
import * as eva from '@eva-design/eva';
import * as Sentry from '@sentry/react-native';

import awsconfig from './src/aws-exports';
import Providers from './src/navigation/Providers';
import requestUserPermission, {notificationListener} from './src/utils/notificationService';
import {WishListProvider} from './src/context/WishlistContext';

Amplify.configure(awsconfig);
Sentry.init({
  dsn: 'https://885eb00f1fb24206a506bef30f3bc2b1@o1224815.ingest.sentry.io/6369972',
  environment: __DEV__ ? 'development' : 'production',
});

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    SplashScreen.hide();
    requestUserPermission();
    notificationListener();

    AppState.addEventListener('memoryWarning', state => {
      console.debug('Your memory is currently warning.', state);
    });
  }, []);

  return (
    <>
      <Host>
        <ApplicationProvider {...eva} theme={eva.light}>
          <WishListProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            {/* <ActivityLoader/> */}

            <Providers />

            {/* <Router /> */}
          </WishListProvider>
        </ApplicationProvider>
      </Host>
    </>
  );
};

export default App;
