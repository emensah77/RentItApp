import React, {useState, useMemo, useCallback, useEffect} from 'react';

import Base from './Base';

import {Container, Typography, Divider} from '../../components';
import {TYPES} from '../../utils';

const OnboardingScreen5 = props => {
  const {
    route: {
      params: {bedRoomCount, bathRoomsCount, bedCount} = {
        bedRoomCount: 0,
        bathRoomsCount: 0,
        bedCount: 0,
      },
    },
  } = props;

  const [entry, setEntry] = useState({
    bedRoomCount,
    bathRoomsCount,
    bedCount,
  });
  const [data, setData] = useState({
    bedRoomCount,
    bathRoomsCount,
    bedCount,
  });

  const isComplete = useMemo(() => !Object.values(data).some(num => num === 0), [data]);

  const select = useCallback(
    (operation, type) => () => {
      const value = operation === '-' ? entry[type] - 1 : entry[type] + 1;
      setEntry({
        ...entry,
        [type]: value < 0 ? 0 : value,
      });
    },
    [entry],
  );

  useEffect(() => {
    setData(entry);
  }, [entry]);

  return (
    <Base index={5} isComplete={isComplete} data={data} title="How many bedrooms and bathrooms?">
      {TYPES.FACILITIES.map(({value, id}) => (
        <React.Fragment key={id}>
          <Container row type="spaceBetween">
            <Typography type="notice">{value}</Typography>

            <Container row type="spaceBetween" width={125}>
              <Container center type="smallCircle" onPress={select('-', id)}>
                <Typography onPress={select('-', id)}>-</Typography>
              </Container>

              <Typography size={16} type="notice" color="#0047B3">
                {entry[id]}
              </Typography>

              <Container center type="smallCircle" onPress={select('+', id)}>
                <Typography onPress={select('+', id)}>+</Typography>
              </Container>
            </Container>
          </Container>

          <Divider marginTop={10} />
        </React.Fragment>
      ))}
    </Base>
  );
};

export default OnboardingScreen5;
