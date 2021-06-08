import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from "@react-navigation/stack";
import DestinationSearchScreen from "../screens/DestinationSearch";
import GuestsScreen from "../screens/GuestsScreen";
import HomeTabNavigator from "./HomeTabNavigator";
import PostScreen from '../screens/PostScreen';
import Onboarding from '../screens/Onboarding';
import Splash from '../screens/Splash';


const Stack = createStackNavigator();



const Router = (props) => {
    return (
        <NavigationContainer >

            <Stack.Navigator initialRouteName="Splash">
                <Stack.Screen 
                name={"Home"}
                component={HomeTabNavigator} 
                options={{
                    headerShown: false,
                }}
                    />
            <Stack.Screen 
                name={"Splash"}
                component={Splash} 
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

            <Stack.Screen 
                name={"Onboarding"}
                component={Onboarding}
                options={{
                    headerShown: false,
                }} 
                
                />


            
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Router;