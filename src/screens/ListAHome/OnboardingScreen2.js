import React from 'react';

import Base from './Base';

import {Container, Whitespace, Typography, Image} from '../../components';

import iconWoman from '../../assets/images/icon-woman.png';

const OnboardingScreen2 = () => (
  <Base index={2} isComplete>
    <Container center>
      <Image src={iconWoman} width={279} height={245} />
    </Container>

    <Whitespace marginTop={70} />

    <Typography type="notice" size={18} color="#4D4D4D" weight="400" width="100%">
      Step 1
    </Typography>

    <Whitespace marginTop={15} />

    <Typography type="heading" size={26} color="#1F2D3D" width="100%">
      Tell us about your place
    </Typography>

    <Whitespace marginTop={27} />

    <Typography type="regular" size={14} width="100%">
      In this step, we&apos;ll ask you which type of property you have and if guest will book the
      entire place or just a room.
    </Typography>
  </Base>
);

export default OnboardingScreen2;
