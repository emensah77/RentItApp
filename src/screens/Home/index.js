import React, { useState, useContext, useEffect, useRef, Component } from 'react';
import { View, Modal, TextInput, ActivityIndicator, Text, Linking, Platform, Pressable, ImageBackground, SafeAreaView, PermissionsAndroid, ScrollView, Image, FlatList, TouchableOpacity, Alert, BackHandler, Switch } from "react-native";
import styles from './styles';
import FontAwesome, { SolidIcons, phone } from 'react-native-fontawesome';
import Fontisto from "react-native-vector-icons/Fontisto";
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
const image = { uri: "https://d5w4alzj7ppu4.cloudfront.net/cities/night.jpeg" };
import { FlatListSlider } from 'react-native-flatlist-slider';
import { Dimensions } from "react-native";
import { OptimizedFlatList } from 'react-native-optimized-flatlist';
import FastImage from 'react-native-fast-image';
import VersionCheck from 'react-native-version-check';
import Geolocation from 'react-native-geolocation-service';
import { API, graphqlOperation } from 'aws-amplify';
import { listPosts, getUser } from '../../graphql/queries';
import { createUser } from '../../graphql/mutations';
import Geocoder from 'react-native-geocoding';
const colors = ["magenta", "lime", "fuchsia", "crimson", "aqua", "blue", "red", "yellow", "green", "white", "deeppink"]
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PaymentScreen from '../PaymentScreen';
import { Paystack } from 'react-native-paystack-webview';
import { AuthContext } from '../../navigation/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBuilding, faArrowLeft, faFilter, faBars, faStore, faMountain, faCity, faDoorClosed, faCaravan, faLandmark, faArchway, faHotel, faIgloo, faWarehouse, faBed, faToilet, faCampground, faBinoculars } from '@fortawesome/free-solid-svg-icons'
import Post from '../../components/Post';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CheckBox from '@react-native-community/checkbox';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import BackgroundGeolocation, {
  Location,
  Subscription
} from "react-native-background-geolocation";
import BackgroundFetch from "react-native-background-fetch";
import { registerTransistorAuthorizationListener } from './Authorization';
import { HOME_STATUS } from '../../variables';


