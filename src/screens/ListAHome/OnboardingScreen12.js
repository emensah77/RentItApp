import React, {useState, useCallback, useRef} from 'react';
import {View, Modal} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';

import Base from './Base';

import Location from '../Authentication/Location';

import {Typography, Whitespace, Container, Image, Loader, Input} from '../../components';

import {global} from '../../assets/styles';
import locationPin from '../../assets/images/location-pin.png';

navigator.geolocation = require('react-native-geolocation-service');

const query = {
  key: 'AIzaSyBbnGmg020XRNU_EKOTXpmeqbCUCsEK8Ys',
  language: 'en',
  components: 'country:gh',
};

const styles = {
  textInputContainer: global.inputContainer,
  textInput: global.input,
};

const textInputProps = defaultValue => ({autoFocus: true, defaultValue});

const containerStyle = [
  global.flex,
  {backgroundColor: '#FFF', minHeight: '100%'},
  global.pageContent,
];

Geocoder.init(query.key);

const OnboardingScreen11 = props => {
  const {
    route: {
      params: {latitude, longitude, locality, address, sublocality} = {
        latitude: '',
        longitude: '',
        locality: '',
        address: '',
        sublocality: '',
      },
    },
  } = props;

  const [data, setData] = useState({
    latitude,
    longitude,
    locality,
    address,
    sublocality,
  });
  const [location, setLocation] = useState({
    latitude,
    longitude,
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const ref = useRef();

  const toggleModal = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const getPosition = useCallback(({coords}) => {
    setLocation({latitude: coords.latitude, longitude: coords.longitude});
  }, []);

  const onPress = useCallback(
    async (_, details = null) => {
      if (!details) {
        return;
      }

      const _locality = details?.address_components?.find?.(component =>
        component.types.includes('locality'),
      )?.short_name;
      const _subLocality = details?.address_components?.find?.(
        component =>
          component.types.includes('sublocality') || component.types.includes('neighborhood'),
      )?.short_name;
      const _address = ref.current.getAddressText() || details.formatted_address;

      setData({
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        locality: _locality,
        sublocality: _subLocality,
        address: _address,
      });
      ref.current?.setAddressText(_address);
      toggleModal();
    },
    [toggleModal],
  );

  const reverseGeolocate = useCallback(() => {
    setLoading(true);

    // Reverse geocoding to get the address details
    Geocoder.from(location.latitude, location.longitude)
      .then(json => {
        setLoading(false);
        onPress(undefined, json.results[0], true);
      })
      .catch(console.error);
  }, [location, onPress]);

  const renderRow = useCallback(
    item => (
      <Container width="100%">
        {item.isCurrentLocation || item.isPredefinedPlace ? (
          <>
            <Whitespace marginTop={10} />

            <Typography weight="800" width="100%" color="#252525" left size={14}>
              {item.description}
            </Typography>
          </>
        ) : (
          <>
            <Whitespace marginTop={15} />

            <Container row type="spaceBetween">
              <Container
                center
                type="smallBorderRadius"
                color="#F2F2F2"
                left
                height={50}
                width={50}>
                <Image src={locationPin} width={20} height={25} />
              </Container>

              <Typography weight="800" width="80%" color="#252525" left size={14}>
                {item.description || `${item.name}, ${item.vicinity}`}
              </Typography>
            </Container>

            <Whitespace marginTop={10} />
          </>
        )}
      </Container>
    ),
    [],
  );

  const renderUseMyCurrentLocation = useCallback(
    (callback, marginLeft) => (
      <Container onPress={callback}>
        <Whitespace marginTop={10} />

        <Container row>
          <Whitespace marginLeft={marginLeft} />

          <Typography weight="800" width={155} color="#252525" left size={14}>
            Use my current location
          </Typography>

          {loading ? <Loader /> : null}
        </Container>
      </Container>
    ),
    [loading],
  );

  return (
    <Base index={12} total={12} isComplete={!!data.latitude} data={data} inline>
      <Location noRender getPosition={getPosition} />

      <Whitespace marginTop={30} />

      <View style={containerStyle}>
        <Typography height={30} type="heading" size={26} color="#1F2D3D" width="100%">
          Where&apos;s your home located?
        </Typography>

        <Whitespace marginTop={69} />

        <Input
          placeholder="Type where your home is located"
          value={data.address || ''}
          type="text"
          onFocus={toggleModal}
          onChange={toggleModal}
        />

        {open ? (
          <Modal animationType="slide" visible>
            <GooglePlacesAutocomplete
              ref={ref}
              fetchDetails
              suppressDefaultStyles
              minLength={2}
              textInputProps={textInputProps(data.address || '')}
              isRowScrollable={false}
              listViewDisplayed={false}
              keyboardShouldPersistTaps="handled"
              keepResultsAfterBlur={false}
              returnKeyType="search"
              disableScroll={false}
              enablePoweredByContainer={false}
              placeholder="Type where your home is located"
              onPress={onPress}
              styles={styles}
              query={query}
              renderRow={renderRow}
              onFail={console.error}
              onNotFound={console.error}
              onTimeout={console.error}
            />

            {renderUseMyCurrentLocation(reverseGeolocate, 15)}
          </Modal>
        ) : null}

        {renderUseMyCurrentLocation(toggleModal, 0)}
      </View>
    </Base>
  );
};

export default OnboardingScreen11;
