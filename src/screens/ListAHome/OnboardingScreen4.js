import React, {useState, useCallback} from 'react';

import Base from './Base';

import {Container, Whitespace, CardDisplay, Typography} from '../../components';
import {TYPES} from '../../utils';

const OnboardingScreen4 = props => {
  const {
    route: {params: {mode} = {mode: ''}},
  } = props;

  const [selected, setSelected] = useState(mode);
  const [data, setData] = useState({mode});

  const select = useCallback(
    _mode => () => {
      setSelected(_mode);
      setData({mode: _mode});
    },
    [],
  );

  return (
    <Base
      index={4}
      isComplete={!!data.mode}
      data={data}
      title="Are you renting or selling your home?">
      {TYPES.MODES.map(({value, description}) => (
        <React.Fragment key={value}>
          <Container
            type={`chip${selected === value ? '' : 'De'}Selected`}
            color="#FFF"
            height={100}
            width="100%"
            onPress={select(value)}>
            <CardDisplay
              name={
                <Typography type="notice" size={18} weight="700">
                  {value}
                </Typography>
              }
              description={
                <Typography type="notice" color="#4D4D4D" size={14} weight="500" width="100%">
                  {description}
                </Typography>
              }
              center
              bold
              onPress={select(value)}
            />
          </Container>

          <Whitespace marginTop={33} />
        </React.Fragment>
      ))}
    </Base>
  );
};

export default OnboardingScreen4;
