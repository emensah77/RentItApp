import React from 'react';

import {Page, Whitespace, Divider, Typography, Button} from '../../../components';

const PaymentsAndPayouts = () => {
  return (
    <Page type="large" header="Credits and coupons">
      <Whitespace marginTop={23} />

      <Typography type="heading" left width="100%">
        Gift Credit
      </Typography>

      <Whitespace marginTop={23} />

      <Button type="tertiary" fitWidth>
        Add gift card
      </Button>

      <Divider />

      <Typography type="heading" left width="100%">
        Coupons
      </Typography>

      <Whitespace marginTop={15} />

      <Typography type="notice" left width="100%">
        Your coupons
      </Typography>

      <Whitespace marginTop={23} />

      <Button type="tertiary" fitWidth>
        Add gift coupon
      </Button>
    </Page>
  );
};

export default PaymentsAndPayouts;
