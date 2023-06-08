import React from 'react';
import {View, Pressable, Image, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';

import Divider from '../../componentsV2/DataDisplay/Divider';
import Typography from '../../componentsV2/DataDisplay/Typography';
import RoomCardHorizontal from '../../componentsV2/DataDisplay/RoomCardHorizontal';
import RefundDetailsItem from '../../componentsV2/DataDisplay/RefundDetailsItem';

const ConfirmCancellation = () => {
  const navigation = useNavigation();
  const goRefundPage = () => {
    navigation.navigate('Refund');
  };
  return (
    <>
      <ScrollView>
        <View style={styles.mainContent}>
          <Pressable style={{marginBottom: 24}}>
            <Image source={BackArrow} width={24} height={24} />
          </Pressable>
          <Typography variant="xlarge" bold style={{marginBottom: 30}}>
            Confirm cancellation
          </Typography>
          <RoomCardHorizontal
            title={'Stunning Family home  close to the city centre'}
            infoDateText={'February 13 - February 14, 2023'}
            infoText={'1 adult'}
          />
          <Divider />
          <View style={styles.cancellationPolicy}>
            <View style={styles.cancellationPolicyHead}>
              <Typography bold style={styles.policyText}>
                Cancellation policy
              </Typography>
              <Pressable>
                <Typography style={styles.cancelText}>Read more</Typography>
              </Pressable>
            </View>
            <Typography style={styles.cancellationPolicyText}>
              Full refund: Get back 100% of what you paid.
            </Typography>
          </View>
          <View style={styles.myPayments}>
            <View style={{marginBottom: 24}}>
              <Typography style={styles.myPaymentsTitle}>You’ve paid</Typography>
              <Typography style={styles.myPaymentsText}>$49.19</Typography>
            </View>
            <View>
              <Typography style={styles.myPaymentsTitle}>Your refund</Typography>
              <Typography style={styles.myPaymentsText}>$49.19</Typography>
            </View>
          </View>
          <View style={styles.refundDetails}>
            <Typography style={styles.refundDetailsTitle} bold>
              Refund details
            </Typography>
            <RefundDetailsItem title={'Accommodation'} price={'$32.00'} paid={'$32.00'} />
            <RefundDetailsItem title={'Cleaning fee'} price={'$10.00'} paid={'$10.00'} />
            <RefundDetailsItem title={'Service fee'} price={'$5.93'} paid={'$5.93'} />
            <RefundDetailsItem title={'Taxes'} price={'$1.26'} paid={'$1.26'} />
            <Divider />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 16,
              }}>
              <Typography variant="large" bold>
                Total refund
              </Typography>
              <Typography variant="large" bold>
                $49.19
              </Typography>
            </View>
          </View>
          <View style={styles.textInfoBox}>
            <Typography style={styles.textInfo}>
              Your reservation will be canceled immediatley and you’ll be refunded within 10
              business days.
            </Typography>
          </View>
        </View>
      </ScrollView>
      <View style={styles.cancelButtonBox}>
        <Pressable style={styles.cancelButton} onPress={goRefundPage}>
          <Typography style={styles.cancelButtonText} bold>
            Cancel reservation
          </Typography>
        </Pressable>
      </View>
    </>
  );
};

export default ConfirmCancellation;
