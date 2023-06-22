import React, {useEffect, useMemo} from 'react';
import {Text, StatusBar, useColorScheme, AppState} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {ApplicationProvider} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

import Providers from './src/navigation/Providers';
import requestUserPermission, {notificationListener} from './src/utils/notificationService';
import {WishListProvider} from './src/context/WishlistContext';

const App = () => {
  const colorScheme = useColorScheme();
  const barStyle = useMemo(
    () => (colorScheme === 'dark' ? 'light-content' : 'dark-content'),
    [colorScheme],
  );

  useEffect(() => {
    SplashScreen.hide();
    requestUserPermission();
    notificationListener();

    const subscription = AppState.addEventListener('memoryWarning', state => {
      console.debug('Your memory is currently waning.', state);
    });

    return () => subscription.remove();
  }, []);

  return (
    <>
      <Text
        accessible={true}
        id="welcomemessagea"
        test-id="welcomemessageb"
        accessibilityLabel="welcomemessagec">
        Buy, Sell, Rent a Home
      </Text>
      <ApplicationProvider {...eva} theme={eva.light}>
        <WishListProvider>
          <StatusBar barStyle={barStyle} />
          <Providers />
        </WishListProvider>
      </ApplicationProvider>
    </>
  );
};

export default App;
