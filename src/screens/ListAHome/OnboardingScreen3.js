import React, {useState, useCallback} from 'react';

import Base from './Base';

import {Container, Whitespace, Typography, Image} from '../../components';
import {TYPES} from '../../utils';

const OnboardingScreen3 = props => {
  const {
    route: {params: {homeType} = {homeType: ''}},
  } = props;

  const [selected, setSelected] = useState(homeType);
  const [data, setData] = useState({homeType});

  const getUri = useCallback(uri => ({uri}), []);

  const select = useCallback(
    _homeType => () => {
      setSelected(_homeType);
      setData({homeType: _homeType});
    },
    [],
  );

  return (
    <Base
      index={3}
      isComplete={!!data.homeType}
      data={data}
      title="Which of these best describe your place?">
      {TYPES.HOME_TYPES.map(({value, image}) => (
        <React.Fragment key={value}>
          <Container row type="spaceBetween" onPress={select(value)}>
            <Typography
              type="notice"
              size={16}
              weight="800"
              color={selected === value ? '#0047B3' : '#1F2D3D'}>
              {value}
            </Typography>

            <Image src={getUri(image)} width={147} height={87} borderRadius={14} />
          </Container>

          <Whitespace marginTop={25} />
        </React.Fragment>
      ))}
    </Base>
  );
};

export default OnboardingScreen3;
