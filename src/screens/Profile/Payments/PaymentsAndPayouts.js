import React, {useMemo, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';

import {Page, Whitespace, Divider, CardDisplay, Typography} from '../../../components';

import logo from '../../../assets/images/logo.png';
import paymentsDark from '../../../assets/images/menu/payments-dark.png';
import donation from '../../../assets/images/menu/donation.png';
import hamburger from '../../../assets/images/menu/hamburger.png';
import coupon from '../../../assets/images/menu/coupon.png';
import paymentMethod from '../../../assets/images/menu/payment-method.png';
import transactionHistory from '../../../assets/images/menu/transaction-history.png';
import arrowRight from '../../../assets/images/arrow-right.png';

const PaymentsAndPayouts = () => {
  const navigation = useNavigation();

  const goTo = useCallback(
    route => () => {
      navigation.push(route);
    },
    [navigation],
  );

  const sections = useMemo(
    () => [
      {
        heading: '',
        items: [
          {
            description: 'Payments methods',
            image: paymentsDark,
            width: 22,
            height: 17.5,
            onPress: goTo('PaymentMethods'),
          },
          {
            description: 'Your payments',
            image: hamburger,
            width: 16,
            height: 12,
            onPress: goTo('YourPayments'),
          },
          {
            description: 'Credit & coupons',
            image: coupon,
            width: 22.5,
            height: 20.25,
            onPress: goTo('CreditAndCoupons'),
          },
          {
            description: 'Rentit pay',
            image: logo,
            width: 22.5,
            height: 23.7,
            onPress: goTo('RentItPay'),
          },
        ],
      },
      {
        heading: 'Hosting',
        items: [
          {
            description: 'Payout methods',
            image: paymentMethod,
            width: 23.99,
            height: 29.53,
          },
          {
            description: 'Donations: Get started',
            image: donation,
            width: 30,
            height: 30,
          },
          {
            description: 'Transaction history',
            image: transactionHistory,
            width: 28,
            height: 28,
          },
        ],
      },
    ],
    [goTo],
  );

  return (
    <Page type="large" header="Payments & Payouts">
      <Whitespace marginTop={18} />

      {sections.map(({heading, items}, i) => (
        <React.Fragment key={heading}>
          {!i ? null : <Whitespace marginTop={44} />}

          <Typography type="heading" left width="100%">
            {heading}
          </Typography>

          <Whitespace marginTop={24} />

          {items?.map(({description, image, width, height, location, onPress}) => (
            <React.Fragment key={description}>
              <CardDisplay
                leftImageWidth={width}
                leftImageHeight={height}
                leftImageSrc={image}
                name={description}
                date={location}
                rightImageWidth={6.5}
                rightImageHeight={12.5}
                rightImageSrc={arrowRight}
                onPress={onPress}
                center
              />

              <Divider top={13} bottom={13} />
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </Page>
  );
};

export default PaymentsAndPayouts;
