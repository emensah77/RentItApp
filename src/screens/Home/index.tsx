import React, {FC, useCallback, useState, useEffect, useRef} from 'react';
import {ViewStyle, View, FlatList} from 'react-native';
import {API, graphqlOperation} from 'aws-amplify';
import {Page} from '@components';
import {AppStackScreenProps} from '@navigation/AppStack';
import {Icon} from '@components/Icon';
import {SizedBox} from '@components/SizedBox';
import {Card} from '@components/Card';
import {colors, palette} from '@theme';

import {CategoryNavigator} from '@components/Explore';
import {pageInnerHorizontalPadding} from '@assets/styles/global';
import Post from '@components/Post';
import {listPosts} from '../../graphql/queries';
import styles from './styles';

interface HomeScreenProps extends AppStackScreenProps<'Home'> {}
const HomeScreen: FC<HomeScreenProps> = () => {
  const [status, setStatus] = useState('Entire Flat');
  const [nextToken, setNextToken] = useState(null);
  const [modalvisible, setmodalvisible] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loadingType, setIsLoadingType] = useState(false);
  const [posts, setPosts] = useState([]);
  const [cachedData, setCachedData] = useState({});
  const prevStatus = useRef(null);

  const memoizedCategoryNav = useCallback(() => {
    return <CategoryNavigator {...{status, open, setStatusFilter}} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchPostsType = useCallback(async newStatus => {
    try {
      const query = {
        limit: 100000,
        filter: {
          and: {
            type: {
              eq: newStatus,
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

      const postsResult: any = await API.graphql(graphqlOperation(listPosts, query));

      if (postsResult?.data?.listPosts?.nextToken !== null) {
        setNextToken(postsResult.data.listPosts.nextToken);
      } else {
      }
    } catch (error) {
      // console.log('error1', error);
    }
  }, []);

  const setStatusFilter = useCallback(
    _status => () => {
      setStatus(_status);
      // @ts-ignore
      fetchPostsType();
    },
    [fetchPostsType],
  );

  const open = useCallback(() => {
    setmodalvisible(true);
  }, []);

  const personalizedHomes = useCallback(
    async (userLatitude, userLongitude, homeType, newNextToken) => {
      try {
        // setIsLoadingType(true);
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
              nextToken: newNextToken,
            }),
          },
        );

        const data = await response.json();

        return data;
      } catch (error) {
        console.error(error);
      } finally {
        // setIsLoadingType(false); // Set loading state to false
      }
    },
    [],
  );

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
      // @ts-ignore
      prevStatus.current = status;
    }

    fetchInitialData();

    // _getUserData(auth().currentUser.uid);

    // userDetails();
  }, [status, latitude, longitude, cachedData, personalizedHomes]);

  const renderItem = useCallback(
    ({item}) => (
      <View key={item}>
        <Post post={item} />
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback(item => item.id.toString(), []);

  return (
    <Page
      safeAreaEdges={['top']}
      type=""
      backgroundColor={palette.textInverse}
      hasPadding={false}
      inline>
      <View style={$headerStyle}>
        <Card
          style={$cardStyle}
          HeadingTextProps={{size: 'xs'}}
          heading="Where to?"
          footer="Anywhere ⦁ Any week ⦁ Add guests"
          FooterTextProps={{style: {color: palette.textInverse300}, size: 'xxs'}}
          LeftComponent={<Icon icon="searchMini" size={25} />}
          RightComponent={<Icon icon="filterMini" size={35} />}
        />
        <SizedBox height={20} />
        {memoizedCategoryNav()}
      </View>

      <FlatList
        data={posts}
        initialNumToRender={10}
        contentContainerStyle={styles.padding40}
        keyExtractor={keyExtractor}
        // getItemLayout={getItemLayout}
        // ListEmptyComponent={renderNoHome()}
        extraData={posts}
        renderItem={renderItem}
        onEndReachedThreshold={0.5}
        // onEndReached={onEndReached}
        // ListFooterComponent={fetchingMore ? renderLoader : null}
      />
    </Page>
  );
};

const $cardStyle: ViewStyle = {
  borderWidth: 0.7,
  borderColor: colors.palette.neutral,
  alignItems: 'center',
  borderRadius: 40,
  paddingVertical: 8,
  paddingLeft: 20,
  paddingRight: 12,
  shadowOffset: {width: 0, height: 1},
  shadowOpacity: 0.1,
  shadowRadius: 2,
  backgroundColor: colors.palette.textInverse,
};

const $headerStyle: ViewStyle = {
  paddingHorizontal: pageInnerHorizontalPadding,
  shadowColor: colors.palette.neutral800,
  shadowOffset: {width: 0, height: 5},
  shadowOpacity: 0.09,
  shadowRadius: 5,
  backgroundColor: colors.palette.textInverse,
  elevation: 4,
};

export default HomeScreen;

// import React, {useState, useContext, useEffect, useRef, useCallback, useMemo} from 'react';
// import {
//   View,
//   Modal,
//   TextInput,
//   ActivityIndicator,
//   Text,
//   Linking,
//   Platform,
//   Pressable,
//   Dimensions,
//   PermissionsAndroid,
//   ScrollView,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   ToastAndroid,
// } from 'react-native';
// import Fontisto from 'react-native-vector-icons/Fontisto';
// import {useNavigation} from '@react-navigation/native';
// import Geolocation from 'react-native-geolocation-service';
// import {API, graphqlOperation} from 'aws-amplify';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
// import {
//   faArrowLeft,
//   faFilter,
//   faCity,
//   faDoorClosed,
//   faLandmark,
//   faArchway,
//   faHotel,
//   faIgloo,
//   faCampground,
// } from '@fortawesome/free-solid-svg-icons';
// import MultiSlider from '@ptomasroos/react-native-multi-slider';
// import SectionedMultiSelect from 'react-native-sectioned-multi-select';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import BackgroundGeolocation from 'react-native-background-geolocation';
// import BackgroundFetch from 'react-native-background-fetch';
// import Video from 'react-native-video';

// import {registerTransistorAuthorizationListener} from './Authorization';
// import styles from './styles';

// import mixpanel from '../../MixpanelConfig';
// import useDwellTimeTracking from '../../hooks/useDwellTimeTracking';
// import Post from '../../components/Post';
// import {AuthContext} from '../../navigation/AuthProvider';
// import {listPosts, getUser} from '../../graphql/queries';

// mixpanel.init();

// const HomeScreen = () => {
//   const [selectedButton, setSelectedButton] = useState('');
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [posts, setPosts] = useState([]);
//   const [forceLocation] = useState(true);
//   const [highAccuracy] = useState(true);
//   const [locationDialog] = useState(true);
//   const [useLocationManager] = useState(false);
//   const [latitude, setLatitude] = useState(null);
//   const [longitude, setLongitude] = useState(null);
//   const [status, setStatus] = useState('Entire Flat');
//   const [loadingType, setIsLoadingType] = useState(false);
//   const [modalvisible, setmodalvisible] = useState(false);
//   const [modalVisible, setmodalVisible] = useState(false);
//   const [minimumvalue] = useState(1);
//   const [maximumvalue, setMaximumValue] = useState(100000);
//   // const [minvalue, setminValue] = useState('');
//   // const [maxvalue, setmaxValue] = useState('');
//   const [nextToken, setNextToken] = useState(null);
//   // const [loading, setIsLoading] = useState(false);
//   const [cachedData, setCachedData] = useState({});
//   const prevStatus = useRef(null);
//   const [fetchingMore, setFetchingMore] = useState(false);
//   const [hasWatchedVideo, setHasWatchedVideo] = useState(null);
//   const [videoUrl, setVideoUrl] = useState(null);
//   const videoRef = useRef(null);
//   const [watchedVideoVersion, setWatchedVideoVersion] = useState(null);
//   const [videoVersion, setVideoVersion] = useState(0); // Initialize videoVersion state
//   const [videoLoading, setIsVideoLoading] = useState(false);

//   const navigation = useNavigation();
//   const {user} = useContext(AuthContext);

//   const bgGeoEventSubscriptions = useMemo(() => [], []);
//   const loading = useMemo(() => false, []);

//   const subscribe = useCallback(
//     subscription => {
//       bgGeoEventSubscriptions?.push(subscription);
//     },
//     [bgGeoEventSubscriptions],
//   );

//   const unsubscribe = useCallback(() => {
//     bgGeoEventSubscriptions?.forEach(subscription => subscription?.remove());
//   }, [bgGeoEventSubscriptions]);

//   // Configure the BackgroundGeolocation plugin.
//   const initBackgroundGeolocation = useCallback(async () => {
//     if (!hasLocationPermission()) return;

//     subscribe(
//       BackgroundGeolocation.onProviderChange(event => {
//         // console.log('[onProviderChange]', event);
//         addEvent('onProviderChange', event);
//       }),
//     );

//     subscribe(
//       BackgroundGeolocation.onLocation(
//         async location => {
//           if (location.sample === true) return;

//           // console.log('[onLocation]', location);

//           if (user) {
//             // console.log('userID', user.uid);
//             const userDoc = firestore().collection('marketers').doc(user.uid);
//             const doc = await userDoc.get();
//             if (doc.exists) {
//               userDoc.update({
//                 createdAt: new Date(),
//                 uid: user.uid,
//                 displayName: user.displayName,
//                 lat: location.coords.latitude,
//                 long: location.coords.longitude,
//               });
//             }
//           }
//           addEvent('onLocation', location);
//           return location;
//         },
//         e => {
//           console.error('[onLocation] ERROR: ', e);
//         },
//       ),
//     );

//     // subscribe(
//     //   BackgroundGeolocation.onMotionChange(location => {
//     //     // console.log('[onMotionChange]', location);
//     //     addEvent('onMotionChange', location);
//     //   }),
//     // );

//     // subscribe(
//     //   BackgroundGeolocation.onGeofence(event => {
//     //     // console.log('[onGeofence]', event);
//     //     addEvent('onGeofence', event);
//     //   }),
//     // );

//     // subscribe(
//     //   BackgroundGeolocation.onConnectivityChange(event => {
//     //     // console.log('[onConnectivityChange]', event);
//     //     addEvent('onConnectivityChange', event);
//     //   }),
//     // );

//     subscribe(
//       BackgroundGeolocation.onEnabledChange(_enabled => {
//         // console.log('[onEnabledChange]', _enabled);
//         addEvent('onEnabledChange', {enabled: _enabled});
//       }),
//     );

//     subscribe(
//       BackgroundGeolocation.onHttp(event => {
//         // console.log('[onHttp]', event);
//         addEvent('onHttp', event);
//       }),
//     );

//     // subscribe(
//     //   BackgroundGeolocation.onActivityChange(event => {
//     //     // console.log('[onActivityChange]', event);
//     //     addEvent('onActivityChange', event);
//     //   }),
//     // );

//     // subscribe(
//     //   BackgroundGeolocation.onPowerSaveChange(isPowerSaveMode => {
//     //     // console.log('[onPowerSaveChange]', enabled);
//     //     addEvent('onPowerSaveChange', {isPowerSaveMode});
//     //   }),
//     // );

//     subscribe(
//       BackgroundGeolocation.onPowerSaveChange(isPowerSaveMode => {
//         // console.log('[onPowerSaveChange]', isPowerSaveMode);
//         addEvent('onPowerSaveChange', {isPowerSaveMode});
//       }),
//     );

//     // Configure the plugin.
//     const state = await BackgroundGeolocation.ready(
//       {
//         logLevel: BackgroundGeolocation.LOG_LEVEL_NONE,
//         distanceFilter: 10,
//         stopOnTerminate: false,
//         startOnBoot: true,
//         disableMotionActivityUpdates: true,
//         backgroundPermissionRationale: {
//           title:
//             '{applicationName} uses your location to provide you with relevant recommendations about homes near you, and notifications for price changes in homes near you, including when the app is in the background.',
//           message:
//             'If you will like to receive these recommendations and notifications, choose Allow all the time.',
//           positiveAction: '{backgroundPermissionOptionLabel}',
//           negativeAction: 'Cancel',
//         },

//         desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
//         stopTimeout: 5,
//         batchSync: false,
//         autoSync: true,
//         locationAuthorizationAlert: true,
//         locationUpdateInterval: 5000,
//         locationAuthorizationRequest: true,
//         reset: false,
//         notification: {
//           title: 'RentIt is accessing your location in background',
//           text: 'We will use this to search for homes and monitor change in home prices to provide you discounts.',
//         },
//         debug: __DEV__,
//       },
//       newState => {
//         if (!newState.enabled) {
//           // BackgroundGeolocation.start(() => {
//           //   // console.log(' - Start success');
//           // });
//         }
//       },
//     );

//     if (state && !state.enabled) {
//       BackgroundGeolocation.start({
//         foregroundService: true,
//         BackgroundFetch: true,
//         notificationTitle: null,
//         notificationText: null,
//         enableHeadless: true,
//         stopOnTerminate: false,
//         startOnBoot: true,
//         disableMotionActivityUpdates: true,
//       });

//       addEvent('Current state', state);

//       BackgroundGeolocation.setConfig({
//         notification: {
//           title: 'RentIt is accessing your location in background',
//           text: 'We will use this to search for homes and monitor change in home prices to provide you discounts.',
//         },
//       });

//       subscribe(
//         BackgroundGeolocation.watchPosition(
//           location => console.error('[watchPosition]', location),
//           error => console.error('[watchPosition] error', error),
//           {
//             interval: 5000,
//           },
//         ),
//       );
//     }

//     // setEnabled(state.enabled);
//   }, [addEvent, hasLocationPermission, subscribe, user]);

//   const initBackgroundFetch = useCallback(async () => {
//     await BackgroundFetch.configure(
//       {
//         minimumFetchInterval: 15,
//         stopOnTerminate: true,
//       },
//       taskId => {
//         // console.log('[BackgroundFetch] ', taskId);
//         BackgroundFetch.finish(taskId);
//       },
//       taskId => {
//         // console.log('[BackgroundFetch] TIMEOUT: ', taskId);
//         BackgroundFetch.finish(taskId);
//       },
//     );
//   }, []);

//   /// Adds events to List
//   const addEvent = useCallback(
//     (/* name, params */) => {
//       // const timestamp = new Date();
//       // const event = {
//       //   expanded: false,
//       //   timestamp: `${timestamp.getMonth()}-${timestamp.getDate()} ${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`,
//       //   name,
//       //   params: JSON.stringify(params, null, 2),
//       // };
//       // setEvents(previous => [...previous, event]);
//     },
//     [],
//   );

//   const items = useMemo(
//     () => [
//       {
//         name: 'Air Conditioner',
//         id: 'Air Conditioner',
//       },
//       {
//         name: 'WiFi',
//         id: 'WiFi',
//       },
//       {
//         name: 'Kitchen',
//         id: 'Kitchen',
//       },
//       {
//         name: 'Water',
//         id: 'Water',
//       },
//       {
//         name: 'Toilet',
//         id: 'Toilet',
//       },
//       {
//         name: 'Bathroom',
//         id: 'Bathroom',
//       },
//     ],
//     [],
//   );

// const categories = useMemo(
//   () => [
//     {
//       //   status: 'All',
//       //   id: 1,
//       //   icon: faDoorClosed
//       // },

//       status: 'Entire Flat',
//       id: 2,
//       icon: faIgloo,
//     },
//     {
//       status: 'Apartment',
//       id: 3,
//       icon: faCity,
//     },
//     {
//       status: 'Chamber and Hall',
//       id: 4,
//       icon: faCampground,
//     },
//     {
//       status: 'Mansion',
//       id: 5,
//       icon: faHotel,
//     },
//     {
//       status: 'Self-Contained',
//       id: 6,
//       icon: faArchway,
//     },
//     {
//       status: 'Single Room',
//       id: 7,
//       icon: faDoorClosed,
//     },
//     {
//       status: 'Full Home',
//       id: 8,
//       icon: faLandmark,
//     },
//   ],
//   [],
// );

// const setStatusFilter = useCallback(
//   _status => () => {
//     // setObserving(true);
//     // setIsLoadingType(true);
//     setStatus(_status);
//     // setNextToken(null);
//     // setPosts([]);
//     fetchPostsType();
//     // console.log('status',status)
//     // console.log('isreset', observing)
//     // setObserving(false);
//     // setIsLoadingType(false);
//   },
//   [fetchPostsType],
// );

//   const onSelectedItemsChange = useCallback(
//     newSelectedItems => {
//       setSelectedItems(newSelectedItems);
//       filterPosts(status);
//     },
//     [filterPosts, status],
//   );

//   const hasPermissionIOS = useCallback(async () => {
//     const openSetting = () => {
//       Linking.openSettings().catch(() => {
//         Alert.alert('Unable to open settings');
//       });
//     };
//     const newStatus = await Geolocation.requestAuthorization('whenInUse');

//     if (newStatus === 'granted') {
//       return true;
//     }

//     if (newStatus === 'denied') {
//       Alert.alert('Location permission denied');
//     }

//     if (newStatus === 'disabled') {
//       Alert.alert('Turn on Location Services to allow "RentIt" to determine your location.', '', [
//         {text: 'Go to Settings', onPress: openSetting},
//         {text: "Don't Use Location", onPress: () => {}},
//       ]);
//     }

//     return false;
//   }, []);

//   const hasLocationPermission = useCallback(async () => {
//     if (Platform.OS === 'ios') {
//       const hasPermission = await hasPermissionIOS();
//       return hasPermission;
//     }

//     if (Platform.OS === 'android' && Platform.Version < 23) {
//       return true;
//     }

//     const hasPermission = await PermissionsAndroid.check(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//     );

//     if (hasPermission) {
//       return true;
//     }

//     const newStatus = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//     );

//     if (newStatus === PermissionsAndroid.RESULTS.GRANTED) {
//       return true;
//     }

//     if (newStatus === PermissionsAndroid.RESULTS.DENIED) {
//       ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
//     } else if (newStatus === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
//       ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
//     }

//     return false;
//   }, [hasPermissionIOS]);

//   const renderLoader = useCallback(
//     () =>
//       !loading ? (
//         <View style={styles.loader}>
//           <ActivityIndicator size="large" color="blue" />
//         </View>
//       ) : null,
//     [loading],
//   );

//   const getLocation = useCallback(async () => {
//     const hasPermission = await hasLocationPermission();

//     if (!hasPermission) {
//       return;
//     }

//     Geolocation.getCurrentPosition(
//       async position => {
//         setLatitude(position.coords.latitude);
//         setLongitude(position.coords.longitude);

//         const userDoc = firestore().collection('marketers').doc(auth().currentUser.uid);
//         const doc = await userDoc.get();
//         if (doc.exists) {
//           await userDoc.update({
//             createdAt: new Date(),
//             uid: auth().currentUser.uid,
//             displayName: auth().currentUser.displayName,
//             lat: position.coords.latitude,
//             long: position.coords.longitude,
//           });
//         }
//       },
//       error => {
//         Alert.alert(`Code ${error.code}`, error.message);
//         setLatitude(null);
//         setLongitude(null);
//         console.error(error);
//       },
//       {
//         accuracy: {
//           android: 'high',
//           ios: 'best',
//         },
//         enableHighAccuracy: highAccuracy,
//         timeout: 15000,
//         maximumAge: 10000,
//         distanceFilter: 0,
//         forceRequestLocation: forceLocation,
//         forceLocationManager: useLocationManager,
//         showLocationDialog: locationDialog,
//       },
//     );
//   }, [forceLocation, hasLocationPermission, highAccuracy, locationDialog, useLocationManager]);

// const fetchPostsType = useCallback(async newStatus => {
//   try {
//     const query = {
//       limit: 100000,
//       filter: {
//         and: {
//           type: {
//             eq: newStatus,
//           },
//           latitude: {
//             between: [4.633900069140816, 11.17503079077031],
//           },
//           longitude: {
//             between: [-3.26078589558366, 1.199972025476763],
//           },
//         },
//       },
//     };

//     const postsResult = await API.graphql(graphqlOperation(listPosts, query));
//     // console.log('previouslist',previousList.length)
//     // setPosts(shuffle(postsResult.data.listPosts.items));
//     // setPosts(shuffle(posts));
//     if (postsResult?.data?.listPosts?.nextToken !== null) {
//       setNextToken(postsResult.data.listPosts.nextToken);
//     } else {
//     }
//   } catch (error) {
//     // console.log('error1', error);
//   }
// }, []);

//   const userDetails = useCallback(async () => {
//     const selectedUser = await firestore().collection('users').doc(auth().currentUser.uid);

//     selectedUser.get().then(doc => {
//       if (doc.exists) {
//         if (doc.data().phoneNumber === null || doc.data().phoneNumber === '') {
//           if (Platform.OS === 'android') {
//             navigation.navigate('WelcomeScreen');
//           }
//           // Do nothing for iOS
//         } else {
//         }
//       }
//     });
//   }, [navigation]);

//   const _getUserData = useCallback(async ID => {
//     try {
//       const userDB = await API.graphql(
//         graphqlOperation(getUser, {
//           id: ID,
//         }),
//       );
//       if (userDB.data.getUser !== null) {
//       } else {
//         try {
//         } catch (e) {}
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   }, []);

