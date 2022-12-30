import React , {useEffect, useState, useRef} from 'react';
import {View, Text,Alert, TextInput, ScrollView,ImageBackground, Platform,TouchableOpacity ,StatusBar, FlatList,PermissionsAndroid,ToastAndroid,Linking, Pressable, KeyboardAvoidingView} from 'react-native';
import styles from './styles.js';
import Entypo from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';
import {useNavigation, useRoute} from "@react-navigation/native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils ,faLocationArrow, faFan ,faFaucet, faBath, faBed, faToilet, faWifi, faWater, faCamera, faUpload, faCameraRetro, faFileUpload, faCloudUploadAlt, faArrowAltCircleUp} from '@fortawesome/free-solid-svg-icons'
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from "react-native-vector-icons/Fontisto";
import Geolocation from 'react-native-geolocation-service';
import MapView from 'react-native-maps';
import SuggestionRow from '../../screens/DestinationSearch/SuggestionRow'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
const mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#383838"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#120202"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#120202"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#383838"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#23a0fd"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.icon",
      "stylers": [
        {
          "color": "#16659e"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text",
      "stylers": [
        {
          "color": "#16659e"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#16659e"
        }
      ]
    }
  ]


const OnboardingScreen6 = (props) => {
  const ref = useRef();
    const navigation = useNavigation();
    const [forceLocation, setForceLocation] = useState(true);
    const [highAccuracy, setHighAccuracy] = useState(true);
    const [locationDialog, setLocationDialog] = useState(true);
    const [significantChanges, setSignificantChanges] = useState(false);
    const [observing, setObserving] = useState(false);
    const [foregroundService, setForegroundService] = useState(false);
    const [useLocationManager, setUseLocationManager] = useState(false);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [locality, setLocality] = useState('');
    const [sublocality, setSubLocality] = useState('');
    const map = useRef();
    const route = useRoute();
    const title = route.params?.title
    const type = route.params?.type
    const description = route.params?.description
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
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => {} },
        ],
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
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
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.8,
            longitudeDelta: 0.8,
          };
          map.current.animateToRegion(region);
      },
      (error) => {
        Alert.alert(`Code ${error.code}`, error.message);
        setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: highAccuracy,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: forceLocation,
        forceLocationManager: useLocationManager,
        showLocationDialog: locationDialog,
      },
    );
  };


    
    
    return (
        
        <View
        style={styles.container}
      >
          <StatusBar hidden={true} />
          
          
          
 
          <MapView
                        
                        ref={map}
                        style={{width:'100%', height:'25%', backgroundColor:"white",}}
                        provider={PROVIDER_DEFAULT}
                        customMapStyle={mapStyle}
                        zoomEnabled={true}
                        minZoomLevel={12}
                        //onRegionChangeComplete={(region) => fetchPostsOnChange(region)}
                        initialRegion={{
                        latitude: 5.602028159656166, 
                        longitude: -0.183158678544458,
                        latitudeDelta: 0.8,
                        longitudeDelta: 0.8,
                        }}
                        >

                        <Marker 
                        
                        coordinate = {{latitude: latitude || 5.602028159656166,longitude: longitude || -0.183158678544458}}
                                
                                title={"Home"}
                                description={"This is where your house is located"}>
                                <View style={{borderRadius:100,alignItems:'center',justifyContent:'center',width:50, height:50, backgroundColor:'white'}}>
                                <Fontisto name="home" size={25} color="blue"/>
                                </View>
                                

                            </Marker>


                        </MapView>



                        

            
                
        
          
               
            <Animatable.View
        useNativeDriver={true}
        animation="fadeInUpBig"
        duration={100} 
          style={styles.footer}
        >
         
        
        
        
            
                
               
                    
            
        {latitude === null || longitude == null ?   
        <Text style={{fontSize:18,paddingBottom:10, fontFamily:'Montserrat-Bold'}}> We need  the {'\n'} address of your home </Text>

        :  <Text style={{fontSize:18, fontFamily:'Montserrat-Bold'}}> We now have the {'\n'} address of your home </Text>  }
           

           
           <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{flex:1,}}
            
            >

            <GooglePlacesAutocomplete
                
                placeholder='Type where your home is located'
                ref={ref}
                onPress={async(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log('1',details.address_components[0].short_name);
                    console.log('2',details.address_components[1].short_name);
      
                    setLatitude(details.geometry.location.lat);
                    setLongitude(details.geometry.location.lng);
                    setLocality(details.address_components[0].short_name)
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
                    //console.log(details.geometry.viewport)
                  }}
                fetchDetails
                styles={{
                    textInput: styles.textInput,
                    textInputContainer: {
                        backgroundColor: 'white',
                        borderRadius:15,
                        borderWidth:.5,
                        height:40,
                        
                        
                      },
                      textInput: {
                        height: 44,
                        color: '#000000',
                        fontSize: 18,
                        fontFamily:'Montserrat-Bold',
                        paddingHorizontal: 10
                      },
                      
                }}
                query={{
                    key: 'AIzaSyBbnGmg020XRNU_EKOTXpmeqbCUCsEK8Ys',
                    language: 'en',
                    
                    components: 'country:gh',
                }}
                
                suppressDefaultStyles
                renderRow={(item) => <SuggestionRow item={item}/>}
                />
          

            </KeyboardAvoidingView>
   
            {/* <Text style={{fontWeight:'bold',marginBottom:8,fontSize:20,marginTop:10,alignSelf:'center'}}>OR</Text>
           
            <TouchableOpacity onPress={getLocation} style={{flex:1, borderWidth:1, borderRadius:20, marginVertical:20,padding:5, flexDirection:'row', justifyContent:'center'}}>
                <FontAwesomeIcon icon={faLocationArrow} size={20} />
                <Text style={{paddingHorizontal:10, fontFamily:'Montserrat-SemiBold'}}>Get my current location</Text>
            </TouchableOpacity> */}


           
                     
          
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
            
            <View style={{flex:1, flexDirection:'row', marginTop:30, justifyContent:'space-between'}}>
            <TouchableOpacity disabled={latitude === null || longitude === null} onPress={() => navigation.navigate('OnboardingScreen11', {
              title: title,
              type: type,
              description: description,
              bed: bed,
              bedroom: bedroom,
              bathroom: bathroom,
              imageUrls: imageUrls,
              homeprice: homeprice,
              latitude: latitude,
              longitude: longitude,
              mode: mode,
              amenities: amenities,
              locality: locality,
              sublocality: sublocality,
              currency: currency,
            })} style={{left:250,height:60,width:100,backgroundColor:'deeppink',
             opacity: latitude === null || longitude === null ? .4 : 1,borderRadius:20, alignItems:'center', paddingHorizontal:20, paddingVertical:20}}>
                <Text style={{color:'white', fontFamily:'Montserrat-SemiBold', fontSize:14}}>Next</Text>
            </TouchableOpacity>

            <Pressable onPress={() => navigation.goBack()} style={{right:250,height:60,width:100,backgroundColor:'deeppink',
             borderRadius:20, alignItems:'center', paddingHorizontal:20, paddingVertical:20}}>
                <Text style={{color:'white', fontFamily:'Montserrat-SemiBold', fontSize:14}}>Back</Text>
            </Pressable>


            </View>
               
            
        </Animatable.View>
        
        

        </View>
       
      
            
            
            
            
            
            
    );
};

export default OnboardingScreen6;