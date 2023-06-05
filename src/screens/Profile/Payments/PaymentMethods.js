import React, {useMemo} from 'react';

import {Page, Whitespace, Divider, CardDisplay, Typography, Button} from '../../../components';

import arrowRight from '../../../assets/images/arrow-right.png';
import mastercard from '../../../assets/images/mastercard.png';

const PaymentMethods = () => {
  const sections = useMemo(
    () => [
      {
        description: 'Mastercard ****9089',
        location: (
          <Typography size={12} color="#717171">
            Expiration: 12/2026
          </Typography>
        ),
        image: mastercard,
        width: 33,
        height: 23,
      },
      {
        description: 'Mastercard ****9111',
        location: (
          <Typography size={12} color="#717171">
            Expiration: 12/2026
          </Typography>
        ),
        image: mastercard,
        width: 33,
        height: 23,
      },
    ],
    [],
  );

  return (
    <Page type="large" header="Payment Methods">
      <Typography type="notice" color="#717171" width="100%">
        Add and manage your payment method using our secure payment system.
      </Typography>

      <Whitespace marginTop={57} />

      {sections?.map(({description, image, width, height, location}) => (
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
            center
          />

          <Divider top={13} bottom={13} />
        </React.Fragment>
      ))}

      <Whitespace marginTop={54} />

      <Button type="tertiary" fitWidth>
        Add payment method
      </Button>
    </Page>
  );
};

export default PaymentMethods;
