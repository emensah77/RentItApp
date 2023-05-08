import React, {useState, useRef, useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StatusBar,
  PermissionsAndroid,
  ToastAndroid,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faLocationArrow} from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, PROVIDER_DEFAULT} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {Marker, PROVIDER_DEFAULT} from 'react-native-maps';
import Fontisto from 'react-native-vector-icons/Fontisto';

import auth from '@react-native-firebase/auth';
import Geocoder from 'react-native-geocoding';
import SuggestionRow from '../DestinationSearch/SuggestionRow';
import styles from './styles';

Geocoder.init('AIzaSyBbnGmg020XRNU_EKOTXpmeqbCUCsEK8Ys');

const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#383838',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#120202',
      },
    ],
  },
  {
    featureType: 'administrative.neighborhood',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#120202',
      },
    ],
  },
  {
    featureType: 'administrative.province',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#383838',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#23a0fd',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.icon',
    stylers: [
      {
        color: '#16659e',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text',
    stylers: [
      {
        color: '#16659e',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#16659e',
      },
    ],
  },
];

const OnboardingScreen6 = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [sublocality, setSubLocality] = useState('');
  const [loading, setIsLoading] = useState(false);

  const ref = useRef();
  const navigation = useNavigation();
  const map = useRef();
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

  const hasPermissionIOS = useCallback(async () => {
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
  }, []);

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

  const hasLocationPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
  }, []);

  const getLocation = useCallback(async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }
    setIsLoading(true);

    Geolocation.getCurrentPosition(
      position => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.8,
          longitudeDelta: 0.8,
        };
        map.current.animateToRegion(region);

        // Reverse geocoding to get the address details
        Geocoder.from(position.coords.latitude, position.coords.longitude)
          .then(json => {
            const details = json.results[0];
            const _locality = details.address_components.find(component =>
              component.types.includes('locality'),
            ).short_name;
            const subLocality = details.address_components.find(component =>
              component.types.includes('sublocality'),
            ).short_name;
            const _address = details.formatted_address;

            setLocality(_locality);
            setSubLocality(subLocality);
            setAddress(_address);
            setIsLoading(false);
          })
          .catch(console.error);
      },
      error => {
        console.error(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        forceLocationManager: true,
        showLocationDialog: true,
      },
    );
  }, [hasLocationPermission]);

  const next = useCallback(async () => {
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
    navigation.navigate('OnboardingScreen11', {
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

  const nextOpacity = useMemo(
    () => ({opacity: latitude === null || longitude === null ? 0.4 : 1}),
    [latitude, longitude],
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <MapView
        ref={map}
        style={styles.mapView}
        provider={PROVIDER_DEFAULT}
        customMapStyle={mapStyle}
        zoomEnabled
        minZoomLevel={12}
        // onRegionChangeComplete={(region) => fetchPostsOnChange(region)}
        initialRegion={{
          latitude: 5.602028159656166,
          longitude: -0.183158678544458,
          latitudeDelta: 0.8,
          longitudeDelta: 0.8,
        }}>
        <Marker
          coordinate={{
            latitude: latitude || 5.602028159656166,
            longitude: longitude || -0.183158678544458,
          }}
          title="Home"
          description="This is where your house is located">
          <View style={styles.home}>
            <Fontisto name="home" size={25} color="blue" />
          </View>
        </Marker>
      </MapView>

      <Animatable.View useNativeDriver animation="fadeInUpBig" duration={100} style={styles.footer}>
        {latitude === null || longitude == null ? (
          <Text style={styles.requestAddress}> We need the {'\n'} address of your home </Text>
        ) : (
          <Text style={styles.gottenAddress}> We now have the {'\n'} address of your home </Text>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}>
          <GooglePlacesAutocomplete
            placeholder="Type where your home is located"
            ref={ref}
            onPress={autoComplete}
            fetchDetails
            styles={{
              textInputContainer: {
                backgroundColor: 'white',
                borderRadius: 15,
                borderWidth: 0.5,
                height: 40,
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
        {loading ? (
          <View style={styles.gettingLocation}>
            <Text>Getting your location ...</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <Text style={styles.orText}>OR</Text>
        )}
        <TouchableOpacity onPress={getLocation} style={styles.getLocation}>
          <FontAwesomeIcon icon={faLocationArrow} size={20} />
          <Text style={styles.getLocationText}>Get my current location</Text>
        </TouchableOpacity>

        {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{flex:1}}
        >

        <View style={{flex:1,flexDirection:'column',marginBottom:10,justifyContent:'space-evenly'}}>
        <TextInput
                        adjustsFontSizeToFit={true}
                        placeholder="Enter Latitude"
                        multiline={true}
                        maxLength={50}
                        keyboardType="numeric"
                        onChangeText={text => setLatitude(Number(text))}
                        style={{alignContent:'flex-start',width:'100%',height:50,fontSize:14,fontWeight: 'bold'
                        ,borderWidth:  1,
                        borderColor: 'darkgray',borderRadius:10,marginBottom:10, padding:10}}></TextInput>

              <TextInput
                        adjustsFontSizeToFit={true}
                        placeholder="Enter Longitude"
                        multiline={true}
                        maxLength={50}
                        keyboardType="default"
                        onChangeText={text => setLongitude(Number(text))}
                        style={{alignContent:'flex-start',width:'100%',height:50,fontSize:14,fontWeight: 'bold'
                        ,borderWidth:  1,
                        borderColor: 'darkgray',borderRadius:10, padding:10}}></TextInput>

        </View>

        </KeyboardAvoidingView>

            <Text style={{fontSize:18, fontFamily:'Montserrat-Bold'}}>Latitude: {latitude === null ? 'Click on get my location' : latitude}</Text> */}

        {/* <Text style={{fontSize:18, fontFamily:'Montserrat-Bold'}}>Longitude: {longitude === null ? 'Click on get my location' : longitude}</Text> */}

        <View style={styles.touchableContainer}>
          <TouchableOpacity
            disabled={latitude === null || longitude === null}
            onPress={next}
            style={[styles.nextTouchable, nextOpacity]}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>

          <Pressable onPress={navigation.goBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </View>
      </Animatable.View>
    </View>
  );
};

export default OnboardingScreen6;
