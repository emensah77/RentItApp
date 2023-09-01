import React, {useCallback, useEffect, useState, useMemo, useContext} from 'react';
import {ActivityIndicator, Alert, Dimensions, View} from 'react-native';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {API, graphqlOperation} from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {WebView} from 'react-native-webview';
import auth from '@react-native-firebase/auth';

import {deletePost} from '../../../graphql/mutations';
import {AuthContext} from '../../../navigation/AuthProvider';
import mixpanel from '../../../MixpanelConfig';

const containerStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
  flex: 1,
};

const originWhitelist = ['*'];

const PaymentScreen = () => {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();

  const amount = route.params.totalAmount;
  const userEmail = user.email;
  const {homelatitude} = route.params;
  const {homelongitude} = route.params;
  const {homeimage} = route.params;
  const {hometitle} = route.params;
  const {homebed} = route.params;
  const {marketerName} = route.params;

  const {homeyears} = route.params;
  const {homeMonths} = route.params;
  const {homeWeeks} = route.params;
  const {homeDays} = route.params;
  const {homeid} = route.params;
  const {selectedType} = route.params;
  const {checkoutNumber} = route.params;

  const [paymentUrl, setPaymentUrl] = useState(null);
  const [merchantTransactionID, setMerchantTransactionID] = useState(null);
  const [startTime, setStartTime] = useState(0);

  const deleteFromFavorites = async id => {
    const ref = firestore().collection('posts');
    ref
      .where('id', '==', id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          firestore().collection('posts').doc(doc.id).delete();
        });
      });
  };

  const deleteFromTrends = async id => {
    await firestore().collection('trends').doc(id).delete();
  };

  const deleteHome = async id => {
    try {
      const input = {
        id,
      };
      await API.graphql(
        graphqlOperation(deletePost, {
          input,
        }),
      );
    } catch (e) {
      console.error('Error deleting post', e);
    }
  };

  const addPayment = useCallback(async () => {
    await firestore()
      .collection('payments')
      .doc(merchantTransactionID)
      .set({
        createdAt: new Date(),
        amountPaid: amount,
        userId: user.uid,
        userName: user.displayName,
        paymentType: selectedType,
        merchantTransactionID,
        paymentStatus: 'Processing',
        checkoutNumber,
        marketerName: marketerName || '',
      })
      .catch(e => {
        console.error('Something went wrong adding to payments!', e);
      });
  }, [amount, checkoutNumber, marketerName, merchantTransactionID, selectedType, user]);

  const isHomeIdValid = useCallback(
    () =>
      !(homeid === null || homeid === undefined || typeof homeid === 'undefined' || homeid === ''),
    [homeid],
  );

  const addTransaction = useCallback(async () => {
    await firestore()
      .collection('transactions')
      .doc(merchantTransactionID)
      .set({
        createdAt: new Date(),
        amountPaid: amount,
        userId: user.uid,
        userName: user.displayName,
        merchantTransactionID,
        orderType: isHomeIdValid() ? 'order' : 'payment',
        paymentStatus: 'Processing',
        checkoutNumber,
      })
      .catch(e => {
        console.error('Something went wrong adding to payments!', e);
      });
  }, [amount, checkoutNumber, isHomeIdValid, merchantTransactionID, user]);

  const addHomeOrder = useCallback(async () => {
    await firestore()
      .collection('homeorders')
      .doc(merchantTransactionID)
      .set({
        userId: user.uid,
        userName: user.displayName,
        image: homeimage,
        title: hometitle,
        homeid,
        homeyears,
        homeMonths,
        homeWeeks,
        homeDays,
        merchantTransactionID,
        paymentStatus: 'Processing',
        bed: homebed,
        confirmCode: (Math.random() + 1).toString(36).substring(7).toUpperCase(),

        amount,

        latitude: homelatitude,
        longitude: homelongitude,
      })
      .catch(e => {
        console.error('Something went wrong adding to HomeOrders', e);
      });
  }, [
    amount,
    homeDays,
    homeMonths,
    homeWeeks,
    homebed,
    homeid,
    homeimage,
    homelatitude,
    homelongitude,
    hometitle,
    homeyears,
    merchantTransactionID,
    user,
  ]);

  const _storeData = useCallback(async () => {
    try {
      await AsyncStorage.setItem(auth().currentUser.uid, 'true');
    } catch (e) {
      console.error('Error saving data', e);
    }
  }, []);

  const generatePaymentUrl = useCallback(
    async () =>
      new Promise((resolve, reject) => {
        axios
          .post(
            'https://i08fhhbxwk.execute-api.us-east-2.amazonaws.com/dev/tingg/checkout-encryption',
            {
              requestAmount: amount,
              currencyCode: 'GHS',
              requestDescription: 'RentIt Payment',
              countryCode: 'GH',
              languageCode: 'en',
              serviceCode: 'RENTIZO',
              MSISDN: checkoutNumber,
              customerFirstName: user?.displayName ?? ' ',
              customerLastName: ' ',
              customerEmail: userEmail,
            },
          )
          .then(res => {
            setMerchantTransactionID(res.data?.requestBody?.merchantTransactionID);
            setPaymentUrl(res.data?.paymentUrl);
            resolve(res.data?.paymentUrl);
          })
          .catch(e => {
            console.error('Error generating payment url', e);

            setMerchantTransactionID(null);
            reject(e);
          });
      }),
    [amount, checkoutNumber, user?.displayName, userEmail],
  );

  const onMessage = useCallback(
    event => {
      __DEV__ && console.debug('event', event);

      const {url} = event.nativeEvent;
      const words = url.split('type=');
      const isSuccess = words[1] === 'success';
      const timestamp = new Date().getTime();
      const logData = {
        event,
        amount,
        timestamp,
        merchantTransactionID,
        type: selectedType,
        user_id: user.uid,
        duration: timestamp - startTime,
        route: route.params,
      };

      if (isSuccess) {
        mixpanel.track('payment-success', logData);
      } else {
        mixpanel.track('payment-failure', logData);
      }

      if (isSuccess) {
        if (navigation.canGoBack()) {
          if (homeid === null || homeid === undefined || homeid === '') {
            Alert.alert(
              'Payment Confirmation!',
              `Keep your confirmation code: ${merchantTransactionID}`,
              [{text: 'OK', onPress: () => console.debug('OK Pressed')}],
              {cancelable: false},
            );

            navigation.replace('Home');
          } else {
            Alert.alert('Payment successful. You will be redirected to your new home');
            addHomeOrder();
            deleteHome(homeid);
            deleteFromTrends(homeid);
            deleteFromFavorites(homeid);
            navigation.replace('House');
          }
        } else {
          _storeData();
          Alert.alert('Payment successful. Enjoy using RentIt to find your next home');

          navigation.replace('Home');
        }
      } else if (route.name === 'Address') {
        Alert.alert('Payment is', words[1]);
        navigation.goBack();
      } else {
        Alert.alert('Payment is', words[1]);
        navigation.replace('Home');
      }
    },
    [
      _storeData,
      addHomeOrder,
      amount,
      homeid,
      merchantTransactionID,
      navigation,
      route,
      selectedType,
      startTime,
      user,
    ],
  );

  const paymentSource = useMemo(() => ({uri: paymentUrl}), [paymentUrl]);

  // console.log({
  //   homeid,
  //   homeyears,
  //   homebed,
  //   homelatitude,
  //   homeimage,
  //   hometitle,
  //   homelongitude,
  // });

  useEffect(() => {
    mixpanel.track('payment-start', {
      amount,
      merchantTransactionID,
      type: selectedType,
      user_id: user.uid,
      route: route.params,
    });
    setStartTime(new Date().getTime());
  }, [amount, merchantTransactionID, route.params, selectedType, user.uid]);

  useEffect(() => {
    (async () => {
      await generatePaymentUrl();
    })();
  }, [generatePaymentUrl]);

  useEffect(() => {
    if (!paymentUrl) {
      return;
    }

    if (!isHomeIdValid()) {
      addPayment();
    }

    addTransaction();
  }, [addPayment, addTransaction, homeid, isHomeIdValid, paymentUrl]);

  return (
    <View style={containerStyle}>
      {paymentUrl ? (
        <WebView
          source={paymentSource}
          style={Dimensions.get('screen')}
          originWhitelist={originWhitelist}
          scalesPageToFit={false}
          scrollEnabled
          mixedContentMode="compatibility"
          thirdPartyCookiesEnabled
          domStorageEnabled
          startInLoadingState
          allowUniversalAccessFromFileURLs
          bounces={false}
          automaticallyAdjustContentInsets={false}
          hideKeyboardAccessoryView
          allowsLinkPreview={false}
          // onNavigationStateChange={navState => {
          //   if (!navState.url.includes("https://developer.tingg.africa/")) {
          //     // handle response here
          //     if (route.name === "Address") {
          //       Alert.alert("Payment cancelled", "Back button pressed")
          //       navigation.goBack();
          //       console.log(e);
          //     }
          //     else {
          //       navigation.replace('Home')
          //       Alert.alert("Payment cancelled", "Back button pressed");
          //     }
          //   }
          // }}
          onMessage={onMessage}
          javaScriptEnabled
        />
      ) : (
        <ActivityIndicator size={55} color="blue" />
      )}
      {/* <Paystack
        paystackKey="pk_live_6869737082c788c90a3ea0df0a62018c57fc6759"
        paystackSecretKey="sk_live_3c4468c7af13179692b7103e785206b6faf70b09"
        amount={amount}
        currency="ghs"
        channels={channel}
        billingEmail={userEmail}
        activityIndicatorColor="blue"
        showCancelButton={false}
        onCancel={e => {
          // handle response here
          if (route.name === 'Address') {
            Alert.alert('Payment cancelled', e.message);
            navigation.goBack();
            console.log(e);
          } else {
            navigation.replace('Home');
            Alert.alert('Payment cancelled', e.message);
          }
        }}
        onSuccess={res => {
          console.log(res);
          if (route.name === 'Address') {
            Alert.alert('Payment successful. You will be redirected to your new home');
            addHomeOrder();
            deleteHome(homeid);
            deleteFromTrends(homeid);
            deleteFromFavorites(homeid);
            navigation.replace('House');
          } else {
            Alert.alert('Payment successful. Enjoy using RentIt to find your next home');
            AsyncStorage.setItem('alreadyPaid', 'true');
            navigation.replace('Home');
          }
        }}
        autoStart={true}
      /> */}
    </View>
  );
};

export default PaymentScreen;
