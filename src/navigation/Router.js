import React, {useContext, useState, useEffect, useRef, useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator} from 'react-native';
import analytics from '@react-native-firebase/analytics';

import AuthStack from './AuthStack';
import AppStack from './AppStack';
import {AuthContext} from './AuthProvider';

import linking from './linking';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

const Router = () => {
  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);
  const routeNameRef = useRef();

  const onAuthStateChanged = useCallback(
    newUser => {
      setUser(newUser);
      if (initializing) setInitializing(false);
    },
    [initializing, setUser],
  );

  const onReady = useCallback(() => {
    routeNameRef.current = navigationRef.current.getCurrentRoute().name;
  }, []);

  const onStateChange = useCallback(async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current.getCurrentRoute().name;

    console.debug('Current Page:', currentRouteName);

    if (previousRouteName !== currentRouteName) {
      await analytics().logScreenView({
        screen_name: currentRouteName.replace(/\s/g, ''),
        screen_class: currentRouteName.replace(/\s/g, ''),
      });

      await analytics().logEvent(`Page_${currentRouteName.replace(/\s/g, '')}`, {
        userId: user.displayName,
        item: user.uid,
      });
    }
    routeNameRef.current = currentRouteName;
  }, [user]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [onAuthStateChanged]);

  if (initializing) return null;

  if (!user) {
    return (
      <NavigationContainer ref={navigationRef}>
        <AuthStack />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={onReady}
      onStateChange={onStateChange}
      linking={linking}
      fallback={<ActivityIndicator color="blue" size="large" />}>
      <AppStack />
    </NavigationContainer>
  );
};

export default Router;
