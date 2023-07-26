import React, {useCallback, useState, useEffect, useMemo, useRef} from 'react';
import {ViewStyle, View, FlatList, ActivityIndicator, Text, Alert, Linking} from 'react-native';
import {Page} from '@components';
import {Icon} from '@components/Icon';
import {Card} from '@components/Card';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';

import Geolocation from 'react-native-geolocation-service';
import {colors, palette} from '@theme';

import {pageInnerHorizontalPadding} from '@assets/styles/global';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Post from '@components/Post';
import {ExtendedEdge} from '@utils/useSafeAreaInsetsStyle';
import CustomMarker from '@components/CustomMarker';
import moment from 'moment';
import {useRoute} from '@react-navigation/native';
import {mapStyle} from '@theme/global';
import styles from './styles';

export const SearchResultsScreen = _props => {
  const {navigation} = _props;
  const route: any = useRoute();
  const {guests, location, dates} = route.params;
  const [posts, setPosts] = useState([]);
  const [latitude, setLatitude] = useState<any>(null);
  const [longitude, setLongitude] = useState<any>(null);
  const [selectedPlacedId, setSelectedPlacedId] = useState(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['10%', '50%', '100%'], []);
  const [homesCount, setHomesCount] = useState<number>(0);
  const [searchAfter, setSearchAfter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleHomes, setVisibleHomes] = useState([]);

  const mapRef = useRef();

  const totalGuests = useMemo(() => {
    return Object.keys(guests)
      .map(el => guests[el])
      .reduce((partialSum, a) => partialSum + a, 0);
  }, [guests]);

  const fetchUserLocation = useCallback(async () => {
    Geolocation.getCurrentPosition(
      position => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      error => {
        console.log(error);
        setLatitude(null);
        setLongitude(null);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }, []);

  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);

  const personalizedHomes = useCallback(
    async (searchAfter: string | null) => {
      const viewPort = {
        northeast: {
          lat: location?.viewPort?.northeast?.lat || null,
          lon: location?.viewPort?.northeast?.lng || null,
        },
        southwest: {
          lat: location?.viewPort?.southwest?.lat || null,
          lon: location?.viewPort?.southwest?.lng || null,
        },
      };

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
              searchAfter,
            }),
          },
        );

        const data = await response.json();

        return data;
      } catch (error) {
        console.error(error);
      }
    },
    [latitude, longitude, location?.viewPort],
  );

  const fetchMoreData = async () => {
    setLoadingMore(true); // Start loading
    const data = await personalizedHomes(searchAfter);
    if (data && data.homes) {
      setPosts(prevPosts => [...prevPosts, ...data.homes]); // Append the new homes to the existing homes
      setSearchAfter(data.searchAfter); // Update the searchAfter value for the next fetch
    }
    setLoadingMore(false);
  };

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
    setLoading(true);
    const fetchInitialData = async () => {
      const data = await personalizedHomes(searchAfter);

      if (data && data.homes) {
        setPosts(data.homes);
        setHomesCount(data.count);
        setSearchAfter(data.searchAfter); // Add this line

        // Find min and max latitudes and longitudes
        const minLat = Math.min(...data.homes.map(home => home.location.lat));
        const maxLat = Math.max(...data.homes.map(home => home.location.lat));
        const minLon = Math.min(...data.homes.map(home => home.location.lon));
        const maxLon = Math.max(...data.homes.map(home => home.location.lon));

        // Calculate center lat and lon
        const centerLat = (minLat + maxLat) / 2;
        const centerLon = (minLon + maxLon) / 2;

        // Calculate delta values
        const latitudeDelta = Math.abs(maxLat - minLat) * 1.5; // Multiplying by 1.5 to leave some padding around edges
        const longitudeDelta = Math.abs(maxLon - minLon) * 1.5;

        // animate map to new region
        mapRef.current?.animateToRegion({
          latitude: centerLat,
          longitude: centerLon,
          latitudeDelta,
          longitudeDelta,
        });
      } else {
        setPosts([]);
      }
      setLoading(false);
    };

    longitude && latitude && fetchInitialData();
  }, [latitude, longitude, personalizedHomes]);

  const renderLoader = useMemo(
    () => (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ),
    [],
  );
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
    placeId => () => {
      setSelectedPlacedId(placeId);
    },
    [],
  );
  if (loading) {
    return renderLoader;
  }
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
      {/* @ts-ignore */}
      <MapView.Animated
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        zoomEnabled
        minZoomLevel={12}
        onRegionChangeComplete={onRegionChangeComplete}
        initialRegion={initialRegion}>
        {visibleHomes.map((place: any) => (
          <CustomMarker
            key={place?.id}
            isSelected={place?.id === selectedPlacedId}
            onPress={handleSelect(place?.id)}
            coordinate={coords(place)}
            price={place.newPrice}
          />
        ))}
        {/* @ts-ignore */}
      </MapView.Animated>
      <BottomSheet
        ref={bottomSheetRef}
        index={1} // To make it initially snap to 50% of screen height
        snapPoints={snapPoints}>
        <View style={styles.homesCountContainer}>
          <Text style={styles.homesCountText}>Over {homesCount} homes</Text>
        </View>

        <BottomSheetFlatList
          data={posts}
          initialNumToRender={10}
          contentContainerStyle={(styles.padding40, styles.flexGrow40)}
          keyExtractor={keyExtractor}
          extraData={posts}
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
          onEndReached={fetchMoreData}
          ListFooterComponent={loadingMore ? renderLoader : null}
        />
      </BottomSheet>
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