const HomeScreen = (props) => {


  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user, logout } = useContext(AuthContext);
  const userEmail = user.email;
  const [selectedButton, setSelectedButton] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [updateNeeded, setUpdateNeeded] = useState(false);
  const [updateUrl, setUpdateUrl] = useState('');
  const [posts, setPosts] = useState([]);
  const [postLatest, setLatest] = useState([]);
  const [addresss, setaddress] = useState('');
  const [forceLocation, setForceLocation] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [locationDialog, setLocationDialog] = useState(true);
  const [significantChanges, setSignificantChanges] = useState(false);
  const [observing, setObserving] = useState(false);
  const [foregroundService, setForegroundService] = useState(false);
  const [useLocationManager, setUseLocationManager] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [alreadyPaid, setalreadyPaid] = useState(null);
  const [color, setcolor] = useState('white');
  const [status, setStatus] = useState('Entire Flat');
  const [isReset, setIsReset] = useState(false);
  const [loadingType, setIsLoadingType] = useState(false);
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
  const [modalvisible, setmodalvisible] = useState(false);
  const [modalVisible, setmodalVisible] = useState(false);
  const [minimumvalue, setMinimumValue] = useState(1);
  const [maximumvalue, setMaximumValue] = useState(100000);
  const [minvalue, setminValue] = useState('');
  const [maxvalue, setmaxValue] = useState('')
  const [nextToken, setNextToken] = useState(null);
  const [loading, setIsLoading] = useState(false);

  const bgGeoEventSubscriptions = [];
  /// State.
  const [events, setEvents] = React.useState([]);
  const [enabled, setEnabled] = React.useState(true);

  /// Init BackgroundGeolocation when view renders.
  /// Return a function to .removeListeners() When view is removed.
  React.useEffect(() => {
    BackgroundGeolocation.start();
    initBackgroundFetch();
    initBackgroundGeolocation();
    registerTransistorAuthorizationListener(navigation);
    return () => {
      unsubscribe();
    }
  }, []);

  const subscribe = (subscription) => {
    bgGeoEventSubscriptions?.push(subscription);
  }

  const unsubscribe = () => {
    bgGeoEventSubscriptions?.forEach((subscription) => subscription?.remove());
  }

  /// Configure the BackgroundGeolocation plugin.
  const initBackgroundGeolocation = async () => {
    subscribe(BackgroundGeolocation.onProviderChange((event) => {
      console.log('[onProviderChange]', event);
      addEvent('onProviderChange', event);
    }));

    subscribe(BackgroundGeolocation.onLocation((location) => {
      console.log('[onLocation]', location);
      firestore().collection('marketers').doc(auth().currentUser.uid).set({
        createdAt: new Date(),
        uid: auth().currentUser.uid,
        displayName: auth().currentUser.displayName,
        lat: location.coords.latitude,
        long: location.coords.longitude
      })
      addEvent('onLocation', location);
      return location
    }, (error) => {
      console.warn('[onLocation] ERROR: ', error);
    }));

    subscribe(BackgroundGeolocation.onMotionChange((location) => {
      console.log('[onMotionChange]', location);
      addEvent('onMotionChange', location);
    }));

    subscribe(BackgroundGeolocation.onGeofence((event) => {
      console.log('[onGeofence]', event);
      addEvent('onGeofence', event);
    }));

    subscribe(BackgroundGeolocation.onConnectivityChange((event) => {
      console.log('[onConnectivityChange]', event);
      addEvent('onConnectivityChange', event);
    }));

    subscribe(BackgroundGeolocation.onEnabledChange((enabled) => {
      console.log('[onEnabledChange]', enabled);
      addEvent('onEnabledChange', { enabled: enabled });
    }));

    subscribe(BackgroundGeolocation.onHttp((event) => {
      console.log('[onHttp]', event);
      addEvent('onHttp', event);
    }));

    subscribe(BackgroundGeolocation.onLocation(location => {
      //console.log(`Latitude: ${location.coords.latitude}`);
      //console.log(`Longitude: ${location.coords.longitude}`);
    }))

    subscribe(BackgroundGeolocation.onActivityChange((event) => {
      console.log('[onActivityChange]', event);
      addEvent('onActivityChange', event);
    }));

    subscribe(BackgroundGeolocation.onPowerSaveChange((enabled) => {
      console.log('[onPowerSaveChange]', enabled);
      addEvent('onPowerSaveChange', { isPowerSaveMode: enabled });
    }));

    /// Configure the plugin.
    const state = await BackgroundGeolocation.ready({
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_NONE,
      distanceFilter: 10,
      stopOnTerminate: false,
      startOnBoot: true,
      disableMotionActivityUpdates: true,
      backgroundPermissionRationale: {
        title: "{applicationName} uses your location to provide you with relevant recommendations about homes near you, and notifications for price changes in homes near you, including when the app is in the background.",
        message:
          "If you will like to receive these recommendations and notifications, choose Allow all the time.",
        positiveAction: '{backgroundPermissionOptionLabel}',
        negativeAction: 'Cancel',
      },
      startOnBoot: false,

      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      stopTimeout: 5,
      batchSync: false,
      autoSync: true,
      locationAuthorizationAlert: true,
      locationUpdateInterval: 5000,
      locationAuthorizationRequest: true,
      reset: false,
      notification: {
        title: "RentIt is accessing your location in background",
        text: 'We will use this to search for homes and monitor change in home prices to provide you discounts.'
      },
      debug: false,
    }, (state) => {
      if (!state.enabled) {

        BackgroundGeolocation.start(() => {
          console.log(' - Start success');
        });
      }
    });


    BackgroundGeolocation.start({
      foregroundService: true,
      BackgroundFetch: true,
      notificationTitle: null,
      notificationText: null,
      enableHeadless: true,
      stopOnTerminate: false,
      startOnBoot: true,
      disableMotionActivityUpdates: true,

    });

    addEvent('Current state', state);

    BackgroundGeolocation.setConfig({
      notification: {
        title: "RentIt is accessing your location in background",
        text: 'We will use this to search for homes and monitor change in home prices to provide you discounts.'
      },

    })


    subscribe(BackgroundGeolocation.watchPosition(
      position => { },
      error => console.log(error),
      {
        interval: 1000,
      }
    ))
    setEnabled(state.enabled);
  };



  const initBackgroundFetch = async () => {
    await BackgroundFetch.configure({
      minimumFetchInterval: 15,
      stopOnTerminate: true
    }, (taskId) => {
      console.log('[BackgroundFetch] ', taskId);
      BackgroundFetch.finish(taskId);
    }, (taskId) => {
      console.log('[BackgroundFetch] TIMEOUT: ', taskId);
      BackgroundFetch.finish(taskId);
    });
  }

  /// Adds events to List
  const addEvent = (name, params) => {
    let timestamp = new Date();
    const event = {
      expanded: false,
      timestamp: `${timestamp.getMonth()}-${timestamp.getDate()} ${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`,
      name: name,
      params: JSON.stringify(params, null, 2)
    }
    setEvents(previous => [...previous, event]);
  }


  const items = [
    {

      name: 'Air Conditioner',
      id: 'Air Conditioner',


    },
    {

      name: 'WiFi',
      id: 'WiFi',



    },
    {

      name: 'Kitchen',
      id: 'Kitchen',


    },
    {

      name: 'Water',
      id: 'Water',


    },
    {

      name: 'Toilet',
      id: 'Toilet',


    },

    {
      name: 'Bathroom',
      id: 'Bathroom',
    }

  ]

  const categories = [
    {
      //   status: 'All',
      //   id: 1,
      //   icon: faDoorClosed
      // },


      status: 'Entire Flat',
      id: 2,
      icon: faIgloo
    },
    {
      status: 'Apartment',
      id: 3,
      icon: faCity
    },
    {
      status: 'Chamber and Hall',
      id: 3,
      icon: faCampground
    },
    {
      status: 'Mansion',
      id: 4,
      icon: faHotel
    },
    {
      status: 'Self-Contained',
      id: 5,
      icon: faArchway
    },
    {
      status: 'Single Room',
      id: 6,
      icon: faDoorClosed
    },
    {
      status: 'Full Home',
      id: 7,
      icon: faLandmark
    },
  ];


  const shuffle = (array) => {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }
  const setStatusFilter = (status) => {
    //setObserving(true);
    //setIsLoadingType(true);
    setStatus(status);
    //setNextToken(null);
    //setPosts([]);
    fetchPostsType();
    //console.log('status',status)
    //console.log('isreset', observing)
    //setObserving(false);
    //setIsLoadingType(false);
  };

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
    filterPosts(status);
  };



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
        `Turn on Location Services to allow "RentIt" to determine your location.`,
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => { } },
        ],
      );
    }

    return false;
  };
  const renderLoader = () => {
    return (
      !loading ?
        <View style={{ marginVertical: 100, alignItems: 'center' }}>
          <ActivityIndicator size={'large'} color="blue" />
        </View> :
        null
    );
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
      async (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        await firestore().collection('marketers').doc(auth().currentUser.uid).set({
          createdAt: new Date(),
          uid: auth().currentUser.uid,
          displayName: auth().currentUser.displayName,
          lat: position.coords.latitude,
          long: position.coords.longitude
        })
      },
      (error) => {
        Alert.alert(`Code ${error.code}`, error.message);
        setLatitude(null);
        setLongitude(null)
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
  const makeCall1 = () => {
    const phoneNumbers = ["0256744112"]

    let phoneNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phoneNumber}`;
    } else {
      phoneNumber = `telprompt:${phoneNumber}`;
    }
    try {
      Linking.openURL(phoneNumber);
    }
    catch (e) {
      console.log(e)
    }

  };
  const makeCall = () => {
    const phoneNumbers = ["0552618521", "0597285059", "0597285099", "0205200706", "0579535484"]

    let phoneNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phoneNumber}`;
    } else {
      phoneNumber = `telprompt:${phoneNumber}`;
    }
    try {
      Linking.openURL(phoneNumber);
    }
    catch (e) {
      console.log(e)
    }

  };



  const fetchMorePosts = async (token) => {
    try {
      let query = {
        limit: 1000000,
        filter: {
          and: {

            type: {
              eq: status,
            },
            latitude: {
              between: [4.633900069140816, 11.17503079077031],
            },
            longitude: {
              between: [-3.26078589558366, 1.199972025476763],
            },
            status: { ne: [HOME_STATUS.PENDING, HOME_STATUS.REJECTED] }
          },
        },
        nextToken: token
      };


      const postsResult = await API.graphql(
        graphqlOperation(listPosts, query),
      );
      setPosts([...posts, ...postsResult.data.listPosts.items]);
      if (postsResult?.data?.listPosts?.nextToken !== null) {
        setNextToken(postsResult.data.listPosts.nextToken);
      } else {
        return;
      }
    } catch (error) {
      console.log('error2', error);
    }
  }

  const loadMore = (token) => {
    setIsLoading(true);
    if (token !== null) {
      fetchMorePosts(token);
    }

    setIsLoading(false);
  }
  function selectColor() {

    setcolor(colors[Math.floor(Math.random() * colors.length)]);

  }
  const [images, setimages] = useState([
    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/Kejetia_Kumasi.jpeg',
      title: 'Kumasi', key: '1'
    },
    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/accra.jpeg',
      title: 'Accra', key: '2'
    },

    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/capecoast.jpeg',
      title: 'CapeCoast', key: '3'
    },
  ]);



  const [imagesApt, setimagesapt] = useState([
    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/fullhome.png',
      title: 'Full Homes', key: '1'
    },
    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/1bedroom.jpeg',
      title: '1 & 2 bedroom', key: '2'
    },

    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/house9.jpg',
      title: 'Apartment', key: '3'
    },
  ]);


  const [partner, setpartner] = useState([
    {
      image: {
        uri: 'https://d5w4alzj7ppu4.cloudfront.net/cities/house9.jpg',
      }, title: 'Full Homes', key: '1'
    },

  ]);
  const fetchPostsType = async (status) => {


    try {
      let query = {
        limit: 100000,
        filter: {
          and: {

            type: {
              eq: status,
            },
            latitude: {
              between: [4.633900069140816, 11.17503079077031],
            },
            longitude: {
              between: [-3.26078589558366, 1.199972025476763],
            },
          },
        },

      };



      const postsResult = await API.graphql(
        graphqlOperation(listPosts, query),
      );
      //console.log('previouslist',previousList.length)
      setPosts(shuffle(postsResult.data.listPosts.items));
      //setPosts(shuffle(posts));
      if (postsResult?.data?.listPosts?.nextToken !== null) {
        setNextToken(postsResult.data.listPosts.nextToken);
      } else {
        return;
      }
    } catch (error) {
      console.log('error1', error);
    }
  }

  const fetchPosts = async () => {
    try {
      const postsResult = await API.graphql(
        graphqlOperation(listPosts, {



          limit: 20,

          nextToken,
        })
      )

      setPosts(postsResult.data.listPosts.items);
      if (postsResult.data.listPosts.nextToken) {
        setNextToken(postsResult.data.listPosts.nextToken);
        //console.log('nexttoken',nextToken);
      }

    } catch (e) {
      console.log(e);
    }
  }
  const renderItem = ({ item, index }) => {
    return (
      <View key={item}>
        <Post post={item} />
      </View>
    );
  };

  const getLatestPost = async () => {
    try {
      const postsResult = await API.graphql(
        graphqlOperation(listPosts, {
          limit: 2

        })
      )

      setLatest(postsResult.data.listPosts.items);
      //console.log('posts',posts.length)

    } catch (e) {
      console.log(e);
    }
  }


  const createTwoButtonAlert = () => {

    setmodalVisible(true);

    // Alert.alert(
    // "Service fee",
    // "RentIt charges GHS 1 service fee. This is a one-time payment for using RentIt to search for homes all over Ghana",
    // [

    //     { text: "OK", onPress: () => {
    //         navigation.navigate('Payment', {
    //             channel : ["card", "mobile_money"],
    //             totalAmount: 1,
    //             homeimage: null,
    //             homelatitude: null,
    //             homelongitude: null,
    //             hometitle: null,
    //             homebed: null,
    //             homeid: null,
    //             homeyears: null,
    //             homemonths: null,

    //             })

    //         }


    // }
    // ]
    // );
    // setTimeout(createTwoButtonAlert, 100000);

  }
  const userDetails = async () => {
    var user = await firestore().collection('users').doc(auth().currentUser.uid);
    //console.log('user', (await user.get()).data())

    user.get()
      .then(doc => {

        if (doc.exists) {
          if (doc.data().phoneNumber === null || doc.data().phoneNumber === "") {

            navigation.navigate('WelcomeScreen')
          }

          else {
            console.log('User already has phone number');

          }
        }


      })
  }

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem(auth().currentUser.uid);
      console.log("value1", value)
      if (value === null) {
        setmodalVisible(true);


      } else {
        setmodalVisible(false);
        //navigation.navigate('Welcome')


      }

    }
    catch (error) {
      console.log("Error fetching data", error)
    }
  }
  const _getUserData = async (ID) => {
    try {
      const userDB = await API.graphql(
        graphqlOperation(getUser, {
          id: ID,
        })



      )
      if (userDB.data.getUser !== null) {
        console.log("User already in dynamodb")
        //console.log("User", userDB);
      }
      else {
        try {
          let input = {
            id: ID,
            email: auth().currentUser.email,
            username: auth().currentUser.displayName,
            imageuri: auth().currentUser.photoURL,
          }
          const addedUser = await API.graphql(

            graphqlOperation(createUser, {
              input
            })
          )
          //console.log("User has been added to dynamodb", addedUser)
        }
        catch (e) {
          console.log("Error adding User to DynamoDB", e)

        }


      }



    } catch (e) {
      console.log(e);
    }

  }





  useEffect(() => {

    _getUserData(auth().currentUser.uid);







    userDetails();
    setStatus(status);
    setPosts([]);
    setNextToken(null);
    console.log('status', status);
    console.log('nextToken', nextToken);
    //setInterval(selectColor, 2000);
    VersionCheck.needUpdate()
      .then(async res => {
        //console.log(res.isNeeded);    // true
        if (res.isNeeded) {
          setUpdateNeeded(true);
          setUpdateUrl(res.storeUrl);
          //console.log(res.storeUrl === updateUrl);
          //Linking.openURL(res.storeUrl);  // open store if update is needed.
        }
      });


    setIsLoadingType(true);
    fetchPostsType(status);
    setIsLoadingType(false);
    console.log('posts', posts);
    //getLatestPost();

    //console.log('This is latest',postLatest.map(item => (item.createdAt)));
    //clearInterval(selectColor);
  }, [status])
  //    if (postLatest){
  //     postLatest.sort(function (a, b) {
  //         return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  //       });
  //    }

  useEffect(() => {

    const interval = setInterval(() => {
      getLocation();
    }, 1000);
    return () => clearInterval(interval);

  }, [])



  const updateApp = () => {
    Linking.openURL(updateUrl);
  }




  const goToLocationSearch = () => {
    navigation.navigate('House Type')
  }
  const hellod1 = (text) => {
    setminValue(parseInt(text));




  };
  const hellod2 = (text) => {

    setmaxValue(parseInt(text));



  };
  const handle = () => {
    setSelectedButton('For Rent')
    filterPosts(status);
    console.log(selectedButton)
  }
  const handle1 = () => {
    setSelectedButton('For Sale')
    filterPosts(status);
    console.log(selectedButton)
  }
  const filter = () => {

    filterPosts(status);
    setmodalvisible(false);

  }
  const filterPosts = async (status) => {
    console.log(maximumvalue)
    try {
      let query = {
        limit: 100000,
        filter: {
          and: {

            type: {
              eq: status,
            },
            mode: {
              eq: selectedButton
            },
            newPrice: {
              le: maximumvalue
            },
            wifi: {
              eq: selectedItems.includes("WiFi") ? "Yes" : "No"
            },
            kitchen: {
              eq: selectedItems.includes("Kitchen") ? "Yes" : "No"
            },
            toilet: {
              eq: selectedItems.includes("Toilet") ? "Yes" : "No"
            },
            water: {
              eq: selectedItems.includes("Water") ? "Yes" : "No"
            },
            aircondition: {
              eq: selectedItems.includes("Air Conditioner") ? "Yes" : "No"
            },
            bathroom: {
              eq: selectedItems.includes("Bathroom") ? "Yes" : "No"
            },
            latitude: {
              between: [4.633900069140816, 11.17503079077031],
            },
            longitude: {
              between: [-3.26078589558366, 1.199972025476763],
            },
          },
        },

      };


      if (!selectedItems.includes("WiFi")) {
        delete query.filter.and.wifi;
      }
      if (!selectedItems.includes("Water")) {
        delete query.filter.and.water;
      }
      if (!selectedItems.includes("Kitchen")) {
        delete query.filter.and.kitchen;
      }
      if (!selectedItems.includes("Toilet")) {
        delete query.filter.and.toilet;
      }
      if (!selectedItems.includes("Bathroom")) {
        delete query.filter.and.bathroom;
      }
      if (!selectedItems.includes("Air Conditioner")) {
        delete query.filter.and.aircondition;
      }
      if (selectedButton === '') {
        delete query.filter.and.mode;
      }

      const postsResult = await API.graphql(
        graphqlOperation(listPosts, query),
      );
      //console.log('previouslist',previousList.length)

      setPosts(postsResult.data.listPosts.items);
      //setPosts(shuffle(posts));
      if (postsResult?.data?.listPosts?.nextToken !== null) {
        setNextToken(postsResult.data.listPosts.nextToken);
      } else {
        return;
      }
    } catch (error) {
      console.log('error1', error);
    }

  }


  return (
    <ScrollView style={{ backgroundColor: "white" }} contentContainerStyle={{ backgroundColor: "white", flex: 1 }}>


      <Modal animationType={"slide"} transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          navigation.goBack();
          console.log("Modal has been closed.")
        }}
      >

        <View style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 10,
          marginTop: 20
        }}>
          <Text style={{
            color: 'black',
            marginTop: 10, fontWeight: 'bold', fontSize: 22
          }}>Service Charge!</Text>
          <Text style={{ marginBottom: 20 }}>We began RentIt to help people like you.
            In order to continue doing that, we are now charging a GHS 2 service fee. This payment is one-time. You will not pay
            anything again for using RentIt</Text>
          <View style={{ paddingBottom: 10 }}>
            <Pressable
              style={{
                width: 300, backgroundColor: 'black',
                justifyContent: 'center', flexDirection: 'row',
                alignItems: 'center', borderRadius: 50,
                zIndex: 1, alignSelf: "center",

              }}
              onPress={makeCall1}>
              <Fontisto name="phone" size={15} style={{ color: 'white', margin: 10, transform: [{ rotate: '90deg' }] }} />

              <Text adjustsFontSizeToFit={true} style={{
                justifyContent: 'center', alignItems: 'center', fontSize: 10,
                fontFamily: 'Montserrat-SemiBold', color: "white"
              }}>Call if you have any problems or you need help</Text>

            </Pressable>

          </View>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={() => {


                setmodalVisible(false),
                  navigation.replace('Payment', {
                    channel: ["mobile_money"],
                    totalAmount: 2,
                    homeimage: null,
                    homelatitude: null,
                    homelongitude: null,
                    hometitle: null,
                    homebed: null,
                    homeid: null,
                    homeyears: null,
                    homemonths: null,


                  })


              }}
              style={{ marginHorizontal: 10, alignItems: "center", padding: 10, borderRadius: 10, backgroundColor: "deeppink", height: 40 }}
            >


              <Text style={{ color: 'white', fontSize: 14, fontWeight: "bold" }}>
                Pay with Mobile Money
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setmodalVisible(false),
                  navigation.replace('Payment', {
                    channel: ["card"],
                    totalAmount: 2,
                    homeimage: null,
                    homelatitude: null,
                    homelongitude: null,
                    hometitle: null,
                    homebed: null,
                    homeid: null,
                    homeyears: null,
                    homemonths: null,

                  })


              }}

              style={{ marginHorizontal: 10, alignItems: "center", borderRadius: 10, backgroundColor: "blue", padding: 10, height: 40 }}>
              <Text style={{ color: 'white', fontSize: 14, fontWeight: "bold" }}>
                Pay with Debit Card
              </Text>
            </TouchableOpacity>


          </View>

        </View>

      </Modal>

      <Modal style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
      }} animationType={"slide"} transparent={false}
        visible={modalvisible}
        onRequestClose={() => {
          setmodalvisible(false);
          console.log("Modal has been closed.")
        }}
      >
        <View style={{ paddingTop: 10 }}>

          <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: "column", justifyContent: "space-evenly" }}>

            <View style={{ marginTop: 20 }}>
              <Pressable onPress={() => setmodalvisible(false)} style={{ margin: 10 }}>
                <FontAwesomeIcon icon={faArrowLeft} size={20} />
              </Pressable>
              <View style={{ flex: 1, alignSelf: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>Price range</Text>
                <MultiSlider
                  min={minimumvalue}
                  max={maximumvalue}
                  step={100}
                  sliderLength={310}


                  onValuesChange={(value) => {
                    setMaximumValue(value[0])
                    filterPosts(status);
                  }}


                />
              </View>

              <View style={{ paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between" }}>

                <View style={{ alignItems: "center", width: 50, padding: 5, borderWidth: 1, borderColor: "black" }}>
                  <TextInput
                    keyboardType='numeric'
                    onChangeText={text => hellod1(text)}
                    placeholder={minimumvalue.toLocaleString()}

                  >

                  </TextInput>
                </View>
                <View style={{ alignItems: "center", width: 100, padding: 5, borderWidth: 1, borderColor: "black" }}>
                  <TextInput
                    keyboardType='numeric'
                    onChangeText={text => hellod2(text)}
                    placeholder={maximumvalue.toLocaleString()}
                  >

                  </TextInput>
                </View>

              </View>

            </View>





            <View style={{ padding: 15 }}>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>Status of Home</Text>




              <Pressable style={{

                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 20,
                borderWidth: selectedButton === 'For Rent' ? 2 : 1,
                borderColor: 'black',
                borderRadius: 10,
                marginVertical: 20,
                paddingHorizontal: 20,
                marginHorizontal: 20,
                flex: 1,
                backgroundColor: selectedButton === 'For Rent' ? 'lightgray' : 'white',

              }} onPress={
                handle
              }>
                <View style={{ flexDirection: "column" }}>
                  <Text style={{ fontSize: 15, fontWeight: "600" }}>For Rent</Text>
                  <Text style={{ fontSize: 12, paddingTop: 5 }}>You are looking for homes that are available for rent only</Text>
                </View>

              </Pressable >

              <Pressable style={{

                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 20,
                borderWidth: selectedButton === 'For Sale' ? 2 : 1,
                borderColor: 'black',
                borderRadius: 10,
                marginVertical: 20,
                paddingHorizontal: 20,
                marginHorizontal: 20,
                flex: 1,
                backgroundColor: selectedButton === 'For Sale' ? 'lightgray' : 'white',

              }} onPress={
                handle1
              }>
                <View style={{ flexDirection: "column" }}>
                  <Text style={{ fontSize: 15, fontWeight: "600" }}>For Sale</Text>
                  <Text style={{ fontSize: 12, paddingTop: 5 }}>You are looking for homes that are available for sale only</Text>
                </View>
              </Pressable>

            </View>
            <View style={{ marginBottom: 40, padding: 15 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>Amenities</Text>




              <SectionedMultiSelect
                styles={{
                  chipText: {
                    maxWidth: Dimensions.get('screen').width - 90,
                  },
                  container: {
                    margin: 20,

                  },

                  selectToggleText: {
                    fontSize: 15
                  },

                  selectToggle: {
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderRadius: 20,
                    margin: 10,
                    padding: 10
                  },
                  chipContainer: {
                    backgroundColor: 'white',
                    marginBottom: 10

                  },

                  chipText: {
                    color: 'black',
                    fontSize: 16
                  },

                  itemText: {
                    color: selectedItems.length ? 'black' : 'darkgrey',
                    fontSize: 18
                  },

                  selectedItemText: {
                    color: 'blue',
                  },

                  item: {
                    paddingHorizontal: 10,
                    margin: 10,



                  },

                  selectedItem: {
                    backgroundColor: 'rgba(0,0,0,0.1)'
                  },


                  scrollView: { paddingHorizontal: 0 }
                }}
                items={items}
                showChips={true}
                uniqueKey="id"
                IconRenderer={Icon}
                selectText="Choose amenities you want"
                showDropDowns={true}
                modalAnimationType="fade"
                readOnlyHeadings={false}
                onSelectedItemsChange={onSelectedItemsChange}
                selectedItems={selectedItems}
                colors={{ chipColor: "black" }}
                iconKey="icon"
              />

            </View>




















          </ScrollView>

          <TouchableOpacity disabled={posts.length === 0} onPress={() => filter()} style={{ flex: 1, alignSelf: "center", borderRadius: 20, alignItems: "center", borderColor: "white", borderWidth: 1, width: "90%", backgroundColor: "black", position: "absolute", bottom: 0, height: 50, opacity: posts.length === 0 ? .6 : 1 }}>
            <Text style={{ alignSelf: "center", color: "white" }}>Show {posts.length} homes</Text>
          </TouchableOpacity>


        </View>


      </Modal>

      <View>
        {/* {updateNeeded ? <TouchableOpacity onPress={updateApp}  style={{backgroundColor:'black',alignItems:'center',}}>
                <Text style={{alignItems:'center', fontWeight:'bold',fontSize:15, textDecorationLine:'underline',textDecorationStyle:'solid',paddingBottom:10, marginTop: Platform.OS === 'android' ? 10 : 50, color:'white'}}>Get the latest app update</Text>
            </TouchableOpacity>: null} */}
        <Pressable
          style={styles.searchButton}
          onPress={() => navigation.navigate('House Type')}>
          <Fontisto name="search" size={20} color={"deeppink"} />
          <Text adjustsFontSizeToFit={true} style={styles.searchButtonText}>Where do you want to rent?</Text>

        </Pressable>
      </View>
      <ScrollView
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        // snapToInterval={100}
        snapToAlignment="center"
        decelerationRate="fast"
        height={50}
        style={{
          flex: 1,
          position: 'absolute',
          top: Platform.OS === 'ios' ? 120 : 90,
          paddingHorizontal: 10,
          backgroundColor: 'white',
        }}
        contentInset={{
          // ios only
          top: 0,
          left: 0,
          bottom: 0,
          right: 20,
        }}
        contentContainerStyle={{
          paddingRight: Platform.OS === 'android' ? 20 : 0,
          backgroundColor: 'white',
        }}>
        <TouchableOpacity
          onPress={() => setmodalvisible(true)}
          style={{
            flexDirection: 'column',
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 8,
            paddingHorizontal: 20,
            marginHorizontal: 10,
            height: 40,
            shadowColor: 'white',
            shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 30,
            alignItems: 'center',
            borderWidth: .8,
            borderColor: 'black',
            justifyContent: 'space-evenly'
          }}>

          <FontAwesomeIcon icon={faFilter} />
          <Text style={{ fontWeight: "600", paddingTop: 5 }}>
            Filter
          </Text>
        </TouchableOpacity>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => setStatusFilter(category.status)}
            style={[

              styles.button1,
              status === category.status && styles.btnTabActive,
            ]}>

            <FontAwesomeIcon icon={category.icon} style={[{ paddingBottom: 14 }, styles.textTab, status === category.status
              && styles.textTabActive]} />
            <Text
              style={[
                { paddingTop: 2 },
                styles.textTab,
                status === category.status && styles.textTabActive,
              ]}>
              {category.status}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{ flex: 1, marginBottom: 10, top: Platform.OS === 'android' ? 150 : 200, backgroundColor: 'white' }}>
        {loadingType === true ?


          <View style={{ marginVertical: 100, alignItems: 'center' }}>
            <ActivityIndicator size={'large'} color="deeppink" />
          </View>


          :

          <FlatList
            removeClippedSubviews={true}
            data={posts}
            maxToRenderPerBatch={1}
            initialNumToRender={1}
            contentContainerStyle={{ paddingBottom: 40 }}
            //   onEndReached={() => callOnScrollEnd.current = true}
            //   onMomentumScrollEnd={() => {
            //     callOnScrollEnd.current && loadMore(false);
            //     callOnScrollEnd.current = false
            //   }}
            // onEndReached={({distanceFromEnd}) => {
            // }}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            getItemLayout={(data, index) => ({
              length: 380,
              offset: 380 * index,
              index,
            })}
            //ListEmptyComponent={renderNoHome()}
            renderItem={renderItem}
            onEndReachedThreshold={0}
            onEndReached={() => loadMore(nextToken)}
            ListFooterComponent={renderLoader}
            // getItemCount={data => data.length}
            windowSize={3}
            updateCellsBatchingPeriod={100}
          //renderItem={({item}) => <Post post={item}/>}
          />
        }

      </View>
    </ScrollView>

    //         <ScrollView style={{backgroundColor:"#fff"}}>
    //             <View style={{alignItems:"center"}}>
    //             <Modal animationType = {"slide"} transparent = {false}
    //               visible = {modalvisible}
    //              onRequestClose = {() => { 
    //                 navigation.goBack();
    //                 console.log("Modal has been closed.") 
    //                 } }
    //             >

    //               <View style = {{flex: 1,
    //       alignItems: 'center',
    //       backgroundColor: 'white',
    //       padding: 10}}>
    //                  <Text style = {{color: 'black',
    //       marginTop: 10, fontWeight:'bold', fontSize:22}}>Service Charge!</Text>
    //                 <Text style={{marginBottom:20}}>We began RentIt to help people like you. 
    //                     In order to continue doing that, we are now charging a GHS 2 service fee. This payment is one-time. You will not pay
    //                     anything again for using RentIt</Text>
    //                     <View style={{paddingBottom:10}}>
    //                     <Pressable 
    //                                                       style={{ width: 300, backgroundColor: 'black',
    //                                                        justifyContent: 'center', flexDirection: 'row',
    //                                                       alignItems: 'center', borderRadius: 50,
    //                                                         zIndex:1, alignSelf:"center", 

    //                                                     }}
    //                                                         onPress={makeCall1}>
    //                                                         <Fontisto name="phone" size={15} style={{color: 'white' , margin: 10 ,transform: [{ rotate: '90deg' }]}} />

    //                                                         <Text adjustsFontSizeToFit={true} style={{justifyContent: 'center', alignItems: 'center', fontSize: 10,
    //                                                          fontFamily:'Montserrat-SemiBold', color:"white"}}>Call if you have any problems or you need help</Text>

    //                                                             </Pressable>

    //                     </View>
    //                     <View style={{flex:1, flexDirection:"row", justifyContent:'space-between'}}>
    //                     <TouchableOpacity
    //                     onPress={() => {



    //                                     navigation.navigate('Payment', {
    //                                         channel : ["mobile_money"],
    //                                         totalAmount: 2,
    //                                         homeimage: null,
    //                                         homelatitude: null,
    //                                         homelongitude: null,
    //                                         hometitle: null,
    //                                         homebed: null,
    //                                         homeid: null,
    //                                         homeyears: null,
    //                                         homemonths: null,

    //                                     })


    //                     }}
    //                     style={{marginHorizontal:10,alignItems:"center",padding:10,borderRadius:10,backgroundColor:"deeppink", height:40}}
    //                     >


    //                   <Text style={{color:'white', fontSize:14, fontWeight:"bold"}}>
    //                     Pay with Mobile Money
    //                   </Text>
    //               </TouchableOpacity>
    //               <TouchableOpacity
    //               onPress={() => {

    //                 navigation.navigate('Payment', {
    //                     channel : ["card"],
    //                     totalAmount: 2,
    //                     homeimage: null,
    //                     homelatitude: null,
    //                     homelongitude: null,
    //                     hometitle: null,
    //                     homebed: null,
    //                     homeid: null,
    //                     homeyears: null,
    //                     homemonths: null,

    //                 })


    // }}

    //               style={{marginHorizontal:10,alignItems:"center",borderRadius:10,backgroundColor:"blue", padding:10, height:40}}>
    //                   <Text style={{color:'white', fontSize:14, fontWeight:"bold"}}>
    //                     Pay with Debit Card
    //                   </Text>
    //               </TouchableOpacity>


    //                     </View>     

    //               </View>

    //            </Modal>
    //        </View>
    //             <View>
    //                 {updateNeeded ? <TouchableOpacity onPress={updateApp}  style={{backgroundColor:'black',alignItems:'center', }}>
    //                 <Text style={{alignItems:'center', fontWeight:'bold',fontSize:15, textDecorationLine:'underline',textDecorationStyle:'solid',paddingBottom:10, marginTop: Platform.OS === 'android' ? 10 : 50, color:'white'}}>Get the latest app update</Text>
    //             </TouchableOpacity>: null}

    //                 <Pressable 
    //                         style={styles.searchButton}
    //                         onPress={()=> navigation.navigate('House Type')}>
    //                         <Fontisto name="search" size={20} color={"deeppink"}/>
    //                         <Text adjustsFontSizeToFit={true} style={styles.searchButtonText}>Where do you want to rent?</Text>

    //                             </Pressable>
    //                 {/* Search bar */}
    //                 <ImageBackground 

    //                 style={styles.image}>

    //                     {/* <Text adjustsFontSizeToFit={true} style={{marginTop:-20,
    //                         fontSize:30,
    //                         alignSelf:'center',
    //                         zIndex:1,
    //                         fontFamily:'Montserrat-Bold',
    //                         color: color}}>

    //                             A home for everyone

    //                     </Text> */}

    //                     {/* <Pressable 
    //                         style={styles.button}
    //                         onPress={()=> navigation.navigate
    //                         ('House Type')}>
    //                         <Text adjustsFontSizeToFit={true} style={styles.buttonText}>Explore nearby stays</Text>

    //                             </Pressable> */}
    //                 </ImageBackground>
    //                 <View>

    //                     <Image


    //                     style={{height:500, width:Dimensions.get('screen').width - 20, top:-250, borderRadius:25, marginHorizontal:10}}
    //                         source={image}

    //                     />

    //                     {/* <Text style={{top:-250, color:'white', position:'absolute', 
    //                     alignSelf:'center', fontWeight:'bold', fontSize:25}}>
    //                         What are you looking for?</Text>


    //                         <View style={{flex:1, top:-700, alignSelf:'center',flexDirection:'row', justifyContent:'space-between'}}>
    //                         <TouchableOpacity style={{borderRadius:50,alignItems:'center',width:100,backgroundColor:'white', marginHorizontal:10}}>
    //                             <Text style={{padding:10,fontWeight:'bold', fontSize:20, color:'purple'}}>Rent</Text>
    //                         </TouchableOpacity>

    //                         <TouchableOpacity style={{borderRadius:50,alignItems:'center',width:100,backgroundColor:'white', marginHorizontal:10}}>
    //                             <Text style={{color:'purple',padding:10,fontWeight:'bold', fontSize:20}}>Buy</Text>
    //                         </TouchableOpacity>
    //                         </View> */}



    //                 </View>
    //             </View>

    //             <ScrollView style={{marginBottom: 40, backgroundColor: 'white'}}>
    //             <View style={{padding: 5, margin: 10}}>
    //                 <Text style={{fontSize: 25, fontWeight: 'bold', fontFamily:'Montserrat-Bold'}}>
    //                     New Homes



    //                 </Text>
    //                 <Text style={{fontSize:18, fontWeight: 'normal', fontFamily: 'Montserrat-Medium'}}>
    //                         Browse homes you will love</Text>

    //                 </View>

    //                 <OptimizedFlatList
    //                         showsHorizontalScrollIndicator={false}
    //                         showsVerticalScrollIndicator={false}
    //                         decelerationRate={"fast"}
    //                         snapToInterval={Dimensions.get("window").width - 60}
    //                         snapToAlignment={"center"}
    //                         initialNumToRender={10}
    //                         horizontal={true} 
    //                            data={postLatest} 
    //                            renderItem={({item}) => {
    //                                return (
    //                                    <View style={{paddingVertical:20, paddingLeft: 16 }}>
    //                                        <TouchableOpacity onPress={() => {navigation.navigate("Post", {postId: item.id})}}>

    //                                            <FastImage 
    //                                            source={{
    //                                                uri: item.image,
    //                                                headers: { Authorization: 'token' },
    //                                                priority: FastImage.priority.high,
    //                                             }}
    //                                            style={{flex:1, width: Dimensions.get("window").width - 60, marginRight: 8, height: 250, borderRadius:10, resizeMode:'cover'}}/>

    //                                             <View style={{width: Dimensions.get("window").width - 60,
    //                                                             height: 250,
    //                                                             marginRight: 8,
    //                                                             borderRadius: 10,
    //                                                             position: 'absolute',
    //                                                             backgroundColor: '#000',
    //                                                             opacity: .4}}></View>
    //                                             <View style={{
    //                                 shadowColor:"black", shadowOpacity:.5, shadowRadius:30, margin: 10, left:0, top:5, position: 'absolute'
    //                                 ,height:30, width:80, backgroundColor:"white", elevation:90,
    //                                 borderRadius:10, justifyContent:'center', alignItems:"center"}}>
    //                                     <Text adjustsFontSizeToFit={true} style={{fontSize:14, fontWeight:'bold'}}>{item.mode === "For Sale" ? "FOR SALE":"FOR RENT"}</Text>
    //                 </View>
    //                                             <Text style={{ position: 'absolute',
    //                                                             color: 'white',
    //                                                             marginTop: 4,
    //                                                             fontSize: 14,
    //                                                             fontWeight: 'bold',
    //                                                             left: 25,
    //                                                             bottom: 15}}>GH₵ {(Math.round(item.newPrice*1.07)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} |  {item.bedroom} bedrooms</Text>
    //                                         </TouchableOpacity>

    //                                         {/* <Text>{geocod(item.latitude, item.longitude)}</Text> */}
    //                                         {/* <Text style={{fontSize:32}}>This {resiul}</Text> */}
    //                                        {

    //                                         item.locality != null ?
    //                                             <View style={{flex:1, marginHorizontal:10,
    //                                             flexDirection:'row' }}>
    //                                              {/* <Feather style={{paddingTop:9, marginHorizontal:1}}  name='map-pin' size={20}/>    */}
    //                                             <Text style={{fontWeight:'bold', paddingTop:10, fontSize:14}}>
    //                                                  {item.type} in {item.locality}, {item.sublocality}


    //                                                 </Text> 
    //                                                 </View>
    //                                                 :


    //                                            <Text style={{fontSize:14, paddingTop:10, fontWeight:'bold'}}>{item.type}</Text>
    //                                        }
    //                                        </View>
    //                                )
    //                            }}
    //                         />
    //                 {posts.length === 0 ? 

    //                 null :
    //             //     <View style={{padding: 5, margin: 10}}>
    //             //     <Text style={{fontSize: 25, fontWeight: 'bold', fontFamily:'Montserrat-Bold'}}>
    //             //         Nearby Homes

    //             //     </Text>
    //             //     <Text style={{fontSize:18, fontWeight: 'normal', fontFamily: 'Montserrat-Medium'}}>
    //             //             Find homes near you</Text>

    //             // </View>
    //             null

    //                 }

    //                     {/* <OptimizedFlatList
    //                         showsHorizontalScrollIndicator={false}
    //                         showsVerticalScrollIndicator={false}
    //                         decelerationRate={"fast"}
    //                         snapToInterval={Dimensions.get("window").width - 60}
    //                         snapToAlignment={"center"}
    //                         initialNumToRender={10}
    //                         horizontal={true} 
    //                            data={posts} 
    //                            renderItem={({item}) => {
    //                                return (
    //                                    <View style={{paddingVertical:20, paddingLeft: 16 }}>
    //                                        <TouchableOpacity onPress={() => {navigation.navigate("Post", {postId: item.id})}}>
    //                                            <FastImage 
    //                                            source={{
    //                                                uri: item.image,
    //                                                headers: { Authorization: 'token' },
    //                                                priority: FastImage.priority.high,
    //                                             }}
    //                                            style={{flex:1, width: Dimensions.get("window").width - 60, marginRight: 8, height: 250, borderRadius:10, resizeMode:'cover'}}/>
    //                                             <View style={{width: Dimensions.get("window").width - 60,
    //                                                             height: 250,
    //                                                             marginRight: 8,
    //                                                             borderRadius: 10,
    //                                                             position: 'absolute',
    //                                                             backgroundColor: '#000',
    //                                                             opacity: .4}}></View>

    //                                             <Text style={{ position: 'absolute',
    //                                                             color: 'white',
    //                                                             marginTop: 4,
    //                                                             fontSize: 14,
    //                                                             fontWeight: 'bold',
    //                                                             left: 25,
    //                                                             bottom: 15}}>GH₵ {(Math.round(item.newPrice*1.07)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} |  {item.bed} bedrooms</Text>
    //                                         </TouchableOpacity>
    //                                        </View>
    //                                )
    //                            }}
    //                         />
    //  */}


    //                     <View style={{padding: 5, margin: 10}}>
    //                         <Text style={{fontSize: 25, fontWeight: 'bold', fontFamily:'Montserrat-Bold'}}>
    //                             Live anywhere

    //                         </Text>
    //                         <Text style={{fontSize:18, fontWeight: 'normal', fontFamily: 'Montserrat-Medium'}}>
    //                                 Find rooms for rents in</Text>

    //                     </View>

    //                     <View>
    //                         <OptimizedFlatList
    //                         showsHorizontalScrollIndicator={false}
    //                         showsVerticalScrollIndicator={false}
    //                         horizontal={true} 
    //                            data={images} 
    //                            renderItem={({item}) => {
    //                                return (
    //                                    <View style={{paddingVertical:20, paddingLeft: 16 }}>
    //                                        <TouchableOpacity onPress={goToLocationSearch}>
    //                                            <FastImage 
    //                                            source={{
    //                                                uri: item.image,
    //                                                headers: { Authorization: 'token' },
    //                                                priority: FastImage.priority.high,
    //                                             }}
    //                                            style={{width: 250, marginRight: 8, height: 250, borderRadius:10, resizeMode: 'cover'}}/>
    //                                             <View style={styles.ImageOverlay}></View>
    //                                             <Feather name='map-pin' size={26} color='white'
    //                                             style={styles.imageLocationIcon}/>
    //                                             <Text style={styles.ImageText}>{item.title}</Text>
    //                                         </TouchableOpacity>
    //                                        </View>
    //                                )
    //                            }}
    //                         />

    //                     {/* <View style={{padding: 5, margin: 10}}>
    //                         <Text style={{fontSize: 22, fontWeight: 'bold', fontFamily:'Montserrat-Bold'}}>
    //                             Explore

    //                         </Text>
    //                         <Text style={{fontSize:18, fontWeight: 'normal', fontFamily: 'Montserrat-Medium'}}>We have rooms for everyone</Text>
    //                     </View> */}
    //                     {/* <OptimizedFlatList
    //                     showsHorizontalScrollIndicator={false}
    //                     showsVerticalScrollIndicator={false}
    //                         horizontal={true}
    //                         decelerationRate="fast" 
    //                            data={imagesApt} 
    //                            renderItem={({item}) => {
    //                                return (
    //                                    <View style={{paddingVertical:20, paddingLeft: 16 }}>
    //                                        <TouchableOpacity onPress={goToLocationSearch}>
    //                                            <FastImage 
    //                                            source={{
    //                                                uri: item.image,
    //                                                headers: { Authorization: 'token' },
    //                                                priority: FastImage.priority.high,
    //                                             }} 
    //                                            style={{width: 250, marginRight: 8, height: 250, borderRadius:10}}/>
    //                                             <View style={styles.ImageOverlay}></View>

    //                                             <Text style={styles.ImageText}>{item.title}</Text>
    //                                         </TouchableOpacity>
    //                                        </View>
    //                                )
    //                            }}
    //                         /> */}



    //                                    <View style={{margin: 0, padding: 6 }}>

    //                                         <Image 
    //                                                 source={image} 
    //                                                 style={{borderRadius: 20, height: 600, width: '100%', alignSelf:"center"}}/>
    //                                                  <View style={styles.ImageOverlay1}></View>   
    //                                                     <Text adjustsFontSizeToFit={true} style={{flex:1, alignItems: "center", color:"white",
    //                                                       marginLeft: Dimensions.get('screen').width/4.5, width:"100%",
    //                                                       top: 10, position: 'absolute', zIndex:1, fontWeight:"bold",
    //                                                        fontSize:26, fontFamily:'Montserrat-ExtraBold',

    //                                                     }}>
    //                                                         Become a Partner

    //                                                     </Text>
    //                                                     <Text adjustsFontSizeToFit={true} style={{ color:"white",
    //                                                        justifyContent: 'center',
    //                                                       alignSelf: 'center', width:'50%', justifyContent:'center',
    //                                                       top: 50, position: 'absolute', zIndex:1, fontSize:12,
    //                                                       fontFamily: 'Montserrat-Medium'

    //                                                     }}>
    //                                                         Open your home for rent and earn extra income. 

    //                                                     </Text>

    //                                                     <Pressable 
    //                                                       style={{ width: Dimensions.get('screen').width /2, backgroundColor: 'white',
    //                                                        justifyContent: 'center', flexDirection: 'row',
    //                                                       alignItems: 'center', borderRadius: 50,
    //                                                       top: 150, position: 'absolute', zIndex:1, alignSelf:"center"

    //                                                     }}
    //                                                         onPress={makeCall}>
    //                                                         <Fontisto name="phone" size={25} style={{color: 'black' , margin: 10 ,transform: [{ rotate: '90deg' }]}} />

    //                                                         <Text adjustsFontSizeToFit={true} style={{justifyContent: 'center', alignItems: 'center', fontSize: 18,
    //                                                          fontFamily:'Montserrat-SemiBold'}}>Call Now</Text>

    //                                                             </Pressable>


    //                                     </View>




    //                     </View>



    //                 </ScrollView>

    //                     <Pressable onPress={() => navigation.navigate('About')} style={{margin: 10, padding: 16, backgroundColor: 'lightgray', borderRadius:10}}>
    //                         <Text adjustsFontSizeToFit={true} style={{margin: 10, fontSize:25, fontFamily:'Montserrat-Bold'}}>Stay Informed</Text>
    //                         <View style={{margin: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
    //                         <Text adjustsFontSizeToFit={true} style={{fontFamily:'Montserrat-SemiBold', fontSize:12}}>For Tenants</Text>

    //                         <Text adjustsFontSizeToFit={true} style={{fontFamily:'Montserrat-SemiBold', fontSize:12}}>For Landlords</Text>

    //                         </View>
    //                         <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
    //                             <View>
    //                                 <View style={{padding: 5, marginBottom: 5,}}>
    //                                         <Text adjustsFontSizeToFit={true} style={{flex:0.8,padding:2, fontSize:10, fontFamily:'Montserrat-Bold'}}>Cancellation Options</Text>
    //                                         <Text adjustsFontSizeToFit={true} style={{fontSize:8, fontFamily:'Montserrat-Regular'}}>Learn of our flexible policy</Text>
    //                                     </View>

    //                                     <View style={{padding: 5, marginBottom: 5,}}>
    //                                         <Text adjustsFontSizeToFit={true} style={{padding:2, fontSize:10, fontFamily:'Montserrat-Bold'}}>Help Center</Text>
    //                                         <Text adjustsFontSizeToFit={true} style={{fontSize:8, fontFamily:'Montserrat-Regular'}}>Get Support</Text>
    //                                     </View>

    //                                     <View style={{padding: 5, marginBottom: 5,}}>
    //                                         <Text adjustsFontSizeToFit={true} style={{padding:2, fontSize:10, fontFamily:'Montserrat-Bold'}}>Trust and Safety</Text>
    //                                         <Text adjustsFontSizeToFit={true} style={{fontSize:8, fontFamily:'Montserrat-Regular'}}>Our Commitment</Text>
    //                                     </View>
    //                             </View>


    //                             <View>
    //                                 <View style={{padding: 5, marginBottom: 5,}}>
    //                                         <Text adjustsFontSizeToFit={true} style={{padding:2, fontSize:10, fontFamily:'Montserrat-Bold'}}>Cancellation Options</Text>
    //                                         <Text adjustsFontSizeToFit={true} style={{fontSize:8, fontFamily:'Montserrat-Regular'}}>Learn of our flexible policy</Text>
    //                                     </View>

    //                                     <View style={{padding: 5, marginBottom: 5,}}>
    //                                         <Text adjustsFontSizeToFit={true} style={{padding:2, fontSize:10, fontFamily: 'Montserrat-Bold'}}>Help Center</Text>
    //                                         <Text adjustsFontSizeToFit={true} style={{fontSize:8, fontFamily:'Montserrat-Regular'}}>Get Support</Text>
    //                                     </View>

    //                                     <View style={{padding: 5, marginBottom: 5,}}>
    //                                         <Text adjustsFontSizeToFit={true} style={{padding:2, fontSize:10, fontFamily: 'Montserrat-Bold'}}>Trust and Safety</Text>
    //                                         <Text adjustsFontSizeToFit={true} style={{fontSize:8, fontFamily:'Montserrat-Regular'}}>Our Commitment</Text>
    //                                     </View>
    //                             </View>



    //                         </View>


    //                     </Pressable>

    //         </ScrollView>

  );
};

export default HomeScreen;