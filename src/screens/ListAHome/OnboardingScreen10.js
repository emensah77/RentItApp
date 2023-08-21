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

const OnboardingScreen10 = props => {
  const {
    route: {params: {imageUrls: iU} = {imageUrls: []}},
  } = props;

  const [data, setData] = useState({imageUrls: iU});

  const getImages = useCallback(imageUrls => {
    setData({imageUrls});
  }, []);

  return (
    <Base
      index={10}
      total={12}
      isComplete={data.imageUrls && data.imageUrls.length >= 5}
      data={data}
      inline>
      <View style={containerStyle}>
        <Typography height={30} type="heading" size={26} color="#1F2D3D" width="100%">
          Let&apos;s add pictures of your home.
        </Typography>

        <Whitespace marginTop={69} />

        <Upload imageNamePrefix="home" getImages={getImages} />
      </View>
    </Base>
  );
};

export default OnboardingScreen10;
