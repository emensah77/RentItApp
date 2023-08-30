import React from 'react';

import Base from './Base';

import {Container, Whitespace, Typography, Image} from '../../components';

import iconMan from '../../assets/images/icon-man.png';

const OnboardingScreen8 = () => (
  <Base index={8} total={12} isComplete>
    <Container center>
      <Image src={iconMan} width={279} height={245} />
    </Container>

    <Whitespace marginTop={70} />

    <Typography type="notice" size={18} color="#4D4D4D" weight="400" width="100%">
      Step 2
    </Typography>

    <Whitespace marginTop={15} />

    <Typography type="heading" size={26} color="#1F2D3D" width="100%">
      Make it stand out
    </Typography>

    <Whitespace marginTop={27} />

    <Typography type="regular" size={14} width="100%">
      In this step, we&apos;ll ask you which type of amenities your home offers, pictures of your
      home, the location, the price.
    </Typography>
  </Base>
);

export default OnboardingScreen8;
