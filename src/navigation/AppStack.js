import React from 'react';
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



const Stack = createStackNavigator();

const AppStack = () => {
    
  
    return (
        <Stack.Navigator>
                    <Stack.Screen 
                        name={"Home"}
                        component={HomeTabNavigator} 
                        options={{
                            headerShown: false,
                        }}
                            />
                        


                        



                        
                            <Stack.Screen 
                            name={"Destination Search"}
                            component={DestinationSearchScreen}
                            options={{
                                title:"Search your destination"
                            }} 
                            
                            />
                        


                        <Stack.Screen 
                            name={"Number of Guests"}
                            component={GuestsScreen} 
                            
                            />

                        <Stack.Screen 
                            name={"Post"}
                            component={PostScreen} 
                            
                            />

                        


            
            </Stack.Navigator>
    );

};

export default AppStack;