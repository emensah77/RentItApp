/* eslint-disable react-hooks/exhaustive-deps */
import React, {FC, useCallback, useState, useEffect, useRef, useMemo} from 'react';
import {ViewStyle, View, FlatList, Linking, Alert} from 'react-native';
import {API, graphqlOperation} from 'aws-amplify';
import {Page} from '@components';
import {AppStackScreenProps} from '@navigation/AppStack';
import {Icon} from '@components/Icon';
import {SizedBox} from '@components/SizedBox';
import {Card} from '@components/Card';
import {colors, palette} from '@theme';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Geolocation from 'react-native-geolocation-service';

import {CategoryNavigator} from '@components/Explore';
import {pageInnerHorizontalPadding} from '@assets/styles/global';
import Post from '@components/Post';
import {ExtendedEdge} from '@utils/useSafeAreaInsetsStyle';
import {listPosts} from '../../graphql/queries';
import styles from './styles';

interface HomeScreenProps extends AppStackScreenProps<'Home'> {}
const HomeScreen: FC<HomeScreenProps> = _props => {
  const {navigation} = _props;
  const [status, setStatus] = useState('Entire Flat');
  const [modalvisible, setmodalvisible] = useState(false);
  const [latitude, setLatitude] = useState<any>(null);
  const [longitude, setLongitude] = useState<any>(null);
  const [loadingType, setIsLoadingType] = useState(false);
  const [posts, setPosts] = useState([]);
  const [cachedData, setCachedData] = useState({});
  const prevStatus = useRef(null);

  const memoizedCategoryNav = useCallback(() => {
    return <CategoryNavigator {...{status, open, setStatusFilter}} />;
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
        // setNextToken(postsResult.data.listPosts.nextToken);
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

        // const response = await fetch(
        //   'https://o0ds966jy0.execute-api.us-east-2.amazonaws.com/prod/hometype',
        //   {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       userLocation: {
        //         latitude: userLatitude,
        //         longitude: userLongitude,
        //       },
        //       typeParameter: homeType,
        //       searchAfter: newNextToken,
        //     }),
        //   },
        // );

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
          // setNextToken(data.nextToken);
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
      // setNextToken(null);
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

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = useCallback(async () => {
    const hasPermission = await hasPermissionIOS();

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

  const handleSearch = useCallback(() => {
    navigation.navigate('SearchHome');
  }, []);

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
