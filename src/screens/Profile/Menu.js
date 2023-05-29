import React from 'react';

import {Page, Whitespace, Divider, CardDisplay, Typography} from '../../components';

import menu from '../../assets/images/menu.png';
import earnMoney from '../../assets/images/menu/earn-money.png';
import profile from '../../assets/images/menu/profile.png';
import payments from '../../assets/images/menu/payments.png';
import translation from '../../assets/images/menu/translation.png';

const Menu = () => {
  return (
    <Page
      // leftIcon={user}
      rightIcon={menu}
      header={
        <Typography type="heading" left>
          Matt{'\n'}
          <Typography type="regular" size={11} left color="#717171">
            Show Profile
          </Typography>
        </Typography>
      }>
      <Whitespace marginTop={-15} />

      <CardDisplay
        imageWidth={38}
        imageHeight={38}
        imageSrc={earnMoney}
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

      <Whitespace marginTop={-35} />

      <Divider />

      <Typography type="heading" left width="100%">
        Account Settings
      </Typography>

      <Whitespace marginTop={24} />

      {[
        {
          title: 'Personal Information',
          image: profile,
          width: 23.85,
          height: 23.85,
        },
        {
          title: 'Payments and payouts',
          image: payments,
          width: 22,
          height: 17.5,
        },
        {
          title: 'Translation',
          image: translation,
          width: 22,
          height: 17.5,
        },
      ].map(({title, image, width, height}) => (
        <React.Fragment key={title}>
          <CardDisplay imageWidth={width} imageHeight={height} imageSrc={image} name={title} />

          <Whitespace marginTop={-65} />

          <Divider />

          <Whitespace marginTop={-10} />
        </React.Fragment>
      ))}
    </Page>
  );
};

export default Menu;
