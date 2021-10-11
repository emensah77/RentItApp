import React, {useContext, useRef } from 'react';
import  { Paystack }  from 'react-native-paystack-webview';
import { Alert, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {AuthContext} from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';


const PaymentScreen = (props) => {
  
  const navigation = useNavigation();
  const route = useRoute();
  const {user, logout} = useContext(AuthContext);
  const channel = route.params.channel;
  const amount = route.params.totalAmount;
  const userEmail = user.email;
  const homelatitude = route.params.homelatitude;
  const homelongitude = route.params.homelongitude;
  const homeimage = route.params.homeimage;
  const hometitle = route.params.hometitle;
  const homebed = route.params.homebed;
  console.log({homebed, homelatitude, homeimage, hometitle, homelongitude});
  //console.log(channel);
  //console.log(amount);
  const addHomeOrder = async () => {
    firestore()
    .collection('homeorders')
    .add({
        userId: user.uid,
        userName: user.displayName,
        image: homeimage,
        title: hometitle,
        
        
        bed: homebed,
        
        amount: amount,
        
        latitude: homelatitude,
        longitude: homelongitude,
        
    })
    .then((docRef) =>{
        
        
        console.log('Added to Home Orders');
    })
    .catch((error) => {
        console.log('Something went wrong adding to HomeOrders', error);
    });
    }

    return (
        <View style={{
            alignItems:"center",
            justifyContent:"center",
            backgroundColor:"white", flex: 1 }}>
          <Paystack
            paystackKey="pk_test_bedc9911a1f1619ece111facd633b841c4f13ed5"
            paystackSecretKey="sk_test_1a9fa06fb692fa522ff82571c360d3f65673c658"
            amount={amount}
            currency="ghs"
            channels={channel}
            billingEmail={userEmail}
            activityIndicatorColor="blue"
            onCancel={(e) => {
              // handle response here
              console.log(e);
              navigation.goBack();
              Alert.alert("Payment cancelled", e.message)
            }}
            onSuccess={(res) => {
              Alert.alert("Payment successful. You will be redirected to your new home",);
              addHomeOrder();
              navigation.navigate('House');
              
              console.log(res);
            }}
            autoStart={true}
          />
        </View>
      );
}

export default PaymentScreen;
