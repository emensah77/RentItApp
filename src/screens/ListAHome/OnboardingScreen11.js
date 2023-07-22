import React, {useState, useCallback, useMemo, useEffect} from 'react';

import Base from './Base';

import {Container, Whitespace, Typography} from '../../components';

const OnboardingScreen11 = () => {
  const [data, setData] = useState({});
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState('');

  const items = useMemo(
    () => [
      {
        cur: 'US Dollar',
      },
      {
        cur: 'Ghana Cedis',
      },
    ],
    [],
  );

  const select = useCallback(
    _currency => () => {
      setCurrency(_currency);
    },
    [],
  );

  const decrement = useCallback(() => {
    setPrice(_price => _price - 50);
  }, []);

  const increment = useCallback(() => {
    setPrice(_price => _price + 50);
  }, []);

  useEffect(() => {
    setData({price, currency});
  }, [currency, price]);

  return (
    <Base
      index={11}
      total={12}
      isComplete={data.price && data.currency}
      data={data}
      title="Let's set the price of your home"
      label="You can change it anytime.">
      {items.map(({cur}) => (
        <React.Fragment key={cur}>
          <Container
            type={`chip${currency === cur ? '' : 'De'}Selected`}
            color="#FFF"
            height={50}
            width="100%"
            onPress={select(cur)}>
            <Typography
              type="notice"
              left
              width="100%"
              size={18}
              weight="700"
              onPress={select(cur)}>
              {cur}
            </Typography>
          </Container>

          <Whitespace marginTop={33} />
        </React.Fragment>
      ))}
      <Container center width="100%">
        <Container type="elevation" width="90%">
          <Container center row type="spaceBetween">
            <Container onPress={decrement}>
              <Typography center type="smallCircle" onPress={decrement}>
                -
              </Typography>
            </Container>

            <Whitespace marginLeft={20} />

            <Container type="input" width={100}>
              <Typography size={26} height={34} weight="800" type="notice" color="#1F2D3D">
                {price}
              </Typography>
            </Container>

            <Whitespace marginLeft={20} />

            <Container center onPress={increment}>
              <Typography center type="smallCircle" onPress={increment}>
                +
              </Typography>
            </Container>
          </Container>

          <Whitespace marginTop={10} />

          <Typography type="notice" center color="#4D4D4D" size={14} weight="400">
            per month
          </Typography>

          <Whitespace marginTop={20} />

          <Typography type="notice" center color="#4D4D4D" size={12} weight="400">
            Places like yours in your area usually ranges froom 200gh to 400gh
          </Typography>
        </Container>
      </Container>
    </Base>
  );
};

export default OnboardingScreen11;
