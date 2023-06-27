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
import Filter from '../screens/Explore/Filter';
import DestinationSearchScreen from '../screens/DestinationSearch';
import GuestsScreen from '../screens/GuestsScreen';
import PostScreen from '../screensV2/PostScreen';
import HomeScreen from '../screensV2/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import EFeedback from '../screens/Feedback';
import Review from '../screens/Reviews';
import HomeTabNavigator from './HomeTabNavigator';
import CancelationPolicy from '../screensV2/CancelationPolicy';
import HealthSafety from '../screensV2/HealthSafety';
import HouseRules from '../screensV2/HouseRules';
import Amenities from '../screensV2/Amenities';
import Reviews from '../screensV2/Reviews';
import SelectReason from '../screensV2/SelectReason';
import ConfirmCancellation from '../screensV2/ConfirmCancellation';
import RefundPage from '../screensV2/RefundPage';
import ListingSteps from '../screensV2/ListingSteps';
import RequestBook from '../screensV2/RequestBook';
import HouseTypeScreen from '../screens/HouseTypeScreen';

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
    <Stack.Navigator screenOptions={{headerShown: false}} onStateChange={onNavigationStateChange}>
      <Stack.Screen name="Home" component={HomeTabNavigator} />

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

      <Stack.Screen name="Filter" component={Filter} options={noHeader} />

      <Stack.Screen name="Home" component={HomeTabNavigator} options={noHeader} />

      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={noHeader} />

      <Stack.Screen name="Destination Search" component={DestinationSearchScreen} options={noHeaderWithATitle} />

      <Stack.Screen name="Number of Guests" component={GuestsScreen} options={noHeader} />

      <Stack.Screen name="House Type" component={HouseTypeScreen} options={noHeader} />

      <Stack.Screen name="Post" component={PostScreen} options={noHeader} />

      <Stack.Screen name="Reviews" component={Review} options={noHeader} />

      <Stack.Screen name="Feedback" component={EFeedback} options={noHeader} />
      <Stack.Screen name="Policy" component={CancelationPolicy} options={noHeader} />
      <Stack.Screen name="Health" component={HealthSafety} options={noHeader} />
      <Stack.Screen name="Rules" component={HouseRules} options={noHeader} />
      <Stack.Screen name="Amenities" component={Amenities} options={noHeader} />
      <Stack.Screen name="ReviewsMore" component={Reviews} options={noHeader} />
      <Stack.Screen name="Homes" component={HomeScreen} options={noHeader} />
      {/* <Stack.Screen name="WishListItem" component={WishtListItem} options={noHeader} /> */}
      <Stack.Screen name="Reason" component={SelectReason} options={noHeader} />
      <Stack.Screen name="Cancelation" component={ConfirmCancellation} options={noHeader} />
      <Stack.Screen name="Refund" component={RefundPage} options={noHeader} />
      <Stack.Screen name="RequestBook" component={RequestBook} options={noHeader} />
      <Stack.Screen name="ListingStep" component={ListingSteps} options={noHeader} />
    </Stack.Navigator>
  );
};

export default AppStack;
