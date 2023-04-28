import React, {useEffect, useRef, useState, useLayoutEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {API, graphqlOperation} from 'aws-amplify';

import Feather from 'react-native-vector-icons/Feather';
import AnimatedEllipsis from 'react-native-animated-ellipsis';
import {useNavigation} from '@react-navigation/native';
import reactotron from 'reactotron-react-native';
import _ from 'lodash';
import {listPosts, listPostsCount} from '../../graphql/queries';
import Post from '../../components/Post';
import {HOME_STATUS} from '../../variables';

const SearchResultsScreen = ({guests, viewport}) => {
  const [loading, setLoading] = useState(true);
  const [datalist, setDatalist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnd, setEnd] = useState(false);

  const [status, setStatus] = useState('All');
  const [modeStatus, setModeStatus] = useState('Everything');
  const [nextToken, setNextToken] = useState(null);
  const [homeCountState, setHomeCountState] = useState(0);
  const homeCount = useRef(0);
  const callOnScrollEnd = useRef(false);

  const navigation = useNavigation();

  const modes = [
    {
      status: 'Everything',
      id: 1,
    },
    {
      status: 'For Rent',
      id: 2,
    },
    {status: 'For Sale', id: 3},
  ];

  const categories = [
    {
      status: 'All',
      id: 1,
    },

    {
      status: 'Entire Flat',
      id: 2,
    },
    {
      status: 'Apartment',
      id: 3,
    },
    {
      status: 'Mansion',
      id: 4,
    },
    {
      status: 'Self-Contained',
      id: 5,
    },
    {
      status: 'Single Room',
      id: 6,
    },
    {
      status: 'Full Home',
      id: 7,
    },
  ];

  const fetchCount = async nextToken => {
    try {
      const query = {
        limit: 100000,
        filter: {
          and: {
            maxGuests: {
              ge: guests,
            },
            type: {
              eq: status,
            },
            latitude: {
              between: [viewport.southwest.lat, viewport.northeast.lat],
            },
            longitude: {
              between: [viewport.southwest.lng, viewport.northeast.lng],
            },
            status: {eq: HOME_STATUS.APPROVED},
          },
        },
        nextToken,
      };
      if (status === 'All') {
        delete query.filter.and.type;
      }
      if (nextToken === null) {
        delete query.nextToken;
      }
      const postsResult = await API.graphql(graphqlOperation(listPosts, query));
      homeCount.current += postsResult?.data?.listPosts?.items?.length;
      if (postsResult?.data?.listPosts?.nextToken !== null) {
        console.log(postsResult?.data?.listPosts?.items?.length, 'homeCount');
        fetchCount(postsResult.data.listPosts.nextToken);
      } else {
        setHomeCountState(homeCount.current);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [filteredLoading, setFilteredLoading] = useState(false);

  const fetchFilteredPosts = async (status, token, items = []) => {
    setFilteredLoading(true);
    try {
      const query = {
        limit: 1000,
        nextToken: token,
        filter: {
          and: {
            maxGuests: {
              ge: guests,
            },
            type: {
              eq: status,
            },
            latitude: {
              between: [viewport.southwest.lat, viewport.northeast.lat],
            },
            longitude: {
              between: [viewport.southwest.lng, viewport.northeast.lng],
            },
          },
        },
      };

      if (status === 'All') {
        delete query.filter.and.type;
      }

      const postsResult = await API.graphql(graphqlOperation(listPosts, query));
      const newItems = items.concat(postsResult.data.listPosts.items);
      const newNextToken = postsResult.data.listPosts.nextToken;

      if (newNextToken) {
        fetchFilteredPosts(status, newNextToken, newItems);
      } else {
        setDatalist(newItems);
        setFilteredLoading(false);
      }
    } catch (error) {
      console.log(error);
      setFilteredLoading(false);
    }
  };

  const fetchPosts = async isReset => {
    if (reachedEnd) {
      hideAllLoader();
      return;
    }

    setIsLoading(true);

    try {
      const query = {
        limit: 50,
        filter: {
          and: {
            maxGuests: {
              ge: guests,
            },
            type: {
              eq: status,
            },
            latitude: {
              between: [viewport.southwest.lat, viewport.northeast.lat],
            },
            longitude: {
              between: [viewport.southwest.lng, viewport.northeast.lng],
            },
          },
        },
        nextToken,
      };

      if (status === 'All') {
        delete query.filter.and.type;
      }

      let previousList = datalist;
      if (isReset) {
        delete query.nextToken;
        previousList = [];
      }

      const fetchBatch = async (query, results = []) => {
        const postsResult = await API.graphql(
          graphqlOperation(listPosts, query),
        );
        results.push(...postsResult.data.listPosts.items);

        if (postsResult.data.listPosts.nextToken) {
          if (results.length < 20) {
            query.nextToken = postsResult.data.listPosts.nextToken;
            return fetchBatch(query, results);
          }
        }

        return {results, nextToken: postsResult.data.listPosts.nextToken};
      };

      const {results, nextToken} = await fetchBatch(query);

      // Compare currentDataIndex to the fetched results length
      if (currentDataIndex < results.length - 1) {
        setDatalist([...previousList, ...results]);
        setNextToken(nextToken);
        setCurrentDataIndex(currentDataIndex + 1); // Increment the index
      } else {
        setReachedEnd(true);
      }

      hideAllLoader();
    } catch (e) {
      console.log(e);
      hideAllLoader();
    }
  };

  const hideAllLoader = () => {
    if (loading) {
      setLoading(false);
    }
    if (isLoading) {
      setIsLoading(false);
    }
  };

  const renderLoader = () =>
    isLoading && datalist.length !== 0 ? (
      <View style={{marginVertical: 16, alignItems: 'center'}}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    ) : null;

  const loadMore = _.debounce(isReset => {
    fetchPosts(isReset);
  }, 1000);

  const setStatusFilter = status => {
    setEnd(false);
    callOnScrollEnd.current = false;
    setNextToken(null);
    setStatus(status);
    fetchFilteredPosts(status);
  };

  useEffect(() => {
    loadMore(true);
    fetchCount(null);
    setHomeCountState(0);
    homeCount.current = 0;
  }, [status]);

  const setModeFilter = modeStatus => {
    if (modeStatus !== 'Everything') {
      setDatalist([
        ...datalist.filter(category => category.mode === modeStatus),
      ]);
    } else {
      setDatalist(datalist);
    }
    setModeStatus(modeStatus);
  };

  const renderItem = ({item, index}) => (
    <View key={item}>
      <Post post={item} />
    </View>
  );

  const renderNoHome = () => (
    <View
      style={{
        flex: 1,
        padding: 15,
        backgroundColor: 'white',
      }}>
      <Text
        style={{
          fontFamily: 'Montserrat-Bold',
          fontSize: 20,
        }}>
        No Homes Here
      </Text>
      <View style={{paddingVertical: 10}}>
        <Text style={{fontSize: 16, fontFamily: 'Montserrat-Regular'}}>
          There are no homes in the area you searched. Try expanding your search
          to include other towns and cities near this area.
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: 'black',
          width: '40%',
          backgroundColor: 'black',
          paddingVertical: 13,
          borderRadius: 10,
        }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Montserrat-Bold',
            color: 'white',
          }}>
          Search Again
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={{paddingBottom: 100, marginBottom: 100, backgroundColor: 'white'}}>
      {/* <View style={{marginTop:10, flexDirection:'row', justifyContent:'space-between'}}>
            {modes.map((mode) => (

                <TouchableOpacity onPress={() => setModeFilter(mode.status)}
                                    style={[styless.button,
                                    modeStatus === mode.status && styless.btnTabActive,

                                    ]}

                                    >

                                        <Text style={styless.textTab, modeStatus === mode.status && styless.textTabActive}>{mode.status}</Text>

                        </TouchableOpacity>

                ))}
                </View> */}

      {!loading ? (
        <View>
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
              top: Platform.OS === 'ios' ? 90 : 80,
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
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index.toString()}
                onPress={() => setStatusFilter(category.status)}
                style={[
                  styless.button,
                  status === category.status && styless.btnTabActive,
                ]}>
                <Text
                  style={[
                    styless.textTab,
                    status === category.status && styless.textTabActive,
                  ]}>
                  {category.status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View
            style={{
              backgroundColor: '#FF007F',
              width: Dimensions.get('screen').width - 20,
              marginHorizontal: 10,
              height: 50,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              position: 'relative',
              top: 20,
              zIndex: 1,
            }}>
            <Feather name="home" size={25} color="white" />
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              {loading
                ? 'Loading...'
                : `${+' ' + homeCount.current} homes to rent`}
            </Text>
          </View>
          <View style={{marginBottom: 10, top: 80, backgroundColor: 'white'}}>
            {filteredLoading ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                }}>
                <ActivityIndicator size="large" color="blue" />
              </View>
            ) : (
              <FlatList
                removeClippedSubviews
                data={datalist}
                maxToRenderPerBatch={1}
                initialNumToRender={1}
                contentContainerStyle={{paddingBottom: 40}}
                onEndReached={() => (callOnScrollEnd.current = true)}
                onMomentumScrollEnd={() => {
                  callOnScrollEnd.current && loadMore(false);
                  callOnScrollEnd.current = false;
                }}
                // onEndReached={({distanceFromEnd}) => {
                // }}
                keyExtractor={(item, index) => index.toString()}
                getItemLayout={(data, index) => ({
                  length: 380,
                  offset: 380 * index,
                  index,
                })}
                ListEmptyComponent={renderNoHome()}
                renderItem={renderItem}
                ListFooterComponent={renderLoader}
                // getItemCount={data => data.length}
                windowSize={3}
                updateCellsBatchingPeriod={100}
                // renderItem={({item}) => <Post post={item}/>}
              />
            )}
          </View>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AnimatedEllipsis
            animationDelay={100}
            style={{
              color: 'blue',
              fontSize: 100,

              letterSpacing: -15,
            }}
          />
        </View>
      )}
    </View>
  );
};
export default SearchResultsScreen;
const styless = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'rgba(211, 211, 211, 0.8)', // Light grey with opacity
    width: '80%', // Add width (you can adjust the percentage to your desired value)
    paddingVertical: 5,
    borderRadius: 20, // Rounded edges
    borderWidth: 1, // Border width
    borderColor: 'rgba(0, 0, 0, 0.2)', // Border color with opacity
    alignSelf: 'center', // Center the container
    marginHorizontal: 10, // Add horizontal margins
  },
  headerText: {
    fontSize: 24, // Large text
    textAlign: 'center', // Center the text
  },
  button: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
    shadowColor: '#000',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 30,
    alignItems: 'center',
    borderWidth: 0.1,
    borderColor: 'black',
  },

  btnTabActive: {
    backgroundColor: 'black',
  },
  textTab: {
    fontSize: 14,
    color: 'black',
  },
  textTabActive: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
});
