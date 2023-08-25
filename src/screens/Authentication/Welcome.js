import React, {useEffect, useCallback, useState} from 'react';
import {Dimensions} from 'react-native';
import Swiper from 'react-native-swiper';
import {useNavigation} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import {Container, Image, Typography, Whitespace, Button} from '../../components';

import logoWhite from '../../assets/images/logo-white.png';
import one from '../../assets/images/welcome/1.png';
import two from '../../assets/images/welcome/2.png';
import three from '../../assets/images/welcome/3.png';

const Welcome = () => {
  const [index, setIndex] = useState(0);

  const {width, height} = Dimensions.get('window');

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const navigation = useNavigation();

  const goTo = useCallback(async () => {
    navigation.navigate('Email');
  }, [navigation]);

  return (
    <Container type="flex" width="100%" height="100%">
      <Container row center type="top-80" zIndex={1000}>
        <Image src={logoWhite} width={35} height={56} />

        <Whitespace marginLeft={14} />

        <Typography size={25} height={26} weight="bold" color="#FFFFFF" type="levelTwoThick">
          Find your next home
        </Typography>
      </Container>

      <Container type="flex" width="100%" height={0.7 * height}>
        <Swiper
          autoplay
          loop
          showsButtons={false}
          dot={<></>}
          activeDot={<></>}
          onIndexChanged={setIndex}>
          <Image src={one} width={width} height={0.7 * height} mode="stretch" />
          <Image src={two} width={width} height={0.7 * height} mode="stretch" />
          <Image src={three} width={width} height={0.7 * height} mode="stretch" />
        </Swiper>
      </Container>

      <Whitespace marginBottom={20} />

      <Container>
        <Container center>
          <Typography
            size={21}
            height={26}
            weight="200"
            color="#194CC3"
            accessibilityLabel="welcomemessage">
            Buy, Sell, Rent a Home
          </Typography>
        </Container>

        <Whitespace marginTop={20} />

        <Container center>
          <Button
            accessibilityLabel="Go To Email"
            width={121}
            type="tertiary"
            fitWidth
            onPress={goTo}
            color="#194CC3">
            Begin
          </Button>
        </Container>

        <Whitespace marginTop={20} />

        <Container row center>
          {Array.from(new Array(3)).map((_, i) => (
            <Whitespace
              key={Math.random()}
              width={index === i ? 109 : 18}
              backgroundColor={index === i ? '#194CC3' : '#D9D9D9'}
              height={5}
              borderRadius={144}
              marginHorizontal={5}
            />
          ))}
        </Container>
      </Container>

      <Whitespace marginBottom={10} />
    </Container>
  );
};

export default Welcome;
