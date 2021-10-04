import React, { useRef } from 'react';
import  { Paystack }  from 'react-native-paystack-webview';
import { Alert, View } from 'react-native';




const PaymentScreen = (props) => {

    return (
        <View style={{
            alignItems:"center",
            justifyContent:"center",
            backgroundColor:"white", flex: 1 }}>
          <Paystack
            paystackKey="pk_test_bedc9911a1f1619ece111facd633b841c4f13ed5"
            paystackSecretKey="sk_test_1a9fa06fb692fa522ff82571c360d3f65673c658"
            amount={'25000.00'}
            currency="ghs"
            channels={["mobile_money", "card", "ussd"]}
            billingEmail="emensah.em77@gmail.com"
            activityIndicatorColor="green"
            onCancel={(e) => {
              // handle response here
              Alert.alert("Payment cancelled", e.message)
            }}
            onSuccess={(res) => {
              // handle response here
            }}
            autoStart={true}
          />
        </View>
      );
}

export default PaymentScreen;
