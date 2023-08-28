import React, {useCallback} from 'react';
import {StackScreenProps, createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

import mixpanel from '../MixpanelConfig';

import Inbox from '../screens/Profile/Inbox';
import Chat from '../screens/Profile/Chat';
import Menu from '../screens/Profile/Menu';
import Notification from '../screens/Authentication/Notification';
import PaymentsAndPayouts from '../screens/Profile/Payments/PaymentsAndPayouts';
import PaymentMethods from '../screens/Profile/Payments/PaymentMethods';
import YourPayments from '../screens/Profile/Payments/YourPayments';
import CreditAndCoupons from '../screens/Profile/Payments/CreditAndCoupons';
import RentItPay from '../screens/Profile/Payments/RentItPay';
import BecomeAMarketer from '../screens/Profile/BecomeAMarketer';
import MarketerDashboard from '../screens/Profile/MarketerDashboard';
import AccountDetails from '../screens/Profile/AccountDetails';
import Edit from '../screens/Profile/Edit';
import EditPersonalInfo from '../screens/Profile/EditPersonalInfo';
import Email from '../screens/Authentication/Email';
import PhoneNumber from '../screens/Authentication/PhoneNumber';
import OTP from '../screens/Authentication/OTP';
import Filter from '../screens/Explore/Filter';
import PostScreen from '../screens/PostScreen';
import EFeedback from '../screens/Feedback';
import Review from '../screens/Reviews';
import listAHome from '../screens/ListAHome';
import HomeTabNavigator from './HomeTabNavigator';

const Stack = createStackNavigator<AppStackParamList>();

export type AppStackParamList = {
  WelcomeScreen: undefined;
  Home: undefined;
  Inbox: undefined;
  Chat: undefined;
  Menu: undefined;
  PaymentsAndPayouts: undefined;
  PaymentMethods: undefined;
  YourPayments: undefined;
  CreditAndCoupons: undefined;
  RentItPay: undefined;
  BecomeAMarketer: undefined;
  MarketerDashboard: undefined;
  AccountDetails: undefined;
  Edit: undefined;
  EditPersonalInfo: undefined;
  PhoneNumber: undefined;
  [x: string]: any;
};

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
export type AppStackScreenProps<T extends keyof AppStackParamList> = StackScreenProps<
  AppStackParamList,
  T
>;

const noHeader = {
  headerShown: false,
  lazy: true,
};

const AppStack = () => {
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
    // @ts-ignore
    <Stack.Navigator initialRouteName="Inbox" onStateChange={onNavigationStateChange}>
      {listAHome.map(({Component, title}) => (
        <Stack.Screen key={title} name={title} component={Component} options={noHeader} />
      ))}

      <Stack.Screen name="Inbox" component={Inbox} options={noHeader} />

      <Stack.Screen name="Chat" component={Chat} options={noHeader} />

      <Stack.Screen name="Menu" component={Menu} options={noHeader} />

      <Stack.Screen name="PaymentsAndPayouts" component={PaymentsAndPayouts} options={noHeader} />

      <Stack.Screen name="PaymentMethods" component={PaymentMethods} options={noHeader} />

      <Stack.Screen name="YourPayments" component={YourPayments} options={noHeader} />

      <Stack.Screen name="CreditAndCoupons" component={CreditAndCoupons} options={noHeader} />

      <Stack.Screen name="RentItPay" component={RentItPay} options={noHeader} />

      <Stack.Screen name="BecomeAMarketer" component={BecomeAMarketer} options={noHeader} />

      <Stack.Screen name="MarketerDashboard" component={MarketerDashboard} options={noHeader} />

      <Stack.Screen name="AccountDetails" component={AccountDetails} options={noHeader} />

      <Stack.Screen name="Edit" component={Edit} options={noHeader} />

      <Stack.Screen name="EditPersonalInfo" component={EditPersonalInfo} options={noHeader} />

      <Stack.Screen name="Email" component={Email} options={noHeader} />

      <Stack.Screen name="PhoneNumber" component={PhoneNumber} options={noHeader} />

      <Stack.Screen name="OTP" component={OTP} options={noHeader} />

      <Stack.Screen name="Notification" component={Notification} options={noHeader} />

      <Stack.Screen name="Filter" component={Filter} options={noHeader} />

      <Stack.Screen name="Home" component={HomeTabNavigator} options={noHeader} />

      <Stack.Screen name="Post" component={PostScreen} options={noHeader} />

      <Stack.Screen name="Reviews" component={Review} options={noHeader} />

      <Stack.Screen name="Feedback" component={EFeedback} options={noHeader} />
    </Stack.Navigator>
  );
};

export default AppStack;
