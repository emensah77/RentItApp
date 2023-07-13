import React, {useEffect, useMemo} from 'react';
import {StatusBar, useColorScheme, AppState} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {ApplicationProvider} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import Crashes, {ErrorAttachmentLog} from 'appcenter-crashes';

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
    (async () => {
      await Crashes.setEnabled(true);
      Crashes.setListener({
        shouldProcess: () => true,
        shouldAwaitUserConfirmation: () => false,
        getErrorAttachments: () => {
          return (async () => {
            return [
              ErrorAttachmentLog.attachmentWithText(
                await Crashes.hasCrashedInLastSession(),
                'did-crash.txt',
              ),
              ErrorAttachmentLog.attachmentWithText(
                await Crashes.hasReceivedMemoryWarningInLastSession(),
                'memory-warning.txt',
              ),
              ErrorAttachmentLog.attachmentWithText(
                await Crashes.lastSessionCrashReport(),
                'last-crash-report.txt',
              ),
            ];
          })();
        },
      });
    })();

    const subscription = AppState.addEventListener('memoryWarning', state => {
      console.debug('Your memory is currently waning.', state);
    });

    return () => subscription.remove();
  }, []);

  return (
    <>
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
