import React, {useContext, useEffect, useRef, useState} from 'react';
import {Paystack} from 'react-native-paystack-webview';
import {ActivityIndicator, Alert, Dimensions, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {API, graphqlOperation} from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {WebView} from 'react-native-webview';
import auth from '@react-native-firebase/auth';
import {deletePost} from '../../graphql/mutations';
import * as mutations from '../../graphql/mutations';
import {AuthContext} from '../../navigation/AuthProvider';

const PaymentScreen = props => {
  const {user, logout} = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();

  const {channel} = route.params;
  const amount = route.params.totalAmount;
  const userEmail = user.email;
  const {homelatitude} = route.params;
  const {homelongitude} = route.params;
  const {homeimage} = route.params;
  const {hometitle} = route.params;
  const {homebed} = route.params;

  const {homeyears} = route.params;
  const {homeMonths} = route.params;
  const {homeWeeks} = route.params;
  const {homeDays} = route.params;
  const {homeid} = route.params;
  const {selectedType} = route.params;
  const {checkoutNumber} = route.params;

  const [paymentUrl, setPaymentUrl] = useState(null);
  const [merchantTransactionID, setMerchantTransactionID] = useState(null);

  useEffect(() => {
    (async () => {
      await generatePaymentUrl();
    })();
  }, []);

  useEffect(() => {
    if (!paymentUrl) {
      return;
    }

    if (homeid === null) {
      addPayment();
    }

    addTransaction();
  }, [paymentUrl]);

  const deleteFromFavorites = async id => {
    const ref = firestore().collection('posts');
    ref
      .where('id', '==', id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          firestore()
            .collection('posts')
            .doc(doc.id)
            .delete()
            .then(() => {
              console.log('Deleted from favorite posts!');
            });
          // console.log(doc.id);
          // console.log(doc.id, "=>", doc.data());
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
      const deletedTodo = await API.graphql(
        graphqlOperation(deletePost, {
          input,
        }),
      );
      console.log('Succesfully deleted the post');
    } catch (e) {
      console.log('Error deleting post', e);
    }
  };

  // console.log({homemonths, homeyears, homebed, homelatitude, homeimage, hometitle, homelongitude});
  // console.log(channel);
  // console.log(homeid);
  const addPayment = async () => {
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
      })
      .then(docRef => {
        console.log('Added to payments');
      })
      .catch(error => {
        console.log('Something went wrong adding to payments!', error);
      });
  };

  const addTransaction = async () => {
    await firestore()
      .collection('transactions')
      .doc(merchantTransactionID)
      .set({
        createdAt: new Date(),
        amountPaid: amount,
        userId: user.uid,
        userName: user.displayName,
        merchantTransactionID,
        orderType: homeid === null ? 'payment' : 'order',
        paymentStatus: 'Processing',
        checkoutNumber,
      })
      .then(docRef => {
        console.log('Added to transactions');
      })
      .catch(error => {
        console.log('Something went wrong adding to payments!', error);
      });
  };

  const addHomeOrder = async () => {
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
      .then(docRef => {
        console.log('Added to Home Orders');
      })
      .catch(error => {
        console.log('Something went wrong adding to HomeOrders', error);
      });
  };

  const _storeData = async () => {
    try {
      await AsyncStorage.setItem(auth().currentUser.uid, 'true');
    } catch (error) {
      console.log('Error saving data', error);
    }
  };
  const generatePaymentUrl = async () =>
    new Promise((resolve, reject) => {
      axios
        .post(
          'https://i08fhhbxwk.execute-api.us-east-2.amazonaws.com/dev/tingg/checkout-encryption',
          {
            // requestAmount: amount,

            requestAmount: JSON.stringify(amount),
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
          console.log(e);
          setMerchantTransactionID(null);
          reject(e);
        });
    });
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        flex: 1,
      }}>
      {paymentUrl ? (
        <WebView
          source={{uri: paymentUrl}}
          style={{
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height,
          }}
          originWhitelist={['*']}
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
          onMessage={event => {
            const {url} = event.nativeEvent;
            const words = url.split('type=');
            if (words[1] === 'success') {
              console.log('event', event);
              if (navigation.canGoBack()) {
                if (homeid === null) {
                  Alert.alert(
                    'Payment Confirmation!',
                    'Keep your confirmation code: ' + `${merchantTransactionID}`,
                    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
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
          }}
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
            onCancel={(e) => {
              // handle response here
              if (route.name === "Address"){
                Alert.alert("Payment cancelled", e.message)
              navigation.goBack();
              console.log(e);
              }
              else{
                navigation.replace('Home')
                Alert.alert("Payment cancelled", e.message)
              }

            }}
            onSuccess={(res) => {
              console.log(res);
              if (route.name === "Address"){
                Alert.alert("Payment successful. You will be redirected to your new home",);
                addHomeOrder();
              deleteHome(homeid);
              deleteFromTrends(homeid);
              deleteFromFavorites(homeid);
              navigation.replace('House');
              }
              else{
                Alert.alert("Payment successful. Enjoy using RentIt to find your next home",);
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