//   const handleVideoPlaybackComplete = useCallback(async () => {
//     await fetch('https://slic66yjz7kusyeujpmojwmaum0kwtgd.lambda-url.us-east-2.on.aws/', {
//       method: 'POST',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({
//         action: 'updateWatchStatus',
//         userId: auth().currentUser.uid,
//         videoVersion, // Send the video version
//       }),
//     });

//     setHasWatchedVideo(true);
//     setmodalVisible(false); // Add this line to close the modal
//   }, [videoVersion]);

//   //    if (postLatest){
//   //     postLatest.sort(function (a, b) {
//   //         return Date.parse(b.createdAt) - Date.parse(a.createdAt);
//   //       });
//   //    }
//   // Add controls for navigating between pages
//   // Increment the page

//   const fetchMoreData = useCallback(async () => {
//     if (nextToken && !fetchingMore) {
//       setFetchingMore(true);
//       const data = await personalizedHomes(latitude, longitude, status, nextToken);
//       const updatedData = [...posts, ...data.homes];
//       setPosts(updatedData);
//       setCachedData(prevData => ({...prevData, [status]: updatedData}));
//       setNextToken(data.nextToken);
//       setFetchingMore(false);
//     }
//   }, [fetchingMore, latitude, longitude, nextToken, personalizedHomes, posts, status]);

