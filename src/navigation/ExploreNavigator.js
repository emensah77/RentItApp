import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import SearchResultsScreen from '../screens/SearchResults';
import SearchResultsTabNavigator from './SearchResultsTabNavigator';
import AboutScreen from '../screens/AboutScreen';
import LoginScreen from '../screens/LoginScreen';


const Stack = createStackNavigator();

const Router = (props) => {
        return (
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#fff'
                    },
                    headerTintColor: '#000000',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >


                <Stack.Screen
                    name={'Welcome'}
                    component={HomeScreen}
                    options={{
                        headerShown: false,
                    }}
                    />

                <Stack.Screen
                    name={'About'}
                    component={AboutScreen}
                    options={{
                        headerShown: false,
                    }}
                    />

                

                <Stack.Screen
                    name={'Login'}
                    component={LoginScreen}
                    options={{
                        headerShown: false,
                    }}
                    />

                    <Stack.Screen
                        name={'SearchResults'}
                        component={SearchResultsTabNavigator}
                        options={{
                           title: 'Places to Rent',
                        }}
                        />

                
            </Stack.Navigator>

        );

      
};
export default Router;