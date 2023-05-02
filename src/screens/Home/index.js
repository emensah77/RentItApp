/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import React, {useState, useContext, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  View,
  Modal,
  TextInput,
  ActivityIndicator,
  Text,
  Linking,
  Platform,
  Pressable,
  Dimensions,
  PermissionsAndroid,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useNavigation} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import {API, graphqlOperation} from 'aws-amplify';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faFilter,
  faCity,
  faDoorClosed,
  faLandmark,
  faArchway,
  faHotel,
  faIgloo,
  faCampground,
} from '@fortawesome/free-solid-svg-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackgroundGeolocation from 'react-native-background-geolocation';
import BackgroundFetch from 'react-native-background-fetch';
import Video from 'react-native-video';
import {registerTransistorAuthorizationListener} from './Authorization';
import mixpanel from '../../MixpanelConfig';
import useDwellTimeTracking from '../../hooks/useDwellTimeTracking';
import Post from '../../components/Post';
import {AuthContext} from '../../navigation/AuthProvider';
import {listPosts, getUser} from '../../graphql/queries';
import styles from './styles';

mixpanel.init();

const HomeScreen = () => {
  const {trackDwellTime} = useDwellTimeTracking();
  useEffect(trackDwellTime, [trackDwellTime]);
  const navigation = useNavigation();
  const {user} = useContext(AuthContext);
  const [selectedButton, setSelectedButton] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [posts, setPosts] = useState([]);
  const [forceLocation] = useState(true);
  const [highAccuracy] = useState(true);
  const [locationDialog] = useState(true);
  const [useLocationManager] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [status, setStatus] = useState('Entire Flat');
  const [loadingType, setIsLoadingType] = useState(false);
  const [modalvisible, setmodalvisible] = useState(false);
  const [modalVisible, setmodalVisible] = useState(false);
  const [minimumvalue] = useState(1);
  const [maximumvalue, setMaximumValue] = useState(100000);
  // eslint-disable-next-line no-unused-vars
  const [minvalue, setminValue] = useState('');
  const [maxvalue, setmaxValue] = useState('');
  const [nextToken, setNextToken] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [cachedData, setCachedData] = useState({});
  const [loadingMore, setIsLoadingMore] = useState(false);
  const [fetchMore, setFetchMore] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const prevStatus = useRef(null);
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const [refresh, setRefresh] = React.useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasWatchedVideo, setHasWatchedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef(null);
  const [watchedVideoVersion, setWatchedVideoVersion] = useState(null);
  const [videoVersion, setVideoVersion] = useState(0); // Initialize videoVersion state
  const [videoLoading, setIsVideoLoading] = useState(false);

  const bgGeoEventSubscriptions = [];
  /// State.
  const [events, setEvents] = React.useState([]);
  const [enabled, setEnabled] = React.useState(true);

  /// Init BackgroundGeolocation when view renders.
  /// Return a function to .removeListeners() When view is removed.
  React.useEffect(() => {
    BackgroundGeolocation.start();
    initBackgroundFetch();
    setTimeout(() => {
      initBackgroundGeolocation();
    }, 5000);
    registerTransistorAuthorizationListener(navigation);
    return () => {
      unsubscribe();
    };
  }, [initBackgroundGeolocation, navigation, unsubscribe]);

  const subscribe = useCallback(
    subscription => {
      bgGeoEventSubscriptions?.push(subscription);
    },
    [bgGeoEventSubscriptions],
  );

  const unsubscribe = useCallback(() => {
    bgGeoEventSubscriptions?.forEach(subscription => subscription?.remove());
  }, [bgGeoEventSubscriptions]);

  /// Configure the BackgroundGeolocation plugin.
  const initBackgroundGeolocation = useCallback(async () => {
    subscribe(
      BackgroundGeolocation.onProviderChange(event => {
        // console.log('[onProviderChange]', event);
        addEvent('onProviderChange', event);
      }),
    );

    subscribe(
      BackgroundGeolocation.onLocation(
        location => {
          // console.log('[onLocation]', location);

          if (user) {
            // console.log('userID', user.uid);
            firestore().collection('marketers').doc(user.uid).update({
              createdAt: new Date(),
              uid: user.uid,
              displayName: user.displayName,
              lat: location.coords.latitude,
              long: location.coords.longitude,
            });
          }
          addEvent('onLocation', location);
          return location;
        },
        () => {
          // console.warn('[onLocation] ERROR: ', error);
        },
      ),
    );

    subscribe(
      BackgroundGeolocation.onMotionChange(location => {
        // console.log('[onMotionChange]', location);
        addEvent('onMotionChange', location);
      }),
    );

    subscribe(
      BackgroundGeolocation.onGeofence(event => {
        // console.log('[onGeofence]', event);
        addEvent('onGeofence', event);
      }),
    );

    subscribe(
      BackgroundGeolocation.onConnectivityChange(event => {
        // console.log('[onConnectivityChange]', event);
        addEvent('onConnectivityChange', event);
      }),
    );

    subscribe(
      BackgroundGeolocation.onEnabledChange(enabled => {
        // ('[onEnabledChange]', enabled);
        addEvent('onEnabledChange', {enabled});
      }),
    );

    subscribe(
      BackgroundGeolocation.onHttp(event => {
        // ('[onHttp]', event);
        addEvent('onHttp', event);
      }),
    );

    subscribe(
      BackgroundGeolocation.onLocation(() => {
        // console.log(`Latitude: ${location.coords.latitude}`);
        // console.log(`Longitude: ${location.coords.longitude}`);
      }),
    );

    subscribe(
      BackgroundGeolocation.onActivityChange(event => {
        // console.log('[onActivityChange]', event);
        addEvent('onActivityChange', event);
      }),
    );

    subscribe(
      BackgroundGeolocation.onPowerSaveChange(enabled => {
        // console.log('[onPowerSaveChange]', enabled);
        addEvent('onPowerSaveChange', {isPowerSaveMode: enabled});
      }),
    );

    /// Configure the plugin.
    const state = await BackgroundGeolocation.ready(
      {
        logLevel: BackgroundGeolocation.LOG_LEVEL_NONE,
        distanceFilter: 10,
        stopOnTerminate: false,
        startOnBoot: true,
        disableMotionActivityUpdates: true,
        backgroundPermissionRationale: {
          title:
            '{applicationName} uses your location to provide you with relevant recommendations about homes near you, and notifications for price changes in homes near you, including when the app is in the background.',
          message:
            'If you will like to receive these recommendations and notifications, choose Allow all the time.',
          positiveAction: '{backgroundPermissionOptionLabel}',
          negativeAction: 'Cancel',
        },

        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        stopTimeout: 5,
        batchSync: false,
        autoSync: true,
        locationAuthorizationAlert: true,
        locationUpdateInterval: 5000,
        locationAuthorizationRequest: true,
        reset: false,
        notification: {
          title: 'RentIt is accessing your location in background',
          text: 'We will use this to search for homes and monitor change in home prices to provide you discounts.',
        },
        debug: false,
      },
      // eslint-disable-next-line no-shadow
      state => {
        if (!state.enabled) {
          BackgroundGeolocation.start(() => {
            // console.log(' - Start success');
          });
        }
      },
    );

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
        title: 'RentIt is accessing your location in background',
        text: 'We will use this to search for homes and monitor change in home prices to provide you discounts.',
      },
    });

    subscribe(
      BackgroundGeolocation.watchPosition(
        () => {},
        // error => console.log(error),
        {
          interval: 5000,
        },
      ),
    );
    setEnabled(state.enabled);
  }, [subscribe, user]);

  const initBackgroundFetch = useCallback(async () => {
    await BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        stopOnTerminate: true,
      },
      taskId => {
        // console.log('[BackgroundFetch] ', taskId);
        BackgroundFetch.finish(taskId);
      },
      taskId => {
        // console.log('[BackgroundFetch] TIMEOUT: ', taskId);
        BackgroundFetch.finish(taskId);
      },
    );
  }, []);

  /// Adds events to List
  const addEvent = useCallback((name, params) => {
    let timestamp = new Date();
    const event = {
      expanded: false,
      timestamp: `${timestamp.getMonth()}-${timestamp.getDate()} ${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`,
      name,
      params: JSON.stringify(params, null, 2),
    };
    setEvents(previous => [...previous, event]);
  }, []);

  const items = useMemo(
    () => [
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
      },
    ],
    [],
  );

  const categories = useMemo(
    () => [
      {
        //   status: 'All',
        //   id: 1,
        //   icon: faDoorClosed
        // },

        status: 'Entire Flat',
        id: 2,
        icon: faIgloo,
      },
      {
        status: 'Apartment',
        id: 3,
        icon: faCity,
      },
      {
        status: 'Chamber and Hall',
        id: 3,
        icon: faCampground,
      },
      {
        status: 'Mansion',
        id: 4,
        icon: faHotel,
      },
      {
        status: 'Self-Contained',
        id: 5,
        icon: faArchway,
      },
      {
        status: 'Single Room',
        id: 6,
        icon: faDoorClosed,
      },
      {
        status: 'Full Home',
        id: 7,
        icon: faLandmark,
      },
    ],
    [],
  );

  const shuffle = useCallback(array => {
    var m = array.length,
      t,
      i;

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
  }, []);

  const setStatusFilter = useCallback(status => {
    //setObserving(true);
    //setIsLoadingType(true);
    setStatus(status);
    // setNextToken(null);
    // setPosts([]);
    fetchPostsType();
    //console.log('status',status)
    //console.log('isreset', observing)
    //setObserving(false);
    //setIsLoadingType(false);
  }, []);

  const onSelectedItemsChange = useCallback(
    selectedItems => {
      setSelectedItems(selectedItems);
      filterPosts(status);
    },
    [filterPosts, status],
  );

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

  const renderLoader = useCallback(() => {
    return !loading ? (
      <View style={{marginVertical: 100, alignItems: 'center'}}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    ) : null;
  }, [loading]);

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

    // eslint-disable-next-line no-shadow
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
  }, [hasPermissionIOS]);

  const getLocation = useCallback(async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        const res = await firestore().collection('marketers').doc(auth().currentUser.uid).get();

        const data = {
          createdAt: new Date(),
          uid: auth().currentUser.uid,
          displayName: auth().currentUser.displayName,
          lat: position.coords.latitude,
          long: position.coords.longitude,
        };

        if (res.exists) {
          await firestore().collection('marketers').doc(auth().currentUser.uid).update(data);
        } else {
          await firestore().collection('marketers').doc(auth().currentUser.uid).set(data);
        }
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        setLatitude(null);
        setLongitude(null);
        // console.log(error);
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
  }, [forceLocation, hasLocationPermission, highAccuracy, locationDialog, useLocationManager]);

  const makeCall1 = useCallback(() => {
    const phoneNumbers = ['0256744112'];

    let phoneNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phoneNumber}`;
    } else {
      phoneNumber = `telprompt:${phoneNumber}`;
    }
    try {
      Linking.openURL(phoneNumber);
    } catch (e) {
      // console.log(e);
    }
  }, []);

  const makeCall = useCallback(() => {
    const phoneNumbers = ['0552618521', '0597285059', '0597285099', '0205200706', '0579535484'];

    let phoneNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phoneNumber}`;
    } else {
      phoneNumber = `telprompt:${phoneNumber}`;
    }
    try {
      Linking.openURL(phoneNumber);
    } catch (e) {
      // console.log(e);
    }
  }, []);

  const fetchMorePosts = useCallback(async token => {
    try {
      const query = {
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
            status: {eq: HOME_STATUS.APPROVED},
          },
        },
        nextToken: token,
      };

      const postsResult = await API.graphql(graphqlOperation(listPosts, query));
      setPosts([...posts, ...postsResult.data.listPosts.items]);
      if (postsResult?.data?.listPosts?.nextToken !== null) {
        setNextToken(postsResult.data.listPosts.nextToken);
      } else {
      }
    } catch (error) {
      // console.log('error2', error);
    }
  }, []);

  const loadMore = useCallback(async () => {
    setIsLoadingMore(true);
    await personalizedHomes(latitude, longitude, status, nextToken);
    setIsLoadingMore(false);
  }, [latitude, longitude, nextToken, status]);

  const selectColor = useCallback(() => {
    setcolor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  const [images, setimages] = useState([
    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/Kejetia_Kumasi.jpeg',
      title: 'Kumasi',
      key: '1',
    },
    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/accra.jpeg',
      title: 'Accra',
      key: '2',
    },

    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/capecoast.jpeg',
      title: 'CapeCoast',
      key: '3',
    },
  ]);

  const [imagesApt, setimagesapt] = useState([
    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/fullhome.png',
      title: 'Full Homes',
      key: '1',
    },
    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/1bedroom.jpeg',
      title: '1 & 2 bedroom',
      key: '2',
    },

    {
      image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/house9.jpg',
      title: 'Apartment',
      key: '3',
    },
  ]);

  const [partner, setpartner] = useState([
    {
      image: {
        uri: 'https://d5w4alzj7ppu4.cloudfront.net/cities/house9.jpg',
      },
      title: 'Full Homes',
      key: '1',
    },
  ]);
  const fetchPostsType = useCallback(async status => {
    try {
      const query = {
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

      const postsResult = await API.graphql(graphqlOperation(listPosts, query));
      // console.log('previouslist',previousList.length)
      // setPosts(shuffle(postsResult.data.listPosts.items));
      // setPosts(shuffle(posts));
      if (postsResult?.data?.listPosts?.nextToken !== null) {
        setNextToken(postsResult.data.listPosts.nextToken);
      } else {
      }
    } catch (error) {
      // console.log('error1', error);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      const postsResult = await API.graphql(
        graphqlOperation(listPosts, {
          limit: 20,

          nextToken,
        }),
      );

      setPosts(postsResult.data.listPosts.items);
      if (postsResult.data.listPosts.nextToken) {
        setNextToken(postsResult.data.listPosts.nextToken);
        // console.log('nexttoken',nextToken);
      }
    } catch (e) {
      // console.log(e);
    }
  }, [nextToken]);

  const getLatestPost = useCallback(async () => {
    try {
      const postsResult = await API.graphql(
        graphqlOperation(listPosts, {
          limit: 2,
        }),
      );

      setLatest(postsResult.data.listPosts.items);
      // console.log('posts',posts.length)
    } catch (e) {
      console.log(e);
    }
  }, []);

  const userDetails = useCallback(async () => {
    var user = await firestore().collection('users').doc(auth().currentUser.uid);

    user.get().then(doc => {
      if (doc.exists) {
        if (doc.data().phoneNumber === null || doc.data().phoneNumber === '') {
          if (Platform.OS === 'android') {
            navigation.navigate('WelcomeScreen');
          }
          // Do nothing for iOS
        } else {
        }
      }
    });
  }, [navigation]);

  const _getUserData = useCallback(async ID => {
    try {
      const userDB = await API.graphql(
        graphqlOperation(getUser, {
          id: ID,
        }),
      );
      if (userDB.data.getUser !== null) {
      } else {
        try {
        } catch (e) {}
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (!hasWatchedVideo) {
      setmodalVisible(true);
    }
  }, [hasWatchedVideo]);

  useEffect(() => {
    setIsVideoLoading(true);
    const fetchUserDataAndVideoUrl = async () => {
      const response = await fetch(
        'https://slic66yjz7kusyeujpmojwmaum0kwtgd.lambda-url.us-east-2.on.aws/',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            action: 'fetchVideoUrl',
            userId: auth().currentUser.uid,
          }),
        },
      );

      const data = await response.json();
      setHasWatchedVideo(data.hasWatchedVideo);
      setVideoUrl(data.videoUrl);
      setVideoVersion(data.videoVersion);
      setWatchedVideoVersion(data.watchedVideoVersion);

      setIsVideoLoading(false); // Show the video after 10 seconds
    };

    fetchUserDataAndVideoUrl();
  }, []);

  const handleVideoPlaybackComplete = useCallback(async () => {
    await fetch('https://slic66yjz7kusyeujpmojwmaum0kwtgd.lambda-url.us-east-2.on.aws/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        action: 'updateWatchStatus',
        userId: auth().currentUser.uid,
        videoVersion, // Send the video version
      }),
    });

    setHasWatchedVideo(true);
    setmodalVisible(false); // Add this line to close the modal
  }, [videoVersion]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingType(true);
      if (!cachedData[status]) {
        const data = await personalizedHomes(latitude, longitude, status, null);
        if (data && data.homes) {
          setPosts(data.homes);
          setCachedData(prevData => ({...prevData, [status]: data.homes}));
          setNextToken(data.nextToken);
        } else {
          setPosts([]);
        }
      } else {
        setPosts(cachedData[status]);
      }
      setIsLoadingType(false);
    };

    // Reset posts and nextToken when status changes
    if (status !== prevStatus.current) {
      setPosts([]);
      setNextToken(null);
      prevStatus.current = status;
    }

    fetchInitialData();

    // setIsLoadingType(true);
    // console.log('latitude', latitude);
    // console.log('longitude', longitude);
    // personalizedHomes(latitude, longitude, status);
    // setIsLoadingType(false);

    _getUserData(auth().currentUser.uid);

    userDetails();
    // setStatus(status);
    // setPosts([]);
    // setNextToken(null);
    // console.log('status', status);
    // console.log('nextToken', nextToken);
    // setInterval(selectColor, 2000);
    // VersionCheck.needUpdate().then(async res => {
    //   //console.log(res.isNeeded);    // true
    //   if (res.isNeeded) {
    //     setUpdateNeeded(true);
    //     setUpdateUrl(res.storeUrl);
    //     //console.log(res.storeUrl === updateUrl);
    //     //Linking.openURL(res.storeUrl);  // open store if update is needed.
    //   }
    // });

    // setIsLoadingType(true);
    // fetchPostsType(status);
    // setIsLoadingType(false);
    // console.log('posts', posts);
    // getLatestPost();

    //console.log('This is latest',postLatest.map(item => (item.createdAt)));
    //clearInterval(selectColor);
  }, [status, latitude, longitude, _getUserData, userDetails, cachedData]);
  //    if (postLatest){
  //     postLatest.sort(function (a, b) {
  //         return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  //       });
  //    }
  // Add controls for navigating between pages
  // Increment the page

  const fetchMoreData = useCallback(async () => {
    if (nextToken && !fetchingMore) {
      setFetchingMore(true);
      const data = await personalizedHomes(latitude, longitude, status, nextToken);
      const updatedData = [...posts, ...data.homes];
      setPosts(updatedData);
      setCachedData(prevData => ({...prevData, [status]: updatedData}));
      setNextToken(data.nextToken);
      setFetchingMore(false);
    }
  }, [fetchingMore, latitude, longitude, nextToken, personalizedHomes, posts, status]);

  useEffect(() => {}, [posts]);

  const personalizedHomes = useCallback(
    async (userLatitude, userLongitude, homeType, nextToken) => {
      try {
        //setIsLoadingType(true);
        const response = await fetch(
          'https://v4b6dicdx2igrg4nd6slpf35ru0tmwhe.lambda-url.us-east-2.on.aws/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userLocation: {
                latitude: userLatitude,
                longitude: userLongitude,
              },
              homeType,
              nextToken,
            }),
          },
        );

        const data = await response.json();
        //console.log("Response data:", data.homes.length); // Add console log here
        console.log('Response token:', data.nextToken); // Add console log here

        return data;
      } catch (error) {
        console.error(error);
      } finally {
        //setIsLoadingType(false); // Set loading state to false
      }
    },
    [],
  );

  const onEndReached = useCallback(() => {
    fetchMoreData();
  }, [fetchMoreData]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  //   const updateApp = useCallback(() => {
  //     Linking.openURL(updateUrl);
  //   }, [updateUrl]);

  const goToLocationSearch = useCallback(() => {
    navigation.navigate('House Type');
  }, [navigation]);

  const filterPosts = useCallback(
    async status => {
      console.log(maximumvalue);
      try {
        let query = {
          limit: 100000,
          filter: {
            and: {
              type: {
                eq: status,
              },
              mode: {
                eq: selectedButton,
              },
              newPrice: {
                le: maximumvalue,
              },
              wifi: {
                eq: selectedItems.includes('WiFi') ? 'Yes' : 'No',
              },
              kitchen: {
                eq: selectedItems.includes('Kitchen') ? 'Yes' : 'No',
              },
              toilet: {
                eq: selectedItems.includes('Toilet') ? 'Yes' : 'No',
              },
              water: {
                eq: selectedItems.includes('Water') ? 'Yes' : 'No',
              },
              aircondition: {
                eq: selectedItems.includes('Air Conditioner') ? 'Yes' : 'No',
              },
              bathroom: {
                eq: selectedItems.includes('Bathroom') ? 'Yes' : 'No',
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

        if (!selectedItems.includes('WiFi')) {
          delete query.filter.and.wifi;
        }
        if (!selectedItems.includes('Water')) {
          delete query.filter.and.water;
        }
        if (!selectedItems.includes('Kitchen')) {
          delete query.filter.and.kitchen;
        }
        if (!selectedItems.includes('Toilet')) {
          delete query.filter.and.toilet;
        }
        if (!selectedItems.includes('Bathroom')) {
          delete query.filter.and.bathroom;
        }
        if (!selectedItems.includes('Air Conditioner')) {
          delete query.filter.and.aircondition;
        }
        if (selectedButton === '') {
          delete query.filter.and.mode;
        }

        const postsResult = await API.graphql(graphqlOperation(listPosts, query));
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
    },
    [maximumvalue, selectedButton, selectedItems],
  );

  const hellod1 = useCallback(text => {
    setminValue(parseInt(text));
  }, []);
  const hellod2 = useCallback(text => {
    setmaxValue(parseInt(text));
  }, []);
  const handle = useCallback(() => {
    setSelectedButton('For Rent');
    filterPosts(status);
    console.log(selectedButton);
  }, [filterPosts, selectedButton, status]);

  const handle1 = useCallback(() => {
    setSelectedButton('For Sale');
    filterPosts(status);
    console.log(selectedButton);
  }, [filterPosts, selectedButton, status]);
  const filter = useCallback(() => {
    filterPosts(status);
    setmodalvisible(false);
  }, [filterPosts, status]);

  //  getting wishlists ================

  //  getting wishlists ================

  const renderItem = ({item}) => (
    <View key={item}>
      <Post post={item} />
    </View>
  );

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <Modal
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 20,
        }}
        animationType="slide"
        transparent={false}
        visible={modalvisible}
        onRequestClose={() => {
          setmodalvisible(false);
          // console.log('Modal has been closed.');
        }}>
        <View style={{paddingTop: 10}}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              flexDirection: 'column',
              justifyContent: 'space-evenly',
            }}>
            <View style={{marginTop: 20}}>
              <Pressable onPress={() => setmodalvisible(false)} style={{margin: 10}}>
                <FontAwesomeIcon icon={faArrowLeft} size={20} />
              </Pressable>
              <View style={{flex: 1, alignSelf: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>Price range</Text>
                <MultiSlider
                  min={minimumvalue}
                  max={maximumvalue}
                  step={100}
                  sliderLength={310}
                  onValuesChange={value => {
                    setMaximumValue(value[0]);
                    filterPosts(status);
                  }}
                />
              </View>

              <View
                style={{
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    width: 50,
                    padding: 5,
                    borderWidth: 1,
                    borderColor: 'black',
                  }}>
                  <TextInput
                    keyboardType="numeric"
                    onChangeText={text => hellod1(text)}
                    placeholder={minimumvalue.toLocaleString()}
                  />
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    width: 100,
                    padding: 5,
                    borderWidth: 1,
                    borderColor: 'black',
                  }}>
                  <TextInput
                    keyboardType="numeric"
                    onChangeText={text => hellod2(text)}
                    placeholder={maximumvalue.toLocaleString()}
                  />
                </View>
              </View>
            </View>

            <View style={{padding: 15}}>
              <Text style={{fontWeight: 'bold', fontSize: 20}}>Status of Home</Text>

              <Pressable
                style={{
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
                }}
                onPress={handle}>
                <View style={{flexDirection: 'column'}}>
                  <Text style={{fontSize: 15, fontWeight: '600'}}>For Rent</Text>
                  <Text style={{fontSize: 12, paddingTop: 5}}>
                    You are looking for homes that are available for rent only
                  </Text>
                </View>
              </Pressable>

              <Pressable
                style={{
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
                }}
                onPress={handle1}>
                <View style={{flexDirection: 'column'}}>
                  <Text style={{fontSize: 15, fontWeight: '600'}}>For Sale</Text>
                  <Text style={{fontSize: 12, paddingTop: 5}}>
                    You are looking for homes that are available for sale only
                  </Text>
                </View>
              </Pressable>
            </View>
            <View style={{marginBottom: 40, padding: 15}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>Amenities</Text>

              <SectionedMultiSelect
                styles={{
                  container: {
                    margin: 20,
                  },

                  selectToggleText: {
                    fontSize: 15,
                  },

                  selectToggle: {
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderRadius: 20,
                    margin: 10,
                    padding: 10,
                  },
                  chipContainer: {
                    backgroundColor: 'white',
                    marginBottom: 10,
                  },

                  chipText: {
                    color: 'black',
                    fontSize: 16,
                    maxWidth: Dimensions.get('screen').width - 90,
                  },

                  itemText: {
                    color: selectedItems.length ? 'black' : 'darkgrey',
                    fontSize: 18,
                  },

                  selectedItemText: {
                    color: 'blue',
                  },

                  item: {
                    paddingHorizontal: 10,
                    margin: 10,
                  },

                  selectedItem: {
                    backgroundColor: 'rgba(0,0,0,0.1)',
                  },

                  scrollView: {paddingHorizontal: 0},
                }}
                items={items}
                showChips
                uniqueKey="id"
                IconRenderer={Icon}
                selectText="Choose amenities you want"
                showDropDowns
                modalAnimationType="fade"
                readOnlyHeadings={false}
                onSelectedItemsChange={onSelectedItemsChange}
                selectedItems={selectedItems}
                colors={{chipColor: 'black'}}
                iconKey="icon"
              />
            </View>
          </ScrollView>

          <TouchableOpacity
            disabled={posts.length === 0}
            onPress={() => filter()}
            style={{
              flex: 1,
              alignSelf: 'center',
              borderRadius: 20,
              alignItems: 'center',
              borderColor: 'white',
              borderWidth: 1,
              width: '90%',
              backgroundColor: 'black',
              position: 'absolute',
              bottom: 0,
              height: 50,
              opacity: posts.length === 0 ? 0.6 : 1,
            }}>
            <Text style={{alignSelf: 'center', color: 'white'}}>Show {posts.length} homes</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View>
        {/* {updateNeeded ? <TouchableOpacity onPress={updateApp}  style={{backgroundColor:'black',alignItems:'center',}}>
                <Text style={{alignItems:'center', fontWeight:'bold',fontSize:15, textDecorationLine:'underline',textDecorationStyle:'solid',paddingBottom:10, marginTop: Platform.OS === 'android' ? 10 : 50, color:'white'}}>Get the latest app update</Text>
            </TouchableOpacity>: null} */}
        <Pressable style={styles.searchButton} onPress={() => navigation.navigate('House Type')}>
          <Fontisto name="search" size={20} color="deeppink" />
          <Text adjustsFontSizeToFit style={styles.searchButtonText}>
            Where do you want to rent?
          </Text>
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
            shadowOffset: {width: 10, height: 10},
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 30,
            alignItems: 'center',
            borderWidth: 0.8,
            borderColor: 'black',
            justifyContent: 'space-evenly',
          }}>
          <FontAwesomeIcon icon={faFilter} />
          <Text style={{fontWeight: '600', paddingTop: 5}}>Filter</Text>
        </TouchableOpacity>
        {categories.map((category, index) => (
          <TouchableOpacity
            // eslint-disable-next-line react/no-array-index-key
            key={index.toString()}
            onPress={() => setStatusFilter(category.status)}
            style={[styles.button1, status === category.status && styles.btnTabActive]}>
            <FontAwesomeIcon
              icon={category.icon}
              style={[
                {paddingBottom: 14},
                styles.textTab,
                status === category.status && styles.textTabActive,
              ]}
            />
            <Text
              style={[
                {paddingTop: 2},
                styles.textTab,
                status === category.status && styles.textTabActive,
              ]}>
              {category.status}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View
        style={{
          flex: 1,
          marginBottom: 10,
          top: Platform.OS === 'android' ? 150 : 200,
          backgroundColor: 'white',
        }}>
        {loadingType === true ? (
          <View style={{marginVertical: 100, alignItems: 'center'}}>
            <ActivityIndicator size="large" color="deeppink" />
          </View>
        ) : (
          <FlatList
            removeClippedSubviews
            data={posts}
            maxToRenderPerBatch={1}
            initialNumToRender={1}
            contentContainerStyle={{paddingBottom: 40}}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            getItemLayout={(data, index) => ({
              length: 380,
              offset: 380 * index,
              index,
            })}
            // ListEmptyComponent={renderNoHome()}
            extraData={posts}
            renderItem={renderItem}
            onEndReachedThreshold={0.5}
            onEndReached={onEndReached}
            ListFooterComponent={fetchingMore ? renderLoader : null}
            windowSize={3}
            updateCellsBatchingPeriod={100}
          />
        )}
      </View>
      {videoUrl && (hasWatchedVideo === false || watchedVideoVersion !== videoVersion) ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          //onRequestClose={closeModal}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height * 0.5,
                backgroundColor: 'black',
                borderRadius: 30,

                borderColor: 'white',
              }}>
              {videoLoading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 30,
                  }}>
                  <ActivityIndicator size={'large'} color="white" />
                </View>
              ) : (
                <Video
                  ref={videoRef}
                  source={{uri: videoUrl}}
                  resizeMode="cover"
                  style={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                    borderRadius: 30,
                    borderWidth: 2,
                    borderColor: 'white',
                  }}
                  onEnd={handleVideoPlaybackComplete}
                />
              )}
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
};

export default HomeScreen;
