import React from 'react';
import {
  View,
  Linking,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Pressable,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import FastImage from 'react-native-fast-image';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from 'react-native-vector-icons/Fontisto';
import * as Animatable from 'react-native-animatable';

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

const HouseDetailScreen = props => {
  const route = useRoute();
  const homeimage = route.params.houseimage;
  const hometitle = route.params.housetitle;
  const homeamount = route.params.houseamount;
  const homelatitude = route.params.houselatitude;
  const homelongitude = route.params.houselongitude;
  const homeyears = route.params.houseyears;
  const homemonths = route.params.housemonths;
  const {confirmCode} = route.params;

  const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
  const latLng = `${homelatitude},${homelongitude}`;
  const label = 'Custom Label';
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });

  const openMaps = () => {
    try {
      Linking.openURL(url);
    } catch (e) {
      console.log(e);
    }
  };

  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['#ff0084', '#33001b']}
      start={{x: 0.1, y: 0.2}}
      end={{x: 1, y: 0.5}}
      style={styles.container}
    >
      <StatusBar hidden />
      <Pressable onPress={() => navigation.goBack()}>
        <Fontisto name="angle-left" size={25} style={{color: 'white', margin: 20, marginTop: 30}} />
      </Pressable>
      <Text style={styles.text_header}> Your{'\n'} home details. </Text>

      <Animatable.View
        useNativeDriver
        animation="fadeInUpBig"
        duration={1500}
        style={styles.footer}
      >
        <ScrollView
          contentContainerStyle={{paddingBottom: 200}}
          showsVerticalScrollIndicator={false}
        >
          <FastImage
            style={styles.image}
            source={{
              uri: homeimage,
              headers: {Authorization: 'token'},
              priority: FastImage.priority.high,
            }}
          />

          <Text style={{fontFamily: 'Montserrat-Bold'}} numberOfLines={2}>
            {hometitle}
          </Text>
          <View style={styles.hairline} />
          <View style={{paddingBottom: 40}}>
            <Text
              style={{
                fontSize: 16,
                paddingBottom: 20,
                fontFamily: 'Montserrat-Bold',
              }}
            >
              Reservation Details
            </Text>
            <Text style={{paddingBottom: 5, fontFamily: 'Montserrat-Bold'}}>Confirmation Code</Text>
            <Text style={{paddingBottom: 5, fontFamily: 'Montserrat-SemiBold'}}>{confirmCode}</Text>
            <View style={styles.hairline2} />
            <Text style={{paddingBottom: 5, fontFamily: 'Montserrat-Bold'}}>Lease</Text>
            <Text style={{paddingBottom: 5, fontFamily: 'Montserrat-SemiBold'}}>
              {homeyears} years
            </Text>
            <Text style={{paddingBottom: 5, fontFamily: 'Montserrat-SemiBold'}}>
              {homemonths} months
            </Text>
            <View style={styles.hairline2} />
            <Text style={{paddingBottom: 5, fontFamily: 'Montserrat-Bold'}}>Payment info</Text>
            <Text style={{paddingBottom: 5, fontFamily: 'Montserrat-SemiBold'}}>
              Total Cost: GH₵ {homeamount}
            </Text>
          </View>
          {/* <Text style={{fontFamily:'Montserrat-Regular'}}>{homebed} bedroom</Text> */}
          <View style={styles.hairline} />

          {/* <View style={{paddingBottom:40}}>
                        <Text style={{fontSize:16,paddingTop:20,fontFamily:'Montserrat-Bold'}}>Getting there</Text>
                    </View>
                    <View style={styles.hairline}/> */}
          <Pressable onPress={openMaps} style={{paddingBottom: 40}}>
            <Text
              style={{
                fontSize: 16,
                paddingBottom: 15,
                fontFamily: 'Montserrat-Bold',
              }}
            >
              Getting there
            </Text>
            <Text
              style={{
                fontSize: 12,
                paddingBottom: 5,
                fontFamily: 'Montserrat-Bold',
              }}
            >
              Click on the map to get directions to your new home
            </Text>

            <MapView
              onPress={openMaps}
              style={{width: '100%', height: '50%', backgroundColor: 'white'}}
              provider={PROVIDER_GOOGLE}
              customMapStyle={mapStyle}
              zoomEnabled
              minZoomLevel={12}
              // onRegionChangeComplete={(region) => fetchPostsOnChange(region)}
              initialRegion={{
                latitude: homelatitude,
                longitude: homelongitude,
                latitudeDelta: 0.8,
                longitudeDelta: 0.8,
              }}
            >
              <Marker
                coordinate={{latitude: homelatitude, longitude: homelongitude}}
                title="Home"
                description="This is where your house is located"
              >
                <View
                  style={{
                    borderRadius: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    backgroundColor: 'white',
                  }}
                >
                  <Fontisto name="home" size={25} color="blue" />
                </View>
              </Marker>
            </MapView>
          </Pressable>
        </ScrollView>
      </Animatable.View>
    </LinearGradient>
  );
};

export default HouseDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  image: {
    height: Dimensions.get('window').height / 3,
    width: Dimensions.get('window').width - 40,
    resizeMode: 'contain',
    borderRadius: 15,
    justifyContent: 'center',
    marginBottom: 20,
  },
  hairline: {
    alignSelf: 'stretch',
    borderBottomWidth: 5,
    borderBottomColor: 'lightgrey',
    marginTop: 10,
    marginBottom: 10,
  },
  hairline2: {
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    marginTop: 10,
    marginBottom: 10,
  },

  footer: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'flex-start',
  },
  text_header: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    paddingBottom: 10,
    fontSize: 30,
  },
});
