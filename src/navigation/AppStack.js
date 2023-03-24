import React, {useState, useEffect} from 'react';
import DestinationSearchScreen from "../screens/DestinationSearch";
import GuestsScreen from "../screens/GuestsScreen";
import HomeTabNavigator from "./HomeTabNavigator";
import PostScreen from '../screens/PostScreen';
import Onboarding from '../screens/Onboarding';
import Splash from '../screens/Splash';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignUpScreen';
import {createStackNavigator} from "@react-navigation/stack";
import AboutScreen from '../screens/AboutScreen';
import HouseTypeScreen from '../screens/HouseTypeScreen';
import SearchResultsTabNavigator from './SearchResultsTabNavigator';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import WelcomeScreen from '../screens/WelcomeScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import mixpanel from '../../src/MixpanelConfig';
import { AuthContext } from '../navigation/AuthProvider';
import EFeedback from '../screens/Feedback'
import Review from '../screens/Reviews'



const Stack = createStackNavigator();

const onNavigationStateChange = (state) => {
    const currentRoute = state.routes[state.index];
    const currentScreen = currentRoute.name;
  
    const { user } = useContext(AuthContext);
  
    mixpanel.track('Screen Viewed', {
      screenName: currentScreen,
      userId: user ? user.uid : 'guest',
    });
  };

const AppStack = () => {
   
  
    return (
        <Stack.Navigator
        onStateChange={(state) =>
            onNavigationStateChange(state)
          }
        >

                    
                    
                        

                        <Stack.Screen 
                        name={"Home"}
                        component={HomeTabNavigator} 
                        options={{
                            headerShown: false,
                        }}
                            />

                    <Stack.Screen 
                        name={"WelcomeScreen"}
                        component={WelcomeScreen} 
                        options={{
                            headerShown: false,
                        }}
                            />
                        

                        



                        
                            <Stack.Screen 
                            name={"Destination Search"}
                            component={DestinationSearchScreen}
                            options={{
                                title:"Search your destination",
                                headerShown: false,
                            }} 
                            
                            />
                        


                        <Stack.Screen 
                            name={"Number of Guests"}
                            component={GuestsScreen} 
                            options={{
                                headerShown: false,
                            }} 
                            />
                        <Stack.Screen 
                            name={"House Type"}
                            component={HouseTypeScreen} 
                            options={{
                                headerShown: false,
                            }} 
                            />
                        

                        <Stack.Screen 
                            name={"Post"}
                            component={PostScreen}
                            
                            options={{
                                headerShown: false,
                            }}
                            />
                        <Stack.Screen
                            name={'Reviews'}
                            component={Review}
                            options={{
                            headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name={'Feedback'}
                            component={EFeedback}
                            options={{
                            headerShown: false,
                            }}
                        />
               


            
            </Stack.Navigator>
    );

};

export default AppStack;