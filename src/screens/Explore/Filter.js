import React, {useState, useCallback, useEffect} from 'react';
import {ScrollView} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import Location from '../Authentication/Location';

import {
  Page,
  Divider,
  Typography,
  Whitespace,
  Image,
  CardDisplay,
  Container,
  Button,
} from '../../components';

import * as global from '../../assets/styles/global';
import knob from '../../assets/images/knob.png';
import checked from '../../assets/images/checked.png';
import unchecked from '../../assets/images/unchecked.png';
import switchOn from '../../assets/images/switch-on.png';
import switchOff from '../../assets/images/switch-off.png';
import arrowUp from '../../assets/images/arrow-up.png';
import arrowDown from '../../assets/images/arrow-down.png';
import house from '../../assets/images/property-types/house.png';
import guesthouse from '../../assets/images/property-types/guesthouse.png';
import apartment from '../../assets/images/property-types/apartment.png';
import hotel from '../../assets/images/property-types/hotel.png';
import houseBlue from '../../assets/images/property-types/house-blue.png';
import guesthouseBlue from '../../assets/images/property-types/guesthouse-blue.png';
import apartmentBlue from '../../assets/images/property-types/apartment-blue.png';
import hotelBlue from '../../assets/images/property-types/hotel-blue.png';
// import temp3 from '../../assets/images/temp/temp3.png';

const originalSelection = {
  placeType: '',
  bedrooms: 0,
  beds: 0,
  bathrooms: 0,
  propertyTypes: '',
  amenities: [],
  mode: '',
  bookingOptions: [],
  all: {
    placeTypes: [
      {title: 'Entire place', description: 'A place all to yourself'},
      {
        title: 'Private room',
        description: 'Your own room in a home or a hotel, plus some shared common spaces',
      },
      {
        title: 'Shared room',
        description: 'A sleeping space and common areas that may be shared with others',
      },
    ],
    roomsAndBeds: [{title: 'Bedrooms'}, {title: 'Beds'}, {title: 'Bathrooms'}],
    amenities: [
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
    ],
    modes: [
      {
        title: 'For Rent',
        description: 'Easy access to the property once you arrive',
      },
      {
        title: 'For Sale',
        description: 'Book without waiting for the host to respond',
      },
    ],
    bookingOptions: [
      {
        title: 'Instant Book',
        description: 'Easy access to the property once you arrive',
      },
      {
        title: 'Self check-in',
        description: 'Book without waiting for the host to respond',
      },
      {
        title: 'Free cancellation',
        description: 'Only show stays that offer free cancellation',
      },
    ],
  },
};

