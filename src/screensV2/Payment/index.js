import React, {useCallback} from 'react';
import {View, FlatList, SafeAreaView} from 'react-native';
import Typography from '../../componentsV2/DataDisplay/Typography';
import {styles} from './styles';
import BottomSpace from '../../componentsV2/DataDisplay/BottomSpace/BottomSpace';
import Divider from '../../componentsV2/DataDisplay/Divider';

const Payment = () => {
  const data = [
    {
      text: '$157.68 x 5 nights',
      price: '$788.40',
    },
    {
      text: 'Long stay discount',
      price: '$788.40',
      green: true,
    },
    {
      text: 'Cleaning fee',
      price: '$788.40',
    },
    {
      text: 'Service fee',
      price: '$788.40',
      green: true,
    },
  ];
  const renderPayData = useCallback(({item}) => {
    return (
      <View style={styles.payData}>
        <Typography>{item.text}</Typography>
        <Typography style={item.green ? {color: 'green'} : ''}>{item.price}</Typography>
      </View>
    );
  }, []);
  return (
    <SafeAreaView>
      <View style={styles.mainContent}>
        <View style={styles.payBlock}>
          <FlatList data={data} renderItem={renderPayData} showsHorizontalScrollIndicator={false} />
          <View style={styles.total}>
            <View style={styles.totalLeft}>
              <Typography bold>Total</Typography>
              <Typography bold style={{textDecorationLine: 'underline'}}>
                (USD)
              </Typography>
            </View>
            <Typography bold>$743.36</Typography>
          </View>
          <Typography
            bold
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              textDecorationLine: 'underline',
              position: 'absolute',
              right: 0,
              bottom: -30,
            }}
          >
            More Info
          </Typography>
        </View>
      </View>
      <BottomSpace />
      <View style={styles.container}>
        <Typography bold style={{marginBottom: 10}}>
          Pay with
        </Typography>
        <View style={styles.payData}>
          <Typography>Pay</Typography>
          <Typography style={{textDecoration: 'underline'}} bold>
            Edit
          </Typography>
        </View>
        <Divider />
        <Typography style={{textDecoration: 'underline'}} bold>
          Enter a coupon
        </Typography>
      </View>
      <BottomSpace />
      <View style={styles.container}>
        <Typography bold>Required for your trip</Typography>
        <View>
          <Typography bold>Phone number</Typography>
          <Typography>441234567</Typography>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Payment;
