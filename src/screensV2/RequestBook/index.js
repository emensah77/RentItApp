import React from 'react';
import {Pressable, View, ScrollView, Image} from 'react-native';

import {styles} from './styles';

import Typography from '../../componentsV2/DataDisplay/Typography';
import RoomCardHorizontal from '../../componentsV2/DataDisplay/RoomCardHorizontal';
import Divider from '../../componentsV2/DataDisplay/Divider';
// import BottomSpace from '../../componentsV2/DataDisplay/BottomSpace';

import DateClockIcon from '../../../assets/data/images/icons/dateClock-icon.png';
import PayPalIcon from '../../../assets/data/images/icons/paypal-icon.png';
import CardIcon from '../../../assets/data/images/icons/card-icon.png';
import PlusIcon from '../../../assets/data/images/icons/plus-grey-icon.png';
import RentitGuaranteeImg from '../../../assets/data/images/RentitGuarantee.png';

const RequestBook = () => {
  return (
    <ScrollView>
      <View style={styles.content}>
        <RoomCardHorizontal
          title={'Entire home'}
          infoDateText={'Stunning Family home  close to the city centre'}
          infoBottomText={'4.76(28)'}
          infoSuperhost={'  Superhost'}
        />
        <Divider />
        <View style={styles.rentitImgTitle}>
          <Typography>Your booking is protected by</Typography>
          <Image source={RentitGuaranteeImg} style={styles.img} />
        </View>
      </View>
      <View style={styles.bottomSpace}></View>
      <View style={styles.content}>
        <Typography style={styles.title} bold>
          Your trip
        </Typography>
        <View style={styles.tripItem}>
          <View>
            <Typography style={styles.label}>Dates</Typography>
            <Typography style={styles.value}>30 Oct - 4 Nov</Typography>
          </View>
          <Pressable>
            <Typography style={styles.editText}>Edit</Typography>
          </Pressable>
        </View>
        <View style={styles.tripItem}>
          <View>
            <Typography style={styles.label}>Guests</Typography>
            <Typography style={styles.value}>4 guests, 1 infants</Typography>
          </View>
          <View>
            <Pressable>
              <Typography style={styles.editText}>Edit</Typography>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.bottomSpace}></View>
      <View style={styles.content}>
        <Typography style={styles.title} bold>
          Choose how to pay
        </Typography>
      </View>
      <View style={styles.bottomSpace}></View>
      <View style={styles.content}>
        <Typography style={styles.title} bold>
          Price details
        </Typography>
        <View style={styles.priceDetailItem}>
          <Typography style={styles.priceDetailLabel}>$157.68 x 5 nights</Typography>
          <Typography style={styles.priceDetailValue}>$788.40</Typography>
        </View>
        <View style={styles.priceDetailItem}>
          <Typography style={styles.priceDetailLabel}>Long stay discount</Typography>
          <Typography style={styles.priceDetailValueGreen}>-$118.25</Typography>
        </View>
        <View style={styles.priceDetailItem}>
          <Typography style={styles.priceDetailLabel}>Cleaning fee</Typography>
          <Typography>$73.21</Typography>
        </View>
        <View style={styles.priceDetailItem}>
          <Typography style={styles.priceDetailLabel}>Service fee</Typography>
          <Typography style={styles.priceDetailValueGreen}>$0.00</Typography>
        </View>
        <View style={styles.priceDetailTotal}>
          <Typography style={styles.priceDetailTotalLabel} bold>
            Total (USD)
          </Typography>
          <Typography style={styles.priceDetailTotalValueGreen} bold>
            $743.36
          </Typography>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Pressable>
            <Typography style={styles.moreButton}>More info</Typography>
          </Pressable>
        </View>
      </View>
      <View style={styles.bottomSpace}></View>
      <View style={styles.content}>
        <Typography style={styles.title} bold>
          Pay with
        </Typography>
        <View style={styles.paymentRow}>
          <View style={styles.payBox}>
            <Image style={styles.payIcon} source={PayPalIcon} />
            <Typography style={styles.payText}>Credit or debit card</Typography>
          </View>
          <Pressable>
            <Image source={PlusIcon} />
          </Pressable>
        </View>
        <View style={styles.paymentRow}>
          <View style={styles.payBox}>
            <Image style={styles.payIcon} source={CardIcon} />
            <Typography style={styles.payText}>PayPal</Typography>
          </View>
          <Pressable>
            <Image source={PlusIcon} />
          </Pressable>
        </View>
        <View style={styles.couponBox}>
          <Pressable>
            <Typography style={styles.couponButtonText}>Enter a coupon</Typography>
          </Pressable>
        </View>
      </View>
      <View style={styles.bottomSpace}></View>
      <View style={styles.content}>
        <Typography style={styles.title} bold>
          Required for your trip
        </Typography>
        <View style={styles.requiredForTripItem}>
          <View style={styles.requiredForTripTextBox}>
            <Typography variant="large" bold style={{marginBottom: 4}}>
              Message the host
            </Typography>
            <Typography variant="large">
              Let the host know why you’re travelling and when you’ll check in
            </Typography>
          </View>
          <Pressable style={styles.addRoundedButton}>
            <Typography style={styles.addRoundedButtonText}>Add</Typography>
          </Pressable>
        </View>
        <View style={styles.requiredForTripItem}>
          <View style={styles.requiredForTripTextBox}>
            <Typography variant="large" bold style={{marginBottom: 4}}>
              Profile photo
            </Typography>
            <Typography variant="large">
              Hosts want to know who’s staying at their place.
            </Typography>
          </View>
          <Pressable style={styles.addRoundedButton}>
            <Typography style={styles.addRoundedButtonText}>Add</Typography>
          </Pressable>
        </View>
      </View>
      <View style={styles.bottomSpace}></View>
      <View style={styles.content}>
        <Typography style={styles.title} bold>
          Cancellation policy
        </Typography>
        <Typography style={styles.cancellationText}>
          Free cancellation before 25 Oct. Cancel before check-in on 30 Oct for a partial refund.{' '}
          <Pressable>
            <Typography style={styles.cancellationMoreButtonText} bold>
              Learn more
            </Typography>
          </Pressable>
        </Typography>
      </View>
      <View style={styles.bottomSpace}></View>
      <View style={styles.content}>
        <View style={styles.reservationInfo}>
          <Image source={DateClockIcon} width={30} height={28} style={{marginRight: 16}} />
          <Typography variant="large" bold style={{width: '85%'}}>
            Your reservation won’t be confirmed until the host accepts your request (within 24
            hours).{' '}
            <Typography variant="large" style={{fontWeight: '400'}}>
              You wont be charged until then.
            </Typography>
          </Typography>
        </View>
      </View>
      <View style={styles.bottomSpace}></View>
      <View style={styles.content}>
        <Typography variant="default" style={{marginBottom: 20}}>
          By selecting the button below, I agree to the
          <Typography bold style={{paddingLeft: 4, textDecorationLine: 'underline'}}>
            Hosts House Rules, Rentit’s Rebooking and Refund Policy.
          </Typography>
          and that Rentit can charge my payment method if I’m responsible for damage. I agree to pay
          the total amount shown if the Host accepts my booking request. Payment Terms between you
          and Rentit Payments GH Ltd.
        </Typography>
      </View>
      {/* <BottomPace /> */}
      <Pressable style={styles.requestBookButton}>
        <Typography style={styles.requestBookButtonText} bold>
          Request to book
        </Typography>
      </Pressable>
    </ScrollView>
  );
};

export default RequestBook;
