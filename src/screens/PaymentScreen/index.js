import React, {useContext, useEffect, useRef, useState} from 'react';
import {Paystack} from 'react-native-paystack-webview';
import {Alert, Dimensions, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AuthContext} from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import * as mutations from '../../graphql/mutations';
import {API, graphqlOperation} from 'aws-amplify';
import {deletePost} from '../../graphql/mutations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {WebView} from 'react-native-webview';
const PaymentScreen = props => {
  const {user, logout} = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();

  const channel = route.params.channel;
  const amount = route.params.totalAmount;
  const userEmail = user.email;
  const homelatitude = route.params.homelatitude;
  const homelongitude = route.params.homelongitude;
  const homeimage = route.params.homeimage;
  const hometitle = route.params.hometitle;
  const homebed = route.params.homebed;

  const homeyears = route.params.homeyears;
  const homemonths = route.params.homemonths;
  const homeid = route.params.homeid;

  const [paymentUrl, setPaymentUrl] = useState(null);
  useEffect(() => {
    generatePaymentUrl();
  }, []);

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
          //console.log(doc.id);
          //console.log(doc.id, "=>", doc.data());
        });
      });
  };
  const deleteFromTrends = async id => {
    await firestore().collection('trends').doc(id).delete();
  };
  const deleteHome = async id => {
    try {
      let input = {
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

  //console.log({homemonths, homeyears, homebed, homelatitude, homeimage, hometitle, homelongitude});
  //console.log(channel);
  //console.log(homeid);
  const addHomeOrder = async () => {
    firestore()
      .collection('homeorders')
      .add({
        userId: user.uid,
        userName: user.displayName,
        image: homeimage,
        title: hometitle,
        homeid: homeid,
        homeyears: homeyears,
        homemonths: homemonths,

        bed: homebed,
        confirmCode: (Math.random() + 1)
          .toString(36)
          .substring(7)
          .toUpperCase(),

        amount: amount,

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

  const generatePaymentUrl = async () => {
    return new Promise(function (resolve, reject) {
      axios
        .post(
          `https://i08fhhbxwk.execute-api.us-east-2.amazonaws.com/dev/tingg/checkout-encryption`,
          {
            // requestAmount: amount,
            requestAmount: 20,
            currencyCode: 'GHS',
            requestDescription: 'Test merchant transaction',
            countryCode: 'GH',
            languageCode: 'en',
            MSISDN: '233240000000',
            customerFirstName: user?.displayName ?? ' ',
            customerLastName: ' ',
            customerEmail: userEmail,
          },
        )
        .then(res => {
          setPaymentUrl(res.data?.paymentUrl);
          resolve(res.data?.paymentUrl);
        })
        .catch(e => {
          console.log(e);
          reject(e);
        });
    });
  };
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
          scrollEnabled={true}
          mixedContentMode={'compatibility'}
          thirdPartyCookiesEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowUniversalAccessFromFileURLs={true}
          bounces={false}
          automaticallyAdjustContentInsets={false}
          hideKeyboardAccessoryView={true}
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
            const {title} = event.nativeEvent;
            if (title === 'success') {
              if (route.name === 'Address') {
                Alert.alert(
                  'Payment successful. You will be redirected to your new home',
                );
                addHomeOrder();
                deleteHome(homeid);
                deleteFromTrends(homeid);
                deleteFromFavorites(homeid);
                navigation.replace('House');
              } else {
                Alert.alert(
                  'Payment successful. Enjoy using RentIt to find your next home',
                );
                AsyncStorage.setItem('alreadyPaid', 'true');
                navigation.replace('Home');
              }
            } else {
              if (route.name === 'Address') {
                Alert.alert("Payment is", title);
                navigation.goBack();
              } else {
                Alert.alert("Payment is", title);
                navigation.replace('Home');
              }
            }
          }}
          javaScriptEnabled
        />
      ) : null}
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
