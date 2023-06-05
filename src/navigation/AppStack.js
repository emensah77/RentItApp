import React, {useMemo, useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

import mixpanel from '../MixpanelConfig';

import Inbox from '../screens/Profile/Inbox';
import Chat from '../screens/Profile/Chat';
import Menu from '../screens/Profile/Menu';
import PaymentsAndPayouts from '../screens/Profile/Payments/PaymentsAndPayouts';
import PaymentMethods from '../screens/Profile/Payments/PaymentMethods';
import YourPayments from '../screens/Profile/Payments/YourPayments';
import CreditAndCoupons from '../screens/Profile/Payments/CreditAndCoupons';
import RentItPay from '../screens/Profile/Payments/RentItPay';
import BecomeAMarketer from '../screens/Profile/BecomeAMarketer';
import AccountDetails from '../screens/Profile/AccountDetails';
import Edit from '../screens/Profile/Edit';
import EditPersonalInfo from '../screens/Profile/EditPersonalInfo';
import PhoneNumber from '../screens/Authentication/PhoneNumber';
import DestinationSearchScreen from '../screens/DestinationSearch';
import GuestsScreen from '../screens/GuestsScreen';
import PostScreen from '../screens/PostScreen';
import HouseTypeScreen from '../screens/HouseTypeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import EFeedback from '../screens/Feedback';
import Review from '../screens/Reviews';
import HomeTabNavigator from './HomeTabNavigator';

const Stack = createStackNavigator();

const AppStack = () => {
  const noHeader = useMemo(
    () => ({
      headerShown: false,
      lazy: true,
    }),
    [],
  );

  const noHeaderWithATitle = useMemo(
    () => ({
      title: 'Search your destination',
      headerShown: false,
      lazy: true,
    }),
    [],
  );

  const onNavigationStateChange = useCallback(state => {
    const currentRoute = state.routes[state.index];
    const screenName = currentRoute.name;
    const user = auth().currentUser;
    mixpanel.track('Screen Viewed', {
      screenName,
      userId: user ? user.uid : 'guest',
    });
  }, []);

  return (
    <Stack.Navigator initialRouteName="EditPersonalInfo" onStateChange={onNavigationStateChange}>
      <Stack.Screen name="Inbox" component={Inbox} options={noHeader} />

      <Stack.Screen name="Chat" component={Chat} options={noHeader} />

      <Stack.Screen name="Menu" component={Menu} options={noHeader} />

      <Stack.Screen name="PaymentsAndPayouts" component={PaymentsAndPayouts} options={noHeader} />

      <Stack.Screen name="PaymentMethods" component={PaymentMethods} options={noHeader} />

      <Stack.Screen name="YourPayments" component={YourPayments} options={noHeader} />

      <Stack.Screen name="CreditAndCoupons" component={CreditAndCoupons} options={noHeader} />

      <Stack.Screen name="RentItPay" component={RentItPay} options={noHeader} />

      <Stack.Screen name="BecomeAMarketer" component={BecomeAMarketer} options={noHeader} />

      <Stack.Screen name="AccountDetails" component={AccountDetails} options={noHeader} />

      <Stack.Screen name="Edit" component={Edit} options={noHeader} />

      <Stack.Screen name="EditPersonalInfo" component={EditPersonalInfo} options={noHeader} />

      <Stack.Screen name="PhoneNumber" component={PhoneNumber} options={noHeader} />

      <Stack.Screen name="Home" component={HomeTabNavigator} options={noHeader} />

      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={noHeader} />

      <Stack.Screen
        name="Destination Search"
        component={DestinationSearchScreen}
        options={noHeaderWithATitle}
      />

      <Stack.Screen name="Number of Guests" component={GuestsScreen} options={noHeader} />

      <Stack.Screen name="House Type" component={HouseTypeScreen} options={noHeader} />

      <Stack.Screen name="Post" component={PostScreen} options={noHeader} />

      <Stack.Screen name="Reviews" component={Review} options={noHeader} />

      <Stack.Screen name="Feedback" component={EFeedback} options={noHeader} />
    </Stack.Navigator>
  );
};

export default AppStack;
