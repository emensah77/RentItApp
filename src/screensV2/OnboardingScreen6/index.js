import React, {useState, useRef, useCallback, useMemo} from 'react';
import {
  View,
  Alert,
  Image,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  Linking,
  Pressable,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {styles} from './styles';
import SuggestionRow from '../../screens/DestinationSearch/SuggestionRow';
import Typography from '../../componentsV2/DataDisplay/Typography';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {offsets} from '../../styles/globalStyles';
import DividedProgress from '../../componentsV2/DataDisplay/DividedProgress';
import BottomActionsBar from '../../componentsV2/Inputs/BottomActionsBar';

Geocoder.init('AIzaSyBbnGmg020XRNU_EKOTXpmeqbCUCsEK8Ys');

const OnboardingScreen6 = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [sublocality, setSubLocality] = useState('');

  const ref = useRef();
  const navigation = useNavigation();

  const route = useRoute();

  const title = route.params?.title;
  const type = route.params?.type;
  const description = route.params?.description;
  const bed = route.params?.bed;
  const bedroom = route.params?.bedroom;
  const bathroom = route.params?.bathroom;
  const imageUrls = route.params?.imageUrls;
  const homeprice = route.params?.homeprice;
  const mode = route.params?.mode;
  const amenities = route.params?.amenities;
  const currency = route.params?.currency;
  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert('Turn on Location Services to allow "RentIt" to determine your location.', '', [
        {text: 'Go to Settings', onPress: openSetting},
        {text: "Don't Use Location", onPress: () => {}},
      ]);
    }

    return false;
  };

  const saveProgress = useCallback(
    async progressData => {
      try {
        const user = auth().currentUser;
        const screenName = route.name;
        const userId = user.uid;
        await fetch('https://a27ujyjjaf7mak3yl2n3xhddwu0dydsb.lambda-url.us-east-2.on.aws/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            progress: {
              screenName,
              progressData,
            },
          }),
        });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    },
    [route.name],
  );

  const next = useCallback(async () => {
    if (!address) {
      alert('Please select location');
      return;
    }
    await saveProgress({
      title,
      type,
      description,
      bed,
      bedroom,
      bathroom,
      imageUrls,
      homeprice,
      latitude,
      longitude,
      mode,
      amenities,
      locality,
      sublocality,
      address,
      currency,
    });
    navigation.navigate('OnboardingScreen8', {
      title,
      type,
      description,
      bed,
      bedroom,
      bathroom,
      imageUrls,
      homeprice,
      latitude,
      longitude,
      mode,
      amenities,
      locality,
      sublocality,
      address,
      currency,
    });
  }, [
    address,
    amenities,
    bathroom,
    bed,
    bedroom,
    currency,
    description,
    homeprice,
    imageUrls,
    latitude,
    locality,
    longitude,
    mode,
    navigation,
    saveProgress,
    sublocality,
    title,
    type,
  ]);

  const autoComplete = useCallback(async (_, details = null) => {
    // 'details' is provided when fetchDetails = true
    // console.log('1', details.address_components[0].short_name);
    // console.log('2', details.address_components[1].short_name);

    setLatitude(details.geometry.location.lat);
    setLongitude(details.geometry.location.lng);
    setLocality(details.address_components[0].short_name);
    setAddress(details.address_components[0].long_name);
    setSubLocality(details.address_components[1].short_name);

    // navigation.navigate('OnboardingScreen11', {
    //   title: title,
    //   type: type,
    //   description: description,
    //   bed: bed,
    //   bedroom: bedroom,
    //   bathroom: bathroom,
    //   imageUrls: imageUrls,
    //   homeprice: homeprice,
    //   latitude: latitude,
    //   longitude: longitude,
    //   mode: mode,
    //   amenities: amenities,
    //   locality: locality,
    //   sublocality: sublocality,
    // });
    // console.log(details.geometry.viewport)
  }, []);

  const renderRow = useCallback(item => <SuggestionRow item={item} />, []);
  const goFaqs = () => {};
  const nextOpacity = useMemo(
    () => ({opacity: latitude === null || longitude === null ? 0.4 : 1}),
    [latitude, longitude],
  );
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView>
      <View style={styles.mainContent}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={goBack}>
            <Image source={BackArrow} />
          </Pressable>
          <View style={styles.topButtons}>
            <Pressable
              style={styles.topButton}
              // eslint-disable-next-line react/jsx-no-bind
              onPress={next}>
              <Typography style={styles.topButtonText}>Save & exit</Typography>
            </Pressable>
            <Pressable style={styles.topButton} onPress={goFaqs}>
              <Typography style={styles.topButtonText}>FAQs</Typography>
            </Pressable>
          </View>
        </View>
        <View style={styles.listing}>
          <Typography bold style={styles.title}>
            Where’s your home located?
          </Typography>
          {/* <InputField style={styles.input} placeHolder={'Type where your home is located'} /> */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.input}>
            <GooglePlacesAutocomplete
              placeholder="Type where your home is located"
              ref={ref}
              onPress={autoComplete}
              fetchDetails
              styles={{
                textInputContainer: {
                  backgroundColor: '#F7F7F7',
                  borderRadius: 15,
                  // borderWidth: 0.5,
                  // height: 52,
                },
                textInput: styles.textInput,
              }}
              query={{
                key: 'AIzaSyBbnGmg020XRNU_EKOTXpmeqbCUCsEK8Ys',
                language: 'en',

                components: 'country:gh',
              }}
              suppressDefaultStyles
              renderRow={renderRow}
            />
          </KeyboardAvoidingView>
        </View>
        <View
          style={{
            width: wp(100),
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}>
          <View style={{paddingHorizontal: offsets.offsetB}}>
            <DividedProgress total={4} progress={4} style={{marginBottom: offsets.offsetB}} />
          </View>
          <BottomActionsBar leftText="Back" rightText="Next" rightAction={next} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen6;