//   const personalizedHomes = useCallback(
//     async (userLatitude, userLongitude, homeType, newNextToken) => {
//       try {
//         // setIsLoadingType(true);
//         const response = await fetch(
//           'https://v4b6dicdx2igrg4nd6slpf35ru0tmwhe.lambda-url.us-east-2.on.aws/',
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               userLocation: {
//                 latitude: userLatitude,
//                 longitude: userLongitude,
//               },
//               homeType,
//               nextToken: newNextToken,
//             }),
//           },
//         );

//         const data = await response.json();

//         return data;
//       } catch (error) {
//         console.error(error);
//       } finally {
//         // setIsLoadingType(false); // Set loading state to false
//       }
//     },
//     [],
//   );

//   const onEndReached = useCallback(() => {
//     fetchMoreData();
//   }, [fetchMoreData]);

//   const hellod1 = useCallback(
//     (/* text */) => {
//       // setminValue(parseInt(text, 10));
//     },
//     [],
//   );

//   const hellod2 = useCallback(
//     (/* text */) => {
//       // setmaxValue(parseInt(text, 10));
//     },
//     [],
//   );

//   const handle = useCallback(() => {
//     setSelectedButton('For Rent');
//     filterPosts(status);
//   }, [filterPosts, status]);

//   const handle1 = useCallback(() => {
//     setSelectedButton('For Sale');
//     filterPosts(status);
//   }, [filterPosts, status]);

//   const filter = useCallback(() => {
//     filterPosts(status);
//     setmodalvisible(false);
//   }, [filterPosts, status]);

//   const filterPosts = useCallback(
//     async newStatus => {
//       try {
//         const query = {
//           limit: 100000,
//           filter: {
//             and: {
//               type: {
//                 eq: newStatus,
//               },
//               mode: {
//                 eq: selectedButton,
//               },
//               newPrice: {
//                 le: maximumvalue,
//               },
//               wifi: {
//                 eq: selectedItems.includes('WiFi') ? 'Yes' : 'No',
//               },
//               kitchen: {
//                 eq: selectedItems.includes('Kitchen') ? 'Yes' : 'No',
//               },
//               toilet: {
//                 eq: selectedItems.includes('Toilet') ? 'Yes' : 'No',
//               },
//               water: {
//                 eq: selectedItems.includes('Water') ? 'Yes' : 'No',
//               },
//               aircondition: {
//                 eq: selectedItems.includes('Air Conditioner') ? 'Yes' : 'No',
//               },
//               bathroom: {
//                 eq: selectedItems.includes('Bathroom') ? 'Yes' : 'No',
//               },
//               latitude: {
//                 between: [4.633900069140816, 11.17503079077031],
//               },
//               longitude: {
//                 between: [-3.26078589558366, 1.199972025476763],
//               },
//             },
//           },
//         };

//         if (!selectedItems.includes('WiFi')) {
//           delete query.filter.and.wifi;
//         }
//         if (!selectedItems.includes('Water')) {
//           delete query.filter.and.water;
//         }
//         if (!selectedItems.includes('Kitchen')) {
//           delete query.filter.and.kitchen;
//         }
//         if (!selectedItems.includes('Toilet')) {
//           delete query.filter.and.toilet;
//         }
//         if (!selectedItems.includes('Bathroom')) {
//           delete query.filter.and.bathroom;
//         }
//         if (!selectedItems.includes('Air Conditioner')) {
//           delete query.filter.and.aircondition;
//         }
//         if (selectedButton === '') {
//           delete query.filter.and.mode;
//         }

//         const postsResult = await API.graphql(graphqlOperation(listPosts, query));
//         // console.log('previouslist',previousList.length)

//         setPosts(postsResult.data.listPosts.items);
//         // setPosts(shuffle(posts));
//         if (postsResult?.data?.listPosts?.nextToken !== null) {
//           setNextToken(postsResult.data.listPosts.nextToken);
//         } else {
//         }
//       } catch (error) {}
//     },
//     [maximumvalue, selectedButton, selectedItems],
//   );

// const renderItem = useCallback(
//   ({item}) => (
//     <View key={item}>
//       <Post post={item} />
//     </View>
//   ),
//   [],
// );

//   const close = useCallback(() => {
//     setmodalvisible(false);
//   }, []);

// const open = useCallback(() => {
//   setmodalvisible(true);
// }, []);

//   const onValuesChange = useCallback(
//     value => {
//       setMaximumValue(value[0]);
//       filterPosts(status);
//     },
//     [filterPosts, status],
//   );

//   const getItemLayout = useCallback(
//     (_, index) => ({
//       length: 380,
//       offset: 380 * index,
//       index,
//     }),
//     [],
//   );

//   const keyExtractor = useCallback(item => item.id.toString(), []);

//   const goToHouseType = useCallback(() => navigation.navigate('House Type'), [navigation]);

//   const rentStyle = useMemo(
//     () => ({
//       borderWidth: selectedButton === 'For Rent' ? 2 : 1,
//       backgroundColor: selectedButton === 'For Rent' ? 'lightgray' : 'white',
//     }),
//     [selectedButton],
//   );

//   const saleStyle = useMemo(
//     () => ({
//       borderWidth: selectedButton === 'For Sale' ? 2 : 1,
//       backgroundColor: selectedButton === 'For Sale' ? 'lightgray' : 'white',
//     }),
//     [selectedButton],
//   );

//   const contentContainerStyle = useMemo(
//     () => ({
//       paddingRight: Platform.OS === 'android' ? 20 : 0,
//       backgroundColor: 'white',
//     }),
//     [],
//   );

//   const videoDimensions = useMemo(
//     () => ({
//       width: Dimensions.get('window').width,
//       height: Dimensions.get('window').height * 0.5,
//     }),
//     [],
//   );

//   const mainScrollViewTop = useMemo(() => ({top: Platform.OS === 'ios' ? 120 : 90}), []);

//   const showHomesOpacity = useMemo(() => ({opacity: posts.length === 0 ? 0.6 : 1}), [posts]);

//   useEffect(() => {
//     getLocation();
//   }, [getLocation]);

//   useEffect(() => {
//     if (!hasWatchedVideo) {
//       setmodalVisible(true);
//     }
//   }, [hasWatchedVideo]);

//   useEffect(() => {
//     setIsVideoLoading(true);
//     const fetchUserDataAndVideoUrl = async () => {
//       const response = await fetch(
//         'https://slic66yjz7kusyeujpmojwmaum0kwtgd.lambda-url.us-east-2.on.aws/',
//         {
//           method: 'POST',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             action: 'fetchVideoUrl',
//             userId: auth().currentUser.uid,
//           }),
//         },
//       );

//       const data = await response.json();
//       setHasWatchedVideo(data.hasWatchedVideo);
//       setVideoUrl(data.videoUrl);
//       setVideoVersion(data.videoVersion);
//       setWatchedVideoVersion(data.watchedVideoVersion);

//       setIsVideoLoading(false); // Show the video after 10 seconds
//     };

//     fetchUserDataAndVideoUrl();
//   }, []);

//   const {trackDwellTime} = useDwellTimeTracking();

//   useEffect(trackDwellTime, [trackDwellTime]);

//   // Init BackgroundGeolocation when view renders.
//   // Return a function to .removeListeners() When view is removed.
//   useEffect(() => {
//     BackgroundGeolocation.start();
//     initBackgroundFetch();
//     setTimeout(() => {
//       initBackgroundGeolocation();
//     }, 5000);
//     registerTransistorAuthorizationListener(navigation);
//     return () => {
//       unsubscribe();
//     };
//   }, [initBackgroundFetch, initBackgroundGeolocation, navigation, unsubscribe]);

// useEffect(() => {
//   const fetchInitialData = async () => {
//     setIsLoadingType(true);
//     if (!cachedData[status]) {
//       const data = await personalizedHomes(latitude, longitude, status, null);
//       if (data && data.homes) {
//         setPosts(data.homes);
//         setCachedData(prevData => ({...prevData, [status]: data.homes}));
//         setNextToken(data.nextToken);
//       } else {
//         setPosts([]);
//       }
//     } else {
//       setPosts(cachedData[status]);
//     }
//     setIsLoadingType(false);
//   };

//   // Reset posts and nextToken when status changes
//   if (status !== prevStatus.current) {
//     setPosts([]);
//     setNextToken(null);
//     prevStatus.current = status;
//   }

//   fetchInitialData();

//   // setIsLoadingType(true);
//   // console.log('latitude', latitude);
//   // console.log('longitude', longitude);
//   // personalizedHomes(latitude, longitude, status);
//   // setIsLoadingType(false);

//   _getUserData(auth().currentUser.uid);

//   userDetails();
//   // setStatus(status);
//   // setPosts([]);
//   // setNextToken(null);
//   // console.log('status', status);
//   // console.log('nextToken', nextToken);
//   // setInterval(selectColor, 2000);
//   // VersionCheck.needUpdate().then(async res => {
//   //   //console.log(res.isNeeded);    // true
//   //   if (res.isNeeded) {
//   //     setUpdateNeeded(true);
//   //     setUpdateUrl(res.storeUrl);
//   //     //console.log(res.storeUrl === updateUrl);
//   //     //Linking.openURL(res.storeUrl);  // open store if update is needed.
//   //   }
//   // });

//   // setIsLoadingType(true);
//   // fetchPostsType(status);
//   // setIsLoadingType(false);
//   // console.log('posts', posts);
//   // getLatestPost();

//   // console.log('This is latest',postLatest.map(item => (item.createdAt)));
//   // clearInterval(selectColor);
// }, [status, latitude, longitude, userDetails, cachedData, personalizedHomes, _getUserData]);

//   return (
//     <View style={styles.container}>
//       <Modal
//         style={styles.modal}
//         animationType="slide"
//         transparent={false}
//         visible={modalvisible}
//         onRequestClose={close}>
//         <View style={styles.modalContainer}>
//           <ScrollView contentContainerStyle={styles.modalScrollView}>
//             <View style={styles.marginTop10}>
//               <Pressable onPress={close} style={styles.margin10}>
//                 <FontAwesomeIcon icon={faArrowLeft} size={20} />
//               </Pressable>
//               <View style={styles.priceRangeContainer}>
//                 <Text style={styles.priceText}>Price range</Text>
//                 <MultiSlider
//                   min={minimumvalue}
//                   max={maximumvalue}
//                   step={100}
//                   sliderLength={310}
//                   onValuesChange={onValuesChange}
//                 />
//               </View>

//               <View style={styles.valueContainer}>
//                 <View style={styles.valueInnerContainer}>
//                   <TextInput
//                     keyboardType="numeric"
//                     onChangeText={hellod1}
//                     placeholder={minimumvalue.toLocaleString()}
//                   />
//                 </View>
//                 <View style={styles.textWrapper}>
//                   <TextInput
//                     keyboardType="numeric"
//                     onChangeText={hellod2}
//                     placeholder={maximumvalue.toLocaleString()}
//                   />
//                 </View>
//               </View>
//             </View>

//             <View style={styles.statusOfHome}>
//               <Text style={styles.statusOfHomeText}>Status of Home</Text>

//               <Pressable style={[styles.rentPressable, rentStyle]} onPress={handle}>
//                 <View style={styles.rentContainer}>
//                   <Text style={styles.forRent}>For Rent</Text>
//                   <Text style={styles.forRentDesc}>
//                     You are looking for homes that are available for rent only
//                   </Text>
//                 </View>
//               </Pressable>

//               <Pressable style={[styles.salePressable, saleStyle]} onPress={handle1}>
//                 <View style={styles.forSale}>
//                   <Text style={styles.forSaleText}>For Sale</Text>
//                   <Text style={styles.forSaleDesc}>
//                     You are looking for homes that are available for sale only
//                   </Text>
//                 </View>
//               </Pressable>
//             </View>
//             <View style={styles.amenitiesContainer}>
//               <Text style={styles.amenitiesText}>Amenities</Text>

//               <SectionedMultiSelect
//                 styles={{
//                   container: {
//                     margin: 20,
//                   },

//                   selectToggleText: {
//                     fontSize: 15,
//                   },

//                   selectToggle: {
//                     backgroundColor: 'white',
//                     borderWidth: 1,
//                     borderRadius: 20,
//                     margin: 10,
//                     padding: 10,
//                   },
//                   chipContainer: {
//                     backgroundColor: 'white',
//                     marginBottom: 10,
//                   },

//                   chipText: {
//                     color: 'black',
//                     fontSize: 16,
//                     maxWidth: Dimensions.get('screen').width - 90,
//                   },

//                   itemText: {
//                     color: selectedItems.length ? 'black' : 'darkgrey',
//                     fontSize: 18,
//                   },

//                   selectedItemText: {
//                     color: 'blue',
//                   },

//                   item: {
//                     paddingHorizontal: 10,
//                     margin: 10,
//                   },

//                   selectedItem: {
//                     backgroundColor: 'rgba(0,0,0,0.1)',
//                   },

//                   scrollView: {paddingHorizontal: 0},
//                 }}
//                 items={items}
//                 showChips
//                 uniqueKey="id"
//                 IconRenderer={Icon}
//                 selectText="Choose amenities you want"
//                 showDropDowns
//                 modalAnimationType="fade"
//                 readOnlyHeadings={false}
//                 onSelectedItemsChange={onSelectedItemsChange}
//                 selectedItems={selectedItems}
//                 colors={{chipColor: 'black'}}
//                 iconKey="icon"
//               />
//             </View>
//           </ScrollView>

//           <TouchableOpacity
//             disabled={posts.length === 0}
//             onPress={filter}
//             style={[styles.showHomes, showHomesOpacity]}>
//             <Text style={styles.showHomesText}>Show {posts.length} homes</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>

//       <View>
//         {/* {updateNeeded ? <TouchableOpacity onPress={updateApp}  style={{backgroundColor:'black',alignItems:'center',}}>
//                 <Text style={{alignItems:'center', fontWeight:'bold',fontSize:15, textDecorationLine:'underline',textDecorationStyle:'solid',paddingBottom:10, marginTop: Platform.OS === 'android' ? 10 : 50, color:'white'}}>Get the latest app update</Text>
//             </TouchableOpacity>: null} */}
//         <Pressable style={styles.searchButton} onPress={goToHouseType}>
//           <Fontisto name="search" size={20} color="deeppink" />
//           <Text adjustsFontSizeToFit style={styles.searchButtonText}>
//             Where do you want to rent?
//           </Text>
//         </Pressable>
//       </View>
//       <ScrollView
//         horizontal
//         scrollEventThrottle={1}
//         showsHorizontalScrollIndicator={false}
//         showsVerticalScrollIndicator={false}
//         // snapToInterval={100}
//         snapToAlignment="center"
//         decelerationRate="fast"
//         height={50}
//         style={[styles.mainScrollView, mainScrollViewTop]}
//         contentInset={{
//           // ios only
//           top: 0,
//           left: 0,
//           bottom: 0,
//           right: 20,
//         }}
//         contentContainerStyle={contentContainerStyle}>
//         <TouchableOpacity onPress={open} style={styles.filterPressable}>
//           <FontAwesomeIcon icon={faFilter} />
//           <Text style={styles.filterText}>Filter</Text>
//         </TouchableOpacity>
//         {categories.map(category => (
//           <TouchableOpacity
//             key={category.id}
//             onPress={setStatusFilter(category.status)}
//             style={[styles.button1, status === category.status && styles.btnTabActive]}>
//             <FontAwesomeIcon
//               icon={category.icon}
//               style={[
//                 styles.padding14,
//                 styles.textTab,
//                 status === category.status && styles.textTabActive,
//               ]}
//             />
//             <Text
//               style={[
//                 styles.padding2,
//                 styles.textTab,
//                 status === category.status && styles.textTabActive,
//               ]}>
//               {category.status}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//       <View style={styles.loadingIndicator}>
//         {loadingType === true ? (
//           <View style={styles.loaderList}>
//             <ActivityIndicator size="large" color="deeppink" />
//           </View>
//         ) : (
//           <FlatList
//             removeClippedSubviews
//             data={posts}
//             maxToRenderPerBatch={1}
//             initialNumToRender={1}
//             contentContainerStyle={styles.padding40}
//             keyExtractor={keyExtractor}
//             getItemLayout={getItemLayout}
//             // ListEmptyComponent={renderNoHome()}
//             extraData={posts}
//             renderItem={renderItem}
//             onEndReachedThreshold={0.5}
//             onEndReached={onEndReached}
//             ListFooterComponent={fetchingMore ? renderLoader : null}
//             windowSize={3}
//             updateCellsBatchingPeriod={100}
//           />
//         )}
//       </View>
//       {videoUrl && (hasWatchedVideo === false || watchedVideoVersion !== videoVersion) ? (
//         <Modal
//           animationType="slide"
//           transparent
//           visible={modalVisible}
//           // onRequestClose={closeModal}
//         >
//           <View style={styles.videoContainer}>
//             <View style={[styles.videoInnerContainer, videoDimensions]}>
//               {videoLoading ? (
//                 <View style={styles.videoLoading}>
//                   <ActivityIndicator size="large" color="white" />
//                 </View>
//               ) : (
//                 <Video
//                   ref={videoRef}
//                   source={{uri: videoUrl}}
//                   resizeMode="cover"
//                   style={styles.video}
//                   onEnd={handleVideoPlaybackComplete}
//                 />
//               )}
//             </View>
//           </View>
//         </Modal>
//       ) : null}
//     </View>
//   );
// };

// export default HomeScreen;
