import React from 'react';

import Base from './Base';

import {Container, Whitespace, Typography, Image, CardDisplay} from '../../components';

import iconWoman from '../../assets/images/icon-woman.png';
import iconMan from '../../assets/images/icon-man.png';
import iconManReading from '../../assets/images/icon-man-reading.png';

const STEPS = [
  {
    title: '1 Tell us about your place',
    description: 'Share some basic info like how \nmany guests can stay.',
    image: iconWoman,
  },
  {
    title: '2 Make it stand out',
    description: "Upload 5 or more photos plus a title\n and description, we'll help you out.",
    image: iconMan,
  },
  {
    title: '3 Finish up and publish',
    description: 'Set a starting price, and publish \nyour listing.',
    image: iconManReading,
  },
];

const OnboardingScreen1 = () => {
  return (
    <Base index={1} isComplete title="It's easy to get started on Rentit">
      {STEPS.map(({title, description, image}) => (
        <React.Fragment key={title}>
          <CardDisplay
            numberOfLines={2}
            name={
              <Typography height={24} size={18} weight="700" color="#1F2D3D" width="100%">
                {title}
              </Typography>
            }
            description={
              <Typography size={14} weight="500" color="#4D4D4D" width="100%">
                {description}
              </Typography>
            }
            suffix={
              <Container row>
                <Whitespace marginLeft={-50} />

                <Image src={image} width={79} height={72} />
              </Container>
            }
          />

          <Whitespace marginTop={50} />
        </React.Fragment>
      ))}
    </Base>
  );
};

export default OnboardingScreen1;
