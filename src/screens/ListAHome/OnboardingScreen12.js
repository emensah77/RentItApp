import React, {useState, useCallback} from 'react';
import {View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import Base from './Base';

import {Typography, Whitespace, Container, Image} from '../../components';

import {global} from '../../assets/styles';
import locationPin from '../../assets/images/location-pin.png';

const query = {
  key: 'AIzaSyBbnGmg020XRNU_EKOTXpmeqbCUCsEK8Ys',
  language: 'en',
  components: 'country:gh',
};

const styles = {
  textInputContainer: global.inputContainer,
  textInput: global.input,
};

const containerStyle = [
  global.flex,
  {backgroundColor: '#FFF', minHeight: '100%'},
  global.pageContent,
];

const OnboardingScreen11 = () => {
  const [data, setData] = useState({
    latitude: '',
    longitude: '',
    locality: '',
    address: '',
    sublocality: '',
  });

  const onPress = useCallback(async (_, details = null) => {
    // console.log('onPress', details);
    if (!details) {
      return;
    }

    setData({
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      locality: details.address_components[0].short_name,
      address: details.address_components[0].long_name,
      sublocality: details.address_components[1].short_name,
    });
  }, []);

  const renderRow = useCallback(
    item => (
      <>
        <Whitespace marginTop={15} />

        <Container row type="spaceBetween" height={50}>
          <Container center type="smallBorderRadius" color="#F2F2F2" left height={50} width={50}>
            <Image src={locationPin} width={20} height={25} />
          </Container>

          <Typography weight="800" width="80%" color="#252525" left size={14}>
            {item.description}
          </Typography>
        </Container>

        <Whitespace marginTop={10} />
      </>
    ),
    [],
  );

  return (
    <Base index={12} total={12} isComplete={!!data.latitude} data={data} inline>
      <Whitespace marginTop={30} />

      <View style={containerStyle}>
        <Typography height={30} type="heading" size={26} color="#1F2D3D" width="100%">
          Where&apos;s your home located?
        </Typography>

        <Whitespace marginTop={69} />

        <GooglePlacesAutocomplete
          fetchDetails
          suppressDefaultStyles
          returnKeyType="search"
          disableScroll={false}
          enablePoweredByContainer={false}
          isRowScrollable={false}
          placeholder="Type where your home is located"
          onPress={onPress}
          styles={styles}
          query={query}
          renderRow={renderRow}
          onFail={console.error}
          onNotFound={console.error}
          onTimeout={console.error}
        />
      </View>
    </Base>
  );
};

export default OnboardingScreen11;
