import React, {useState, useMemo, useCallback, useEffect} from 'react';

import Base from './Base';

import {Container, Typography, Divider} from '../../components';

const facilities = [
  {title: 'Beds', id: 'bedCount'},
  {title: 'Bedrooms', id: 'bedRoomCount'},
  {title: 'Bathrooms', id: 'bathRoomsCount'},
];

const OnboardingScreen5 = () => {
  const [entry, setEntry] = useState({
    bedRoomCount: 0,
    bathRoomsCount: 0,
    bedCount: 0,
  });
  const [data, setData] = useState({});

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
      {facilities.map(({title, id}) => (
        <React.Fragment key={id}>
          <Container row type="spaceBetween">
            <Typography type="notice">{title}</Typography>

            <Container row type="spaceBetween" width={125}>
              <Container onPress={select('-', id)}>
                <Typography center type="smallCircle" onPress={select('-', id)}>
                  -
                </Typography>
              </Container>

              <Typography size={16} type="notice" color="#0047B3">
                {entry[id]}
              </Typography>

              <Container center onPress={select('+', id)}>
                <Typography center type="smallCircle" onPress={select('+', id)}>
                  +
                </Typography>
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
