/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState, useEffect, useMemo} from 'react';
import {ViewStyle, View, FlatList, Alert, Linking} from 'react-native';
import {Page} from '@components';
import {Icon} from '@components/Icon';
import {Card} from '@components/Card';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Geolocation from 'react-native-geolocation-service';
import {colors, palette} from '@theme';

import {pageInnerHorizontalPadding} from '@assets/styles/global';
import Post from '@components/Post';
import {ExtendedEdge} from '@utils/useSafeAreaInsetsStyle';
import moment from 'moment';
import {useRoute} from '@react-navigation/native';
import styles from './styles';

export const SearchResultsScreen = _props => {
  const {navigation} = _props;
  const route: any = useRoute();
  const {guests, location, dates} = route.params;
  const [posts] = useState([]);
  const [latitude, setLatitude] = useState<any>(null);
  const [longitude, setLongitude] = useState<any>(null);

  const totalGuests = useMemo(() => {
    return Object.keys(guests)
      .map(el => guests[el])
      .reduce((partialSum, a) => partialSum + a, 0);
  }, [guests]);

  const personalizedHomes = useCallback(async () => {
    const viewPort = Object.keys(location?.viewPort)
      .map(loc => {
        const theLoc = location?.viewPort[loc];
        return {[loc]: {lat: theLoc.lat, lon: theLoc.lng}};
      })
      .reduce((a, b) => Object.assign(a, b), {});

    try {
      const response = await fetch(
        'https://o0ds966jy0.execute-api.us-east-2.amazonaws.com/prod/search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            region: viewPort,
            userLocation: {latitude, longitude},
            searchQuery: 'nice apartment',
            searchAfter: null,
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
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      await personalizedHomes();
    };

    fetchInitialData();
    // _getUserData(auth().currentUser.uid);
    // userDetails();
  }, [latitude, longitude]);

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

  const renderItem = useCallback(
    ({item}) => (
      <View key={item}>
        <Post post={item} />
      </View>
    ),
    [],
  );

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
          heading={location?.address}
          footer={`${moment(dates?.startDate).format('DD MMM')} - ${moment(dates?.endDate).format(
            'DD MMM',
          )}  ⦁  ${totalGuests} guests`}
          FooterTextProps={memoizedFooterProps}
          LeftComponent={<Icon icon="searchMini" size={25} />}
          RightComponent={<Icon icon="filterMini" size={35} />}
          onPress={handleSearch}
        />
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
  backgroundColor: colors.palette.textInverse,
};
