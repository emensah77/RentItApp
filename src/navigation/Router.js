import React, {useContext, useState, useEffect} from 'react';
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
import { View } from 'react-native';

const Stack = createStackNavigator();


const usertyu = firebase.auth().currentUser;
const Router = () => {
  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);
  const{loading, setLoading} = useContext(AuthContext);

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
      <NavigationContainer>
           <AuthStack />
            

            
        </NavigationContainer>
    );
  }

    return (
        <NavigationContainer>
          <AppStack /> 
            

            
        </NavigationContainer>
    );
};

export default Router;