const Explore = () => {
  const [more, setMore] = useState(false);
  const [priceRange, setPriceRange] = useState([1, 50000]);
  const [count, setCount] = useState(0);
  const [selection, setSelection] = useState(JSON.parse(JSON.stringify(originalSelection)));

  const navigation = useNavigation();

  const goToSearch = useCallback(
    () => navigation.navigate('Search', {params: selection}),
    [navigation, selection],
  );

  const reset = useCallback(() => {
    setSelection(JSON.parse(JSON.stringify(originalSelection)));
  }, []);

  const toggleMore = useCallback(() => {
    setMore(!more);
  }, [more]);

  const isSelected = useCallback(
    (item, key) => {
      if (typeof selection[item] !== 'object') {
        return selection[item] === key;
      }
      return selection[item].includes(key);
    },
    [selection],
  );

  const onToggleSelection = useCallback(
    (item, key) => () => {
      let newItems;
      if (typeof selection[item] !== 'object') {
        newItems = key;
      } else {
        if (isSelected(item, key)) {
          newItems = selection[item].filter(elem => elem !== key);
        } else {
          newItems = selection[item];
          newItems.push(key);
        }
      }

      setSelection({
        ...selection,
        [item]: newItems,
      });
    },
    [selection, isSelected],
  );

  const customMarker = useCallback(
    ({pressed}) => <Image src={knob} width={pressed ? 40 : 23} height={pressed ? 40 : 23} />,
    [],
  );

  useEffect(() => {
    (async () => {
      const userLocation = JSON.parse((await AsyncStorage.getItem('position')) || '{}');
      const request = await fetch(
        'https://o0ds966jy0.execute-api.us-east-2.amazonaws.com/prod/filter',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            ...selection.all.amenities.concat(selection.all.modes).reduce(
              (prev, {title}) => ({
                ...prev,
                [title.toLowerCase()]: isSelected('amenities', title) ? 'Yes' : 'No',
              }),
              {},
            ),
            type: selection.placeType,
            bedroom: selection.bedrooms,
            bed: selection.beds,
            bathroom: selection.bathrooms,
            userLocation: {
              latitude: userLocation.latitude,
              longitud: userLocation.longitude,
            },
          }),
        },
      ).catch(e => console.error('Filter Request Failure:', e));
      const response = await request.json();

      setCount(oldCount => oldCount + (parseInt(response.length, 10) || 0));
    })().catch(console.error);
  }, [isSelected, selection]);

  // console.log('selection', selection, priceRange);

  return (
    <Page
      header="Filters"
      footer={
        <Container row type="spaceBetween" width="100%">
          <Container type="center" onPress={reset}>
            <Typography color="#000000" type="link">
              Clear all
            </Typography>
          </Container>

          <Button type="standard" left width="100%" onPress={goToSearch}>
            Show {count} homes
          </Button>
        </Container>
      }>
      <Location noRender />

      <Typography type="heading" left width="100%">
        Price range
      </Typography>

      <Whitespace marginTop={24} />

      <Typography type="regular" left size={16} color="#252525">
        $10 - $10,000+
      </Typography>

      <Whitespace marginTop={8} />

      <Typography type="regular" left size={14} color="#717171">
        The average nightly price is $235
      </Typography>

      <Whitespace marginTop={25} />

      <Container type="center">
        <MultiSlider
          min={0}
          max={100000}
          step={100}
          values={priceRange}
          onValuesChange={setPriceRange}
          selectedStyle={{backgroundColor: global.colors.primary}}
          customMarker={customMarker}
          // imageBackgroundSource={temp3}
        />
      </Container>

      <Divider top={25} />

      <Typography type="heading" left width="100%">
        Type of place
      </Typography>

      {selection.all.placeTypes.map(({title, description}) => (
        <React.Fragment key={title}>
          <Whitespace marginTop={25} />

          <CardDisplay
            rightImageWidth={24}
            rightImageHeight={24}
            rightImageSrc={isSelected('placeType', title) ? checked : unchecked}
            onPress={onToggleSelection('placeType', title)}
            name={
              <Typography size={16} weight="500" left width="100%">
                {title}
              </Typography>
            }
            description={
              <Typography size={14} weight="500" color="#717171" left width="100%">
                {description}
              </Typography>
            }
          />
        </React.Fragment>
      ))}

      <Divider top={25} />

      <Typography type="heading" left width="100%">
        Rooms and beds
      </Typography>

      {selection.all.roomsAndBeds.map(({title}) => (
        <React.Fragment key={title}>
          <Whitespace marginTop={23} />

          <Typography size={16} left width="100%">
            {title}
          </Typography>

          <Whitespace marginTop={24} />

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <>
              <Container
                type={`chip${isSelected(title.toLowerCase(), 0) ? 'Selected' : 'DeSelected'}`}
                onPress={onToggleSelection(title.toLowerCase(), 0)}>
                <Typography
                  color={isSelected(title.toLowerCase(), 0) ? '#FFFFFF' : '#000000'}
                  weight="700"
                  size={14}>
                  Any
                </Typography>
              </Container>

              {Array.from(new Array(30)).map((_, i) => (
                <Container
                  key={Math.random()}
                  type={`chip${isSelected(title.toLowerCase(), i + 1) ? 'Selected' : 'DeSelected'}`}
                  onPress={onToggleSelection(title.toLowerCase(), i + 1)}>
                  <Typography
                    color={isSelected(title.toLowerCase(), i + 1) ? '#FFFFFF' : '#000000'}
                    weight="700"
                    size={14}>
                    {i + 1}
                  </Typography>
                </Container>
              ))}
            </>
          </ScrollView>
        </React.Fragment>
      ))}

      <Divider top={25} />

      <Typography type="heading" left width="100%">
        Property type
      </Typography>

      <Whitespace marginTop={25} />

      <Container width="100%" height={121} row type="spaceAround">
        <Container
          width="45%"
          height={121}
          onPress={onToggleSelection('propertyTypes', 'house')}
          type={isSelected('propertyTypes', 'house') ? 'selected' : 'deselected'}>
          <Image
            src={isSelected('propertyTypes', 'house') ? houseBlue : house}
            width={30}
            height={30}
          />

          <Typography
            type="left"
            color={isSelected('propertyTypes', 'house') ? '#0047B3' : '#252525'}
            weight="800"
            size={16}>
            House
          </Typography>
        </Container>

        <Whitespace marginLeft={16} width={2} />

        <Container
          width="45%"
          height={121}
          onPress={onToggleSelection('propertyTypes', 'apartment')}
          type={isSelected('propertyTypes', 'apartment') ? 'selected' : 'deselected'}>
          <Image
            src={isSelected('propertyTypes', 'apartment') ? apartmentBlue : apartment}
            width={30}
            height={30}
          />

          <Typography
            type="left"
            color={isSelected('propertyTypes', 'apartment') ? '#0047B3' : '#252525'}
            weight="800"
            size={16}>
            Apartment
          </Typography>
        </Container>
      </Container>

      <Whitespace marginTop={25} />

      <Container width="100%" height={121} row type="spaceAround">
        <Container
          width="45%"
          height={121}
          onPress={onToggleSelection('propertyTypes', 'guesthouse')}
          type={isSelected('propertyTypes', 'guesthouse') ? 'selected' : 'deselected'}>
          <Image
            src={isSelected('propertyTypes', 'guesthouse') ? guesthouseBlue : guesthouse}
            width={30}
            height={30}
          />

          <Typography
            type="left"
            color={isSelected('propertyTypes', 'guesthouse') ? '#0047B3' : '#252525'}
            weight="800"
            size={16}>
            Guesthouse
          </Typography>
        </Container>

        <Whitespace marginLeft={16} width={2} />

        <Container
          width="45%"
          height={121}
          onPress={onToggleSelection('propertyTypes', 'hotel')}
          type={isSelected('propertyTypes', 'hotel') ? 'selected' : 'deselected'}>
          <Image
            src={isSelected('propertyTypes', 'hotel') ? hotelBlue : hotel}
            width={30}
            height={30}
          />

          <Typography
            type="left"
            color={isSelected('propertyTypes', 'hotel') ? '#0047B3' : '#252525'}
            weight="800"
            size={16}>
            Hotel
          </Typography>
        </Container>
      </Container>

      <Divider top={25} />

      <Typography type="heading" left width="100%">
        Amenities
      </Typography>

      <Whitespace marginTop={25} />

      {selection.all.amenities.map(
        ({title}, i) =>
          ((!more && i < 3) || more) && (
            <React.Fragment key={title}>
              <CardDisplay
                rightImageWidth={24}
                rightImageHeight={24}
                rightImageSrc={isSelected('amenities', title) ? checked : unchecked}
                onPress={onToggleSelection('amenities', title)}
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

      <Container row type="flexStart" onPress={toggleMore}>
        <Typography type="heading" left width={95}>
          Show {more ? 'less' : 'more'}
        </Typography>

        <Container type="flexStart">
          <Image src={more ? arrowUp : arrowDown} width={10} height={6} />
        </Container>
      </Container>

      <Divider top={25} />

      <Typography type="heading" left width="100%">
        Mode
      </Typography>

      {selection.all.modes.map(({title}) => (
        <React.Fragment key={title}>
          <Whitespace marginTop={25} />

          <CardDisplay
            rightImageWidth={48}
            rightImageHeight={32}
            rightImageSrc={isSelected('mode') ? switchOn : switchOff}
            onPress={onToggleSelection('mode')}
            name={
              <Typography size={16} weight="500" left width="100%">
                {title}
              </Typography>
            }
          />
        </React.Fragment>
      ))}

      {/* <Divider top={25} />

      <Typography type="heading" left width="100%">
        Booking options
      </Typography>

      {selection.all.bookingOptions.map(({title, description}) => (
        <React.Fragment key={title}>
          <Whitespace marginTop={25} />

          <CardDisplay
            rightImageWidth={48}
            rightImageHeight={32}
            rightImageSrc={isSelected('bookingOptions') ? switchOn : switchOff}
            onPress={onToggleSelection('bookingOptions')}
            name={
              <Typography size={16} weight="500" left width="100%">
                {title}
              </Typography>
            }
            description={
              <Typography size={14} weight="500" color="#717171" left width="100%">
                {description}
              </Typography>
            }
          />
        </React.Fragment>
      ))} */}
    </Page>
  );
};

export default Explore;
