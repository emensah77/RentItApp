import React, {useState, useCallback, useMemo} from 'react';

import Base from './Base';

import {Container, Whitespace, CardDisplay, Typography} from '../../components';

const OnboardingScreen4 = () => {
  const [selected, setSelected] = useState('');
  const [data, setData] = useState();

  const items = useMemo(
    () => [
      {
        title: 'For Rent',
        description:
          'You are renting your home to tenants, and require monthly payments and offering a stay limited by a time agreed upon.',
      },
      {
        title: 'For Sale',
        description:
          'You are selling your home for a stipulated amount and are not offering a stay limited by time.',
      },
    ],
    [],
  );

  const select = useCallback(
    mode => () => {
      setSelected(mode);
      setData({mode});
    },
    [],
  );

  return (
    <Base index={4} isComplete={!!data} data={data} title="Are you renting or selling your home?">
      {items.map(({title, description}) => (
        <React.Fragment key={title}>
          <Container
            type={`chip${selected === title ? '' : 'De'}Selected`}
            color="#FFF"
            height={100}
            width="100%"
            onPress={select(title)}>
            <CardDisplay
              name={
                <Typography type="notice" size={18} weight="700">
                  {title}
                </Typography>
              }
              description={
                <Typography type="notice" color="#4D4D4D" size={14} weight="500" width="100%">
                  {description}
                </Typography>
              }
              center
              bold
              onPress={select(title)}
            />
          </Container>

          <Whitespace marginTop={33} />
        </React.Fragment>
      ))}
    </Base>
  );
};

export default OnboardingScreen4;
