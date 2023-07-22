import React, {useState, useCallback, useMemo} from 'react';

import Base from './Base';

import {Input, Typography, CardDisplay, Whitespace, Container, Image} from '../../components';

import checked from '../../assets/images/checked.png';
import unchecked from '../../assets/images/unchecked.png';
import arrowUp from '../../assets/images/arrow-up.png';
import arrowDown from '../../assets/images/arrow-down.png';

const amenities = [
  {title: 'Wifi'},
  {title: 'Free Parking'},
  {title: 'Kitchen'},
  {title: 'Hot tub'},
  {title: 'Washing machine'},
  {title: 'Pool'},
  {title: 'Essentials'},
  {title: 'Dryer'},
  {title: 'Air conditioning'},
  {title: 'Heating'},
  {title: 'Water'},
  {title: 'Dedicated Workspace'},
];

const maxInitialShow = 3;

const OnboardingScreen9 = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState({});
  const [more, setMore] = useState(false);
  const [selected, setSelected] = useState([]);

  const filteredAmenities = useMemo(
    () =>
      amenities.filter(({title}) => {
        if (!search) {
          return true;
        }
        const regExp = new RegExp(search, 'ig');
        return regExp.test(title);
      }),
    [search],
  );

  const toggleMore = useCallback(() => {
    setMore(!more);
  }, [more]);

  const onToggleSelection = useCallback(
    title => () => {
      let _amenities = [];
      if (selected.includes(title)) {
        _amenities = selected.filter(item => item !== title);
      } else {
        _amenities = [...selected, title];
      }
      setSelected(_amenities);
      setData({amenities: _amenities});
    },
    [selected],
  );

  return (
    <Base
      index={9}
      total={12}
      isComplete={!!data.amenities}
      data={data}
      title="Tell your guest what your place has to offer.">
      <Input placeholder="Search categories" type="text" value={search} onChange={setSearch} />

      <Whitespace marginTop={38} />

      {filteredAmenities.length > 0 ? (
        <Typography type="heading" left width="100%">
          Amenities
        </Typography>
      ) : (
        <Typography type="heading" left width="100%">
          Nothing to show
        </Typography>
      )}

      <Whitespace marginTop={38} />

      {filteredAmenities.map(
        ({title}, i) =>
          ((!more && i < maxInitialShow) || more) && (
            <React.Fragment key={title}>
              <CardDisplay
                rightImageWidth={24}
                rightImageHeight={24}
                rightImageSrc={selected.includes(title) ? checked : unchecked}
                onPress={onToggleSelection(title)}
                name={
                  <Typography size={16} weight="500" left width="100%">
                    {title}
                  </Typography>
                }
              />

              <Whitespace marginTop={25} />
            </React.Fragment>
          ),
      )}

      {filteredAmenities.length > maxInitialShow ? (
        <Container row type="flexStart" onPress={toggleMore}>
          <Typography type="heading" left width={95}>
            Show {more ? 'less' : 'more'}
          </Typography>

          <Container type="flexStart">
            <Image src={more ? arrowUp : arrowDown} width={10} height={6} />
          </Container>
        </Container>
      ) : null}
    </Base>
  );
};

export default OnboardingScreen9;
