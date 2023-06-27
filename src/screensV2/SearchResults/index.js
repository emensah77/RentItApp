import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  Pressable,
  Platform,
  TouchableOpacity,
  Text,
  ScrollView,
  Animated,
  FlatList,
} from 'react-native';
import {API, graphqlOperation} from 'aws-amplify';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch} from 'react-redux';

import Fontisto from 'react-native-vector-icons/Fontisto';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {listPosts} from '../../graphql/queries';
import styles from '../../screens/Home/styles';
import Typography from '../../componentsV2/DataDisplay/Typography';
import CircleButton from '../../componentsV2/Inputs/CircleButton';
import FilterMinIcon from '../../../assets/data/images/icons/filter-min.svg';
import {extractDate} from '../../utils/formatter';

import {mapStyle} from '../../configs/map';
import CustomMarker from '../../components/CustomMarker';
import {setPost} from '../../redux/post.slice';
import HomeItem from '../../componentsV2/DataDisplay/HomeItem';
import {offsets} from '../../styles/globalStyles';

const SearchResults = ({guests, dates, location}) => {
  console.log('params', guests, dates, location);

  const dispatch = useDispatch();
  const mapRef = useRef();
  const navigation = useNavigation();

  const [posts, setPosts] = useState(null);
  const [nextToken, setNextToken] = useState(null);
  const [status, setStatus] = useState('All');
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);

  const [showMap, setShowMap] = useState(false);

  const fromObj = dates.startDate ? extractDate(new Date(dates.startDate)) : null;
  const toObj = dates.endDate ? extractDate(new Date(dates.endDate)) : null;

  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlacedId, setSelectedPlacedId] = useState(null);

  const snapPoints = useMemo(() => ['50%', '100%'], []);
  const bottomSheetRef = useRef(null);
  const handleSheetChanges = useCallback(index => {
    setShowMap(!index);
  }, []);

  const keyExtractor = useCallback(item => item.id.toString(), []);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: 380,
      offset: 380 * index,
      index,
    }),
    [],
  );

  const guestCount = useMemo(() => {
    let total = 0;

    for (const type in guests) {
      total += Number(guests[type]);
    }

    return total;
  }, [guests]);

  const fetchBatch = async (query, results = []) => {
    const postsResult = await API.graphql(graphqlOperation(listPosts, query));

    results.push(...postsResult.data.listPosts.items);

    if (postsResult.data.listPosts.nextToken) {
      if (results.length < 20) {
        query.nextToken = postsResult.data.listPosts.nextToken;
        return fetchBatch(query, results);
      }
    }

    return {results, nextToken: postsResult.data.listPosts.nextToken};
  };

  const fetchPosts = async isReset => {
    try {
      const query = {
        limit: 50,
        filter: {
          and: {
            maxGuests: {
              ge: guestCount,
            },
            type: {
              eq: status,
            },
            latitude: {
              between: [location.viewPort.southwest.lat, location.viewPort.northeast.lat],
            },
            longitude: {
              between: [location.viewPort.southwest.lng, location.viewPort.northeast.lng],
            },
          },
        },
        nextToken,
      };

      if (status === 'All') {
        delete query.filter.and.type;
      }

      let previousList = posts ? [...posts] : [];

      if (isReset) {
        delete query.nextToken;
        previousList = [];
      }

      setIsLoading(true);
      const {results, nextToken} = await fetchBatch(query);

      // Compare currentDataIndex to the fetched results length
      if (currentDataIndex < results.length - 1) {
        setPosts([...previousList, ...results]);
        setNextToken(nextToken);
        setCurrentDataIndex(currentDataIndex + 1); // Increment the index
      } else {
        setReachedEnd(true);
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const goToHouseType = useCallback(() => navigation.navigate('House Type'), [navigation]);

  const renderItem = useCallback(
    ({item, index}) => (
      <View
        key={item.id}
        style={{width: '92%', marginLeft: '4%', marginTop: index !== 0 ? wp(10.25) : wp(3)}}
      >
        <HomeItem item={item} />
      </View>
    ),
    [],
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  if (posts?.length) {
    console.log('posts', posts[0]);
  }

  return (
    <SafeAreaView>
      <Pressable style={styles.searchButton} onPress={goToHouseType}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Fontisto name="search" size={20} />
          <View style={styles.searchInfoWrapper}>
            <Typography adjustsFontSizeToFit style={styles.searchButtonText}>
              {`${location.locality} ${location.sublocality ? `, ${location.sublocality}` : ''}`}
            </Typography>
            <Typography style={{color: '#717171'}}>
              {' '}
              {`${fromObj.day} ${fromObj.month === toObj.month ? '' : fromObj.month}-${toObj.day} ${
                toObj.month
              } `}
              ⦁ {guestCount} guests
            </Typography>
          </View>
        </View>
        <CircleButton minimal style={styles.searchFilter} image={<FilterMinIcon width={20} />} />
      </Pressable>
      <View style={styles.loadingIndicator}>
        {isLoading === true ? (
          <View style={[styles.loaderList]}>
            <SkeletonContent
              containerStyle={{paddingBottom: 0, width: '100%'}}
              animationDirection="horizontalLeft"
              layout={[
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
              ]}
            />
          </View>
        ) : (
          <>
            <View style={{height: hp(100)}}>
              {showMap && (
                <MapView.Animated
                  ref={mapRef}
                  style={{width: '100%', height: '100%', backgroundColor: 'white'}}
                  provider={PROVIDER_GOOGLE}
                  customMapStyle={mapStyle}
                  zoomEnabled
                  minZoomLevel={10}
                  maxZoomLevel={500}
                  // onRegionChangeComplete={(region) => fetchPostsOnChange(region)}
                  initialRegion={{
                    latitude: 5.602028159656166,
                    longitude: -0.183158678544458,
                    latitudeDelta: 0.8,
                    longitudeDelta: 0.8,
                  }}
                >
                  {posts.map(place => (
                    <CustomMarker
                      isSelected={place.id === selectedPlacedId}
                      onPress={() => {
                        dispatch(
                          setPost({
                            id: place.id,
                            title: place.title,
                            images: place.images,
                            temp: true,
                          }),
                        );
                        navigation.navigate('Post', {postId: place.id});
                      }}
                      coordinate={{latitude: place.latitude, longitude: place.longitude}}
                      price={place.newPrice}
                    />
                  ))}
                </MapView.Animated>
              )}

              <BottomSheet
                enableContentPanningGesture
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
              >
                <View style={{alignItems: 'center', width: '100%'}}>
                  <Typography
                    variant="large"
                    bold
                    style={{marginBottom: offsets.offsetB, marginTop: offsets.offsetA}}
                  >
                    {posts?.length} homes
                  </Typography>
                  <FlatList
                    removeClippedSubviews
                    data={posts}
                    maxToRenderPerBatch={1}
                    initialNumToRender={1}
                    // contentContainerStyle={styles.padding40}
                    keyExtractor={keyExtractor}
                    // getItemLayout={getItemLayout}
                    // ListEmptyComponent={renderNoHome()}
                    extraData={posts}
                    renderItem={renderItem}
                    onEndReachedThreshold={0.5}
                    // onEndReached={onEndReached}
                    // ListFooterComponent={fetchingMore ? renderLoader : null}
                    windowSize={3}
                    updateCellsBatchingPeriod={100}
                  />
                </View>
              </BottomSheet>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchResults;
