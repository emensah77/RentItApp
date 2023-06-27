import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';

const CheckoutScreen = props => {
  const navigation = useNavigation();
  const route = useRoute();
  // const url = route.params.url;
  return (
    <View style={{flex: 1}}>
      {/* <WebView
            javaScriptEnabled={true}
           // source={require("../../../assets/data/checkout.html")}
        style={{ marginTop: 20, flex:1}}
        /> */}

      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckoutScreen;
