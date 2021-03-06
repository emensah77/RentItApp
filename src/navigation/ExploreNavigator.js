import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import SearchResultsScreen from '../screens/SearchResults';
import SearchResultsTabNavigator from './SearchResultsTabNavigator';
import AboutScreen from '../screens/AboutScreen';
import LoginScreen from '../screens/LoginScreen';
import AddressScreen from '../screens/AddressScreen';
import PaymentScreen from '../screens/PaymentScreen';
import House from '../screens/House';
import HouseDetailScreen from '../screens/HouseDetailScreen';
import HouseUploadScreen from '../screens/HouseUploadScreen';
import OnboardingScreen1 from '../screens/OnboardingScreen1';
import OnboardingScreen2 from '../screens/OnboardingScreen2';
import OnboardingScreen3 from '../screens/OnboardingScreen3';
import OnboardingScreen4 from '../screens/OnboardingScreen4';
import OnboardingScreen5 from '../screens/OnboardingScreen5';
import OnboardingScreen6 from '../screens/OnboardingScreen6';
import OnboardingScreen7 from '../screens/OnboardingScreen7';
import OnboardingScreen8 from '../screens/OnboardingScreen8';
import OnboardingScreen9 from '../screens/OnboardingScreen9';
import OnboardingScreen10 from '../screens/OnboardingScreen10';
import OnboardingScreen11 from '../screens/OnboardingScreen11';
import AccountManageScreen from '../screens/AccountManageScreen';


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
                    name={'Address'}
                    component={AddressScreen}
                    options={{
                        headerShown: true,
                        title:'Confirm and Pay'
                    }}
                    />
                <Stack.Screen
                    name={'Payment'}
                    component={PaymentScreen}
                    options={{
                        headerShown: true,
                        title:'Confirm and Pay'
                    }}
                    />
                <Stack.Screen
                    name={'House'}
                    component={House}
                    options={{
                        headerShown: false,

                    }}
                    />
                <Stack.Screen
                    name={'HouseDetails'}
                    component={HouseDetailScreen}
                    options={{
                        headerShown: false,
                    }}
                    />
                <Stack.Screen
                    name={'OnboardingScreen1'}
                    component={OnboardingScreen1}
                    options={{
                        headerShown: false,
                    }}
                    />
                <Stack.Screen
                    name={'OnboardingScreen2'}
                    component={OnboardingScreen2}
                    options={{
                        headerShown: false,
                    }}
                    />
                <Stack.Screen
                    name={'OnboardingScreen3'}
                    component={OnboardingScreen3}
                    options={{
                        headerShown: false,
                    }}
                    />
                <Stack.Screen
                    name={'OnboardingScreen4'}
                    component={OnboardingScreen4}
                    options={{
                        headerShown: false,
                    }}
                    />
                <Stack.Screen
                    name={'OnboardingScreen5'}
                    component={OnboardingScreen5}
                    options={{
                        headerShown: false,
                    }}
                    />
                <Stack.Screen
                    name={'OnboardingScreen6'}
                    component={OnboardingScreen6}
                    options={{
                        headerShown: false,
                        
                    }}
                    />
                
                <Stack.Screen
                    name={'OnboardingScreen7'}
                    component={OnboardingScreen7}
                    options={{
                        headerShown: false,
                    }}
                    />
                <Stack.Screen
                    name={'OnboardingScreen8'}
                    component={OnboardingScreen8}
                    options={{
                        headerShown: false,
                    }}
                    />
                <Stack.Screen
                    name={'OnboardingScreen9'}
                    component={OnboardingScreen9}
                    options={{
                        headerShown: false,
                    }}
                    />
                <Stack.Screen
                    name={'OnboardingScreen10'}
                    component={OnboardingScreen10}
                    options={{
                        headerShown: false,
                    }}
                    />
                <Stack.Screen
                    name={'OnboardingScreen11'}
                    component={OnboardingScreen11}
                    options={{
                        headerShown: false,
                    }}
                    />
                <Stack.Screen
                    name={'HouseUpload'}
                    component={HouseUploadScreen}
                    options={{
                        headerShown: false,
                        
                    }}
                    />  
                <Stack.Screen
                    name={'AccountManage'}
                    component={AccountManageScreen}
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
                           headerShown: true,
                           title: 'Homes to Rent',
                        }}
                        />

                
            </Stack.Navigator>

        );

      
};
export default Router;