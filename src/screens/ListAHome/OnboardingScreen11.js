import React, {useState, useCallback, useEffect} from 'react';

import Base from './Base';

import {Container, Whitespace, Typography, Input} from '../../components';

import {TYPES} from '../../utils';

const OnboardingScreen11 = props => {
  const {
    route: {params: {price: p, currency: c} = {price: 0, currency: ''}},
  } = props;

  const [data, setData] = useState({});
  const [price, setPrice] = useState(p);
  const [currency, setCurrency] = useState(c);

  const select = useCallback(
    _currency => () => {
      setCurrency(_currency);
    },
    [],
  );

  const decrement = useCallback(() => {
    setPrice(_price => (parseInt(_price, 10) - 50 <= 0 ? 0 : parseInt(_price, 10) - 50));
  }, []);

  const increment = useCallback(() => {
    setPrice(_price => (parseInt(_price, 10) + 50 <= 0 ? 0 : parseInt(_price, 10) + 50));
  }, []);

  useEffect(() => {
    setData({price, currency});
  }, [currency, price]);

  return (
    <Base
      index={11}
      total={12}
      isComplete={data.price > 0 && !!data.currency}
      data={data}
      title="Let's set the price of your home"
      label="You can change it anytime.">
      {TYPES.CURRENCIES.map(({value}) => (
        <React.Fragment key={value}>
          <Container
            type={`chip${currency === value ? '' : 'De'}Selected`}
            color="#FFF"
            height={50}
            width="100%"
            onPress={select(value)}>
            <Typography
              type="notice"
              left
              width="100%"
              size={18}
              weight="700"
              onPress={select(value)}>
              {value}
            </Typography>
          </Container>

          <Whitespace marginTop={33} />
        </React.Fragment>
      ))}

      <Container center width="100%">
        <Container type="elevation" width="90%">
          <Container center row type="spaceBetween">
            <Container type="smallCircle" center onPress={decrement}>
              <Typography center onPress={decrement}>
                -
              </Typography>
            </Container>

            <Whitespace marginLeft={20} />

            <Container width={100}>
              <Input placeholder="0" type="text" value={`${price}`} onChange={setPrice} />
            </Container>

            <Whitespace marginLeft={20} />

            <Container type="smallCircle" center onPress={increment}>
              <Typography center onPress={increment}>
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
