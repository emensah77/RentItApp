import React, {useState, useCallback, useEffect} from 'react';
import {ScrollView} from 'react-native';
import {API, graphqlOperation} from 'aws-amplify';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import {listPosts} from '../../graphql/queries';

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
  placeTypes: [],
  bedrooms: 0,
  beds: 0,
  bathrooms: 0,
  propertyTypes: [],
  amenities: [],
  bookingOptions: [],
};
const Explore = () => {
  const [more, setMore] = useState(false);
  const [priceRange, setPriceRange] = useState([1, 50000]);
  const [nextToken, setNextToken] = useState(null);
  const [count, setCount] = useState(0);
  const [selection, setSelection] = useState(JSON.parse(JSON.stringify(originalSelection)));

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
      const limit = 1000000;
      const filter = {
        and: {
          bedroom: {
            ge: selection.bedrooms,
          },
          bed: {
            ge: selection.beds,
          },
          bathroomNumber: {
            ge: selection.bathrooms,
          },
          wifi: {
            attributeExists: isSelected('amenities', 'wifi'),
          },
          kitchen: {
            attributeExists: isSelected('amenities', 'kitchen'),
          },
          water: {
            attributeExists: isSelected('amenities', 'water'),
          },
          toilet: {
            attributeExists: isSelected('amenities', 'essentials'),
          },
          aircondition: {
            attributeExists: isSelected('amenities', 'air-conditioning'),
          },
          status: {eq: 'APPROVED'},
        },
      };
      const filterResults = await API.graphql(
        graphqlOperation(listPosts, {filter, nextToken, limit}),
      );
      const {listPosts: listPostsResult} = filterResults?.data;

      const _count = listPostsResult?.items?.length;
      if (_count >= limit) {
        setNextToken(listPostsResult?.nextToken);
        return setCount(oldCount => oldCount + _count);
      }
      return setCount(_count);
    })().catch(console.error);
  }, [isSelected, nextToken, selection]);

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

          <Button type="standard" left width="100%">
            Show {count} homes
          </Button>
        </Container>
      }>
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

      {[
        {title: 'Entire place', description: 'A place all to yourself', slug: 'entire-place'},
        {
          title: 'Private room',
          description: 'Your own room in a home or a hotel, plus some shared common spaces',
          slug: 'private-room',
        },
        {
          title: 'Shared room',
          description: 'A sleeping space and common areas that may be shared with others',
          slug: 'shared-room',
        },
      ].map(({title, description, slug}) => (
        <React.Fragment key={title}>
          <Whitespace marginTop={25} />

          <CardDisplay
            rightImageWidth={24}
            rightImageHeight={24}
            rightImageSrc={isSelected('placeTypes', slug) ? checked : unchecked}
            onPress={onToggleSelection('placeTypes', slug)}
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

      {[{title: 'Bedrooms'}, {title: 'Beds'}, {title: 'Bathrooms'}].map(({title}) => (
        <React.Fragment key={title}>
          <Whitespace marginTop={23} />

          <Typography size={16} left width="100%">
            {title}
          </Typography>

          <Whitespace marginTop={24} />

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Container row>
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
            </Container>
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

      {[
        {title: 'Wifi', slug: 'wifi'},
        {title: 'Free Parking', slug: 'free-parking'},
        {title: 'Kitchen', slug: 'kitchen'},
        {title: 'Hot tub', slug: 'hot-tub'},
        {title: 'Washing machine', slug: 'washing-machine'},
        {title: 'Pool', slug: 'pool'},
        {title: 'Essentials', slug: 'essentials'},
        {title: 'Dryer', slug: 'dryer'},
        {title: 'Air conditioning', slug: 'air-conditioning'},
        {title: 'Heating', slug: 'heating'},
        {title: 'Water', slug: 'water'},
        {title: 'Dedicated Workspace', slug: 'dedicated-workspace'},
      ].map(
        ({title, slug}, i) =>
          ((!more && i < 3) || more) && (
            <React.Fragment key={title}>
              <CardDisplay
                rightImageWidth={24}
                rightImageHeight={24}
                rightImageSrc={isSelected('amenities', slug) ? checked : unchecked}
                onPress={onToggleSelection('amenities', slug)}
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
        Booking options
      </Typography>

      {[
        {
          title: 'Instant Book',
          description: 'Easy access to the property once you arrive',
          slug: 'instant-book',
        },
        {
          title: 'Self check-in',
          description: 'Book without waiting for the host to respond',
          slug: 'self-check-in',
        },
        {
          title: 'Free cancellation',
          description: 'Only show stays that offer free cancellation',
          slug: 'free-cancellation',
        },
      ].map(({title, description, slug}) => (
        <React.Fragment key={title}>
          <Whitespace marginTop={25} />

          <CardDisplay
            rightImageWidth={48}
            rightImageHeight={32}
            rightImageSrc={isSelected('bookingOptions', slug) ? switchOn : switchOff}
            onPress={onToggleSelection('bookingOptions', slug)}
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
    </Page>
  );
};

export default Explore;
