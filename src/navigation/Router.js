import React, {useContext, useState, useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from "@react-navigation/stack";
import DestinationSearchScreen from "../screens/DestinationSearch";
import GuestsScreen from "../screens/GuestsScreen";
import HomeTabNavigator from "./HomeTabNavigator";
import PostScreen from '../screens/PostScreen';
import Onboarding from '../screens/Onboarding';
import Splash from '../screens/Splash';
import auth from '@react-native-firebase/auth';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import {AuthContext} from './AuthProvider';
import { firebase } from '@react-native-firebase/auth';
import { ActivityIndicator } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import {View,Image, Text} from 'react-native';

const Stack = createStackNavigator();

export const navigationRef = React.createRef();

const config = {
  initialRouteName: 'Home',
  screens: {
    Home: 'home',
    Post: 'post/:id?',
  },
};

const linking = {
  prefixes: ['https://rentit.com', 'rentit://'],
  config,
};

const usertyu = firebase.auth().currentUser;
const Router = () => {
  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);
  const{loading, setLoading} = useContext(AuthContext);
  const routeNameRef = useRef();

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
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
        onReady={() => {
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;
  
          if (previousRouteName !== currentRouteName) {
            await analytics().logScreenView({
              screen_name: currentRouteName.replace(/\s/g, ""),
              screen_class: currentRouteName.replace(/\s/g, ""),
            });
          }
          if (previousRouteName !== currentRouteName) {
            await analytics().logEvent(`Page_${currentRouteName.replace(/\s/g, "")}`, {
                userId: user.displayName,
                item: user.uid,
  
            });
          }
          routeNameRef.current = currentRouteName;
        }}
        linking={linking} fallback={<ActivityIndicator color="blue" size="large" />}
        >
          <AppStack /> 
            

            
        </NavigationContainer>
    );
};

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export default Router;