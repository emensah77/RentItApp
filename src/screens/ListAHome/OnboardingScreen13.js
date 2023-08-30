import React from 'react';

import Base from './Base';

import {Container, Whitespace, Typography, Image} from '../../components';

import iconMan from '../../assets/images/icon-man-reading.png';

const OnboardingScreen13 = () => (
  <Base index={13} total={17} isComplete>
    <Container center>
      <Image src={iconMan} width={279} height={245} />
    </Container>

    <Whitespace marginTop={70} />

    <Typography type="notice" size={18} color="#4D4D4D" weight="400" width="100%">
      Step 3
    </Typography>

    <Whitespace marginTop={15} />

    <Typography type="heading" size={26} color="#1F2D3D" width="100%">
      Finish and publish
    </Typography>

    <Whitespace marginTop={27} />

    <Typography type="regular" size={14} width="100%">
      In this step, we&apos;ll ask for your mobile phone number and if your home is negotiable or
      furnished, then finnaly some ID&apos;s and bills.
    </Typography>
  </Base>
);

export default OnboardingScreen13;
