/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-perf/jsx-no-new-object-as-prop */
import React, {FC, useCallback, useState, useEffect, useRef, useMemo} from 'react';
import {
  ViewStyle,
  View,
  FlatList,
  Linking,
  Alert,
  Pressable,
  Image,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Page, Text} from '@components';
import {AppStackScreenProps} from '@navigation/AppStack';
import {Icon} from '@components/Icon';
import {SizedBox} from '@components/SizedBox';
import {Card} from '@components/Card';
import {colors, palette} from '@theme';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import CustomMarker from '@components/CustomMarker';
import {SearchModal as VideoModal, SearchModal} from '@components/Modals';
import {mapStyle} from '@theme/global';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import SkeletonContent from 'react-native-skeleton-content-nonexpo';

import Geolocation from 'react-native-geolocation-service';

import {CategoryNavigator} from '@components/Explore';
import {pageInnerHorizontalPadding} from '@assets/styles/global';
import Post from '@components/Post';
import {ExtendedEdge} from '@utils/useSafeAreaInsetsStyle';
import {mapIcon} from '@assets/images';
import styles from './styles';

interface HomeScreenProps extends AppStackScreenProps<'Home'> {}
const HomeScreen: FC<HomeScreenProps> = _props => {
  const {navigation} = _props;
  const [status, setStatus] = useState('Entire Flat');
  const [latitude, setLatitude] = useState<any>(null);
  const [longitude, setLongitude] = useState<any>(null);
  const [posts, setPosts] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [loadingType, setIsLoadingType] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const prevStatus = useRef(null);
  const mapRef = useRef();
  const initialFetchDone = useRef(false);
  const searchAfter = useRef<string | null>(null);
  const [selectedHome, setSelectedHome] = useState(null);
  const [visibleHomes, setVisibleHomes] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoVersion, setVideoVersion] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    clientNumber: '',
    type: '',
    homeType: '',
    neighborhood: '',
    description: '',
    locality: '',
    sublocality: '',
  });
  const [showForm, setShowForm] = useState(true);

  const handleInputChange = useCallback((value, name) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const fetchVideoWatchStatus = useCallback(async () => {
    const userId = auth()?.currentUser.uid;

    try {
      const response = await fetch(
        'https://slic66yjz7kusyeujpmojwmaum0kwtgd.lambda-url.us-east-2.on.aws/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'fetchVideoUrl',
            userId,
          }),
        },
      );

      const data = await response.json();

      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setVideoVersion(data.videoVersion);
        setShowVideo(true);
      }
    } catch (error) {
      console.error('Error fetching video watch status:', error);
    }
  }, []);

  const updateWatchVideoStatus = useCallback(async version => {
    const userId = auth()?.currentUser.uid;

    try {
      const response = await fetch(
        'https://slic66yjz7kusyeujpmojwmaum0kwtgd.lambda-url.us-east-2.on.aws/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'updateWatchStatus',
            userId,
            videoVersion: version,
          }),
        },
      );

      const data = await response.json();

      if (response.status === 200) {
        handleModalClose();
      } else {
        console.error('Error updating watch status:', data.message);
      }
    } catch (error) {
      console.error('Error updating watch status:', error);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    const response = await fetch(
      'https://o0ds966jy0.execute-api.us-east-2.amazonaws.com/prod/hometype',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userLocation: {
            latitude,
            longitude,
          },
          typeParameter: status,
          searchAfter: searchAfter.current,
        }),
      },
    );

    const data = await response.json();
    return data;
  }, [latitude, longitude, status]);

  const setStatusFilter = useCallback(
    _status => () => {
      setStatus(_status);
      setPosts([]);
      searchAfter.current = null;
    },
    [],
  );

  const open = useCallback(() => {
    // setmodalvisible(true);
    navigation.navigate('Filter');
  }, []);
  const handleVideoPlaybackComplete = useCallback(() => {
    updateWatchVideoStatus(videoVersion);
  }, [videoVersion]);

  const onRegionChangeComplete = useCallback(
    region => {
      const {latitude, longitude, latitudeDelta, longitudeDelta} = region;

      // calculate the corners of the map
      const northLat = latitude + latitudeDelta / 2;
      const southLat = latitude - latitudeDelta / 2;
      const westLon = longitude - longitudeDelta / 2;
      const eastLon = longitude + longitudeDelta / 2;

      // filter the posts to include only those within the map bounds
      const visibleHomes = posts.filter(post => {
        const {
          location: {lat, lon},
        } = post;
        return lat <= northLat && lat >= southLat && lon <= eastLon && lon >= westLon;
      });

      setVisibleHomes(visibleHomes);
    },
    [posts],
  );

  useEffect(() => {
    fetchVideoWatchStatus();
  }, [fetchVideoWatchStatus]);

  useEffect(() => {
    if (latitude && longitude) {
      if (!initialFetchDone.current) {
        setIsLoadingType(true);
        const fetchInitialData = async () => {
          const data = await fetchPosts();
          if (data && data.homes) {
            setPosts(data.homes);
            searchAfter.current = data.searchAfter;
          }
          setIsLoadingType(false);
        };

        fetchInitialData(); // Call the function
        initialFetchDone.current = true;
      } else if (prevStatus.current !== status) {
        setPosts([]);
        searchAfter.current = null;
        setIsLoadingType(true);
        const fetchInitialData = async () => {
          const data = await fetchPosts();
          if (data && data.homes) {
            setPosts(data.homes);
            searchAfter.current = data.searchAfter;
          }
          setIsLoadingType(false);
        };
        fetchInitialData(); // Call the function
      }
      prevStatus.current = status;
    }
  }, [fetchPosts, latitude, longitude, status]);

  const renderItem = useCallback(
    ({item}) => (
      <View key={item}>
        <Post post={item} />
      </View>
    ),
    [],
  );
  const renderLoader = useMemo(
    () => (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ),
    [],
  );

  const fetchMoreData = async () => {
    setLoadingMore(true); // Start loading
    const data = await fetchPosts();
    if (data && data.homes) {
      setPosts(prevPosts => [...prevPosts, ...data.homes]); // Append the new homes to the existing homes
      searchAfter.current = data.searchAfter; // Update the searchAfter value for the next fetch
    }
    setLoadingMore(false);
  };

  const hasPermissionIOS = useCallback(async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const newStatus = await Geolocation.requestAuthorization('whenInUse');

    if (newStatus === 'granted') {
      return true;
    }

    if (newStatus === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (newStatus === 'disabled') {
      Alert.alert('Turn on Location Services to allow "RentIt" to determine your location.', '', [
        {text: 'Go to Settings', onPress: openSetting},
        {text: "Don't Use Location", onPress: () => {}},
      ]);
    }

    return false;
  }, []);
  const getLocation = useCallback(async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        // @ts-ignore
        const userDoc = firestore().collection('marketers').doc(auth().currentUser.uid);

        const doc = await userDoc.get();

        if (doc.exists) {
          await userDoc.update({
            createdAt: new Date(),
            // @ts-ignore
            uid: auth().currentUser.uid,
            // @ts-ignore
            displayName: auth().currentUser.displayName,
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        }
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        setLatitude(null);
        setLongitude(null);
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
  }, []);

  const hasLocationPermissionAndroid = async () => {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const requestStatus = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (requestStatus === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (requestStatus === PermissionsAndroid.RESULTS.DENIED) {
      Alert.alert('Location permission denied');
    } else if (requestStatus === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert('Location permission revoked');
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    } else {
      const hasPermission = await hasLocationPermissionAndroid();
      return hasPermission;
    }
  };

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const handleSearch = useCallback(() => {
    navigation.navigate('SearchHome');
  }, [navigation]);

  const keyExtractor = useCallback(item => item.id.toString(), []);

  const memoizedSafeAreaEdges: ExtendedEdge[] = useMemo(() => {
    return ['top'];
  }, []);

  const memoizedHeaderProps: any = useMemo(() => {
    return {size: 'xs'};
  }, []);

  const memoizedFooterProps: any = useMemo(() => {
    return {style: {color: palette.textInverse300}, size: 'xxs'};
  }, []);

  const memoizedCategoryNav = useCallback(() => {
    return <CategoryNavigator {...{status, open, setStatusFilter}} />;
  }, [open, setStatusFilter, status]);

  const handleMap = useCallback(
    val => () => {
      setShowMap(val);
    },
    [],
  );

  const initialRegion = useMemo(() => {
    return {
      latitude: 5.602028159656166,
      longitude: -0.183158678544458,
      latitudeDelta: 0.8,
      longitudeDelta: 0.8,
    };
  }, []);

  const coords = useCallback(place => {
    return {latitude: place.location.lat, longitude: place.location.lon};
  }, []);

  const handleSelect = useCallback(
    place => () => {
      setSelectedHome(place);
      // navigation.navigate('Post', {post: place});
    },
    [navigation],
  );
  const handleSubmit = useCallback(() => {
    // Copy formData
    const formattedFormData = {...formData};

    // Remove the undefined key
    delete formattedFormData.undefined;
    Object.keys(formattedFormData).forEach(key => {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      formattedFormData[capitalizedKey] = formattedFormData[key];
      delete formattedFormData[key];
    });

    formattedFormData.MarketerID = auth()?.currentUser.uid;

    // Validate formattedFormData
    if (
      !formattedFormData.Name ||
      !formattedFormData.Price ||
      !formattedFormData.ClientNumber ||
      !formattedFormData.HomeType ||
      !formattedFormData.Neighborhood ||
      !formattedFormData.Locality ||
      !formattedFormData.Sublocality ||
      !formattedFormData.Type
    ) {
      alert('Please fill out all required fields.');
      return;
    }

    fetch('https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/demands', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedFormData),
    })
      .then(response => response.json())
      .then(data => {
        handleFormClose();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [formData]);

  const goToPostPage = useCallback(() => {
    navigation.navigate('Post', {postId: selectedHome?.id});
  }, [navigation, selectedHome?.id]);

  const handleModalClose = useCallback(() => {
    setShowVideo(false);
  }, []);
  const handleFormClose = useCallback(() => {
    setShowForm(false);
  }, []);
  const layout: any = useMemo(
    () => [
      // long line
      {
        width: '100%',
        height: wp(87.7),
        marginBottom: 10,
        borderRadius: 10,
      },
      {width: '70%', height: wp(5.6), marginBottom: 10},
      // short line
      {width: 90, height: wp(5.6), marginBottom: 10},
      {width: 40, height: wp(5.6), marginBottom: 80},

      // ...
    ],
    [],
  );
  return (
    <Page
      safeAreaEdges={memoizedSafeAreaEdges}
      type=""
      backgroundColor={palette.textInverse}
      hasPadding={false}
      inline>
      <View style={$headerStyle}>
        <Card
          style={$cardStyle}
          HeadingTextProps={memoizedHeaderProps}
          heading="Where to?"
          footer="Anywhere ⦁ Any week ⦁ Add guests"
          FooterTextProps={memoizedFooterProps}
          LeftComponent={<Icon icon="searchMini" size={25} />}
          RightComponent={<Icon icon="filterMini" size={35} />}
          onPress={handleSearch}
        />
        <SizedBox height={20} />
        {memoizedCategoryNav()}
      </View>
      {loadingType ? (
        <SkeletonContent
          isLoading={true}
          containerStyle={styles.loaderContainer}
          animationDirection="horizontalLeft"
          layout={layout}
        />
      ) : (
        <>
          {showMap && (
            // @ts-ignore
            <MapView.Animated
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              customMapStyle={mapStyle}
              zoomEnabled
              minZoomLevel={10}
              maxZoomLevel={500}
              onRegionChangeComplete={onRegionChangeComplete}
              initialRegion={initialRegion}>
              {visibleHomes.map((place: any) => (
                <CustomMarker
                  key={place.id}
                  isSelected={place.id === selectedHome?.id}
                  onPress={handleSelect(place)}
                  coordinate={coords(place)}
                  price={place.newPrice}
                />
              ))}
              {/* @ts-ignore */}
            </MapView.Animated>
          )}

          {selectedHome && (
            <TouchableOpacity style={styles.cardContainer} onPress={goToPostPage}>
              <Image source={{uri: selectedHome.image}} style={styles.cardImage} />
              <View style={styles.cardDetails}>
                <Text style={styles.locality}>
                  {selectedHome.locality}, {selectedHome.sublocality}
                </Text>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailsText}>{selectedHome.bedroom} bedroom</Text>
                </View>
                <Text style={styles.price}>{selectedHome.type}</Text>
              </View>
            </TouchableOpacity>
          )}

          <FlatList
            data={posts}
            initialNumToRender={10}
            contentContainerStyle={styles.padding40}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onEndReachedThreshold={0.5}
            onEndReached={fetchMoreData}
            ListFooterComponent={loadingMore ? renderLoader : null}
          />
        </>
      )}

      {!showMap && (
        <Pressable style={styles.mapContent} onPress={handleMap(true)}>
          <Text text="Map" weight="bold" color={colors.palette.textInverse} />

          <Image source={mapIcon} />
        </Pressable>
      )}
      {showVideo && (
        <VideoModal
          show={showVideo}
          type="video"
          onClose={handleModalClose}
          videoUrl={videoUrl}
          handleVideoPlaybackComplete={handleVideoPlaybackComplete}
        />
      )}
      <SearchModal
        show={showForm}
        onClose={handleFormClose}
        onChange={handleInputChange}
        type="form"
        handleSubmit={handleSubmit}
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
