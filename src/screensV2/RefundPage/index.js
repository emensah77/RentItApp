import React from 'react';
import {View, Pressable, Image, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {styles} from './styles';

import Typography from '../../componentsV2/DataDisplay/Typography';
import Divider from '../../componentsV2/DataDisplay/Divider';
import RoomCardHorizontal from '../../componentsV2/DataDisplay/RoomCardHorizontal';

import CloseIcon from '../../../assets/data/images/icons/close-icon.png';
import RefundIcon from '../../../assets/data/images/icons/refund-icon.png';
import RoundCheckIcon from '../../../assets/data/images/icons/round-check-icon.png';

const RefundPage = () => {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <>
      <ScrollView>
        <Pressable style={styles.closeBox} onPress={goBack}>
          <Image source={CloseIcon} width={24} height={24} />
        </Pressable>
        <View style={styles.content}>
          <Typography style={styles.titleCenter} bold>
            Refund status
          </Typography>
          <Image
            source={RefundIcon}
            width={57}
            height={52}
            style={{alignSelf: 'center', marginBottom: 42}}
          />
          <Typography style={styles.mainPrice} bold>
            $49.19
          </Typography>
          <Typography style={styles.mainSubtitle}>Your refund is on its way!</Typography>
          <Typography style={styles.mainText}>
            We’ll send your refund right away. Contact your bank if you haven’t received it by Aug
            28 -- it may take them 3-5 days to deposit it in your account.{' '}
          </Typography>
        </View>
        <View style={styles.content}>
          <Typography style={styles.detailsTitle}>Details</Typography>
          <View style={styles.detailsRow}>
            <Typography style={styles.detailsRowText}>Refund amount</Typography>
            <Typography style={styles.detailsRowText}>$49.19 (USD)</Typography>
          </View>
          <View style={styles.detailsRow}>
            <Typography style={styles.detailsRowText}>Payment method</Typography>
            <Typography style={styles.detailsRowText}>MASTERCARD ... 4322</Typography>
          </View>
          <Divider />
          <View style={styles.detailSteps}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 60}}>
              <Image source={RoundCheckIcon} width={25} height={25} style={{marginRight: 3}} />
              <View
                style={{width: 16, height: 1, backgroundColor: '#000000', marginRight: 16}}></View>
              <View>
                <Typography style={styles.detailStepsTitle}>Refund initiated</Typography>
                <Typography style={styles.detailStepsText}>Aug 23</Typography>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 60}}>
              <Image source={RoundCheckIcon} width={25} height={25} style={{marginRight: 3}} />
              <View
                style={{width: 16, height: 1, backgroundColor: '#000000', marginRight: 16}}></View>
              <View>
                <Typography style={styles.detailStepsTitle}>Refund sent</Typography>
                <Typography style={styles.detailStepsText}>Aug 23</Typography>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={RoundCheckIcon} width={25} height={25} style={{marginRight: 3}} />
              <View
                style={{width: 16, height: 1, backgroundColor: '#000000', marginRight: 16}}></View>
              <View>
                <Typography style={styles.detailStepsTitle}>Estimated arrival</Typography>
                <Typography style={styles.detailStepsText}>By Aug 28</Typography>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.content}>
          <Typography style={styles.yourReservationTitle} bold>
            Your reservation
          </Typography>
          <RoomCardHorizontal
            title={'Stunning Family home  close to the city centre'}
            statusText={'canceled'}
            infoText={'Reservation code: HBACDEFQAZKC '}
          />
        </View>
      </ScrollView>
      <View style={styles.getReceipButtonBox}>
        <Pressable style={styles.getReceipButton}>
          <Typography style={styles.getReceipButtonText} bold>
            Get receipt
          </Typography>
        </Pressable>
      </View>
    </>
  );
};

export default RefundPage;
