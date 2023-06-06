import React, {useMemo, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';

import {Page, Whitespace, Divider, CardDisplay, Typography} from '../../components';

// import logo from '../../assets/images/logo.png';
import user from '../../assets/images/menu/user.png';
import earnMoney from '../../assets/images/menu/earn-money.png';
import profile from '../../assets/images/menu/profile.png';
import payments from '../../assets/images/menu/payments.png';
import translation from '../../assets/images/menu/translation.png';
import notifications from '../../assets/images/menu/notifications.png';
import privacy from '../../assets/images/menu/privacy.png';
import listHome from '../../assets/images/menu/list-home.png';
import yourHome from '../../assets/images/menu/your-home.png';
import giftCard from '../../assets/images/menu/gift-card.png';
// import legal from '../../assets/images/menu/legal.png';
// import help from '../../assets/images/menu/help.png';
// import feedback from '../../assets/images/menu/feedback.png';
// import contact from '../../assets/images/menu/contact.png';
// import safetyCenter from '../../assets/images/menu/safety-center.png';
import becomeMarketer from '../../assets/images/menu/become-marketer.png';
// import dashboardMarketer from '../../assets/images/menu/dashboard-marketer.png';
import arrowRight from '../../assets/images/arrow-right.png';

const Menu = () => {
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
        heading: 'Account Settings',
        items: [
          {
            description: 'Personal Information',
            image: profile,
            width: 23.85,
            height: 23.85,
            onPress: goTo('AccountDetails'),
          },
          {
            description: 'Payments and payouts',
            image: payments,
            width: 22,
            height: 17.5,
            onPress: goTo('PaymentsAndPayouts'),
          },
          {
            description: 'Translation',
            image: translation,
            width: 22,
            height: 17.5,
          },
          {
            description: 'Notifications',
            image: notifications,
            width: 19.7,
            height: 22.7,
            onPress: goTo('PaymentsAndPayouts'),
          },
          {
            description: 'Privacy and sharing',
            image: privacy,
            width: 19,
            height: 22,
          },
        ],
      },
      {
        heading: 'Hosting',
        items: [
          {
            description: 'List your space',
            image: listHome,
            width: 24.04,
            height: 22.62,
          },
          {
            description: 'Your Homes',
            image: yourHome,
            width: 29,
            height: 28,
          },
        ],
      },
      {
        heading: 'Referrals & Credits',
        items: [
          {
            description: 'Gift cards',
            location: 'Send or redeem a gift card',
            image: giftCard,
            width: 23.5,
            height: 17.5,
          },
        ],
      },
      {
        heading: 'Tools',
        items: [
          {
            description: 'Become a marketer',
            image: becomeMarketer,
            width: 30,
            height: 30,
            onPress: goTo('BecomeAMarketer'),
          },
          // {
          //   description: 'Marketer Dashboard',
          //   image: dashboardMarketer,
          //   width: 27,
          //   height: 18.78,
          // },
        ],
      },
      // {
      //   heading: 'Support',
      //   items: [
      //     {
      //       description: 'How Rentit works',
      //       image: logo,
      //       width: 23.5,
      //       height: 17.5,
      //     },
      //     {
      //       description: 'Safety Center',
      //       location: 'Get the support, tools and information you need to be safe',
      //       image: safetyCenter,
      //       width: 19,
      //       height: 22.5,
      //     },
      //     {
      //       description: 'Contact Neighbourhood Support',
      //       location:
      //         'Let our team know about concerns related to home sharing activity in your area',
      //       image: contact,
      //       width: 24,
      //       height: 20.5,
      //     },
      //     {
      //       description: 'Get help',
      //       image: help,
      //       width: 24,
      //       height: 24,
      //     },
      //     {
      //       description: 'Give us feedback',
      //       image: feedback,
      //       width: 20.53,
      //       height: 20.29,
      //     },
      //   ],
      // },
      // {
      //   heading: 'Legal',
      //   items: [
      //     {
      //       description: 'Terms of service',
      //       image: legal,
      //       width: 22.5,
      //       height: 23.7,
      //     },
      //     {
      //       description: 'Privacy Policy',
      //       image: legal,
      //       width: 22.5,
      //       height: 23.7,
      //     },
      //   ],
      // },
    ],
    [goTo],
  );

  return (
    <Page
      leftIcon={user}
      rightIcon={arrowRight}
      onLeftIconPress={goTo('AccountDetails')}
      header={
        <Typography onPress={goTo('AccountDetails')} type="heading" left width="45%">
          Matt{'\n'}
          <Typography type="regular" size={11} left color="#717171">
            Show Profile
          </Typography>
        </Typography>
      }>
      <CardDisplay
        leftImageWidth={37.37}
        leftImageHeight={33.84}
        leftImageSrc={earnMoney}
        numberOfLines={1}
        description={
          <Typography type="regular" size={15} color="#252525">
            Earn money from your extra space
          </Typography>
        }
        status={
          <Typography type="link" size={14} color="#252525">
            Learn More
          </Typography>
        }
        bold
      />

      <Divider top={28} bottom={41} />

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
                spaceBetween
              />

              <Divider top={13} bottom={13} />
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </Page>
  );
};

export default Menu;
