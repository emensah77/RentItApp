import React, {useState, useCallback} from 'react';
import {View} from 'react-native';

import Base from './Base';

import {Typography, Whitespace, Upload} from '../../components';
import {global} from '../../assets/styles';

const containerStyle = [
  global.flex,
  {backgroundColor: '#FFF', minHeight: '100%'},
  global.pageContent,
];

const OnboardingScreen16 = props => {
  const {
    route: {params: {idUrls: iU} = {idUrls: []}},
  } = props;

  const [data, setData] = useState({idUrls: iU});

  const getImages = useCallback(idUrls => {
    setData({idUrls});
  }, []);

  return (
    <Base
      index={16}
      total={17}
      isComplete={data.idUrls && data.idUrls.length > 0}
      data={data}
      isFinal={true}
      inline>
      <View style={containerStyle}>
        <Typography height={30} type="heading" size={26} color="#1F2D3D" width="100%">
          We need to verify your home
        </Typography>

        <Typography type="notice" weight="400" size={14} color="#4D4D4D" width="100%">
          Take a picture of your ID card and electricity bill of your home.
        </Typography>

        <Whitespace marginTop={69} />

        <Upload imageNamePrefix="id" getImages={getImages} />
      </View>
    </Base>
  );
};

export default OnboardingScreen16;
