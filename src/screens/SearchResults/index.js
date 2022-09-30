import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Post from '../../components/Post';
import {API, graphqlOperation} from 'aws-amplify';
import {listPosts, listPostsCount} from '../../graphql/queries';
import {Dimensions} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AnimatedEllipsis from 'react-native-animated-ellipsis';
import {useNavigation} from '@react-navigation/native';
import reactotron from 'reactotron-react-native';
import _ from 'lodash';
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
      let query = {
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
      const postsResult = await API.graphql(
        graphqlOperation(listPostsCount, query),
      );
      homeCount.current = (homeCount.current + postsResult?.data?.listPosts?.items?.length);
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

  const fetchPosts = async isReset => {
    if (isEnd) {
      hideAllLoader();
      return;
    }
    setIsLoading(true);
    try {
      let query = {
        limit: 20,
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
      const postsResult = await API.graphql(graphqlOperation(listPosts, query));
      setDatalist([...previousList, ...postsResult.data.listPosts.items]);
      setNextToken(postsResult.data.listPosts.nextToken);
      if (!postsResult.data.listPosts.items.length || !postsResult.data.listPosts.nextToken) {
        setEnd(true);
        setNextToken(null);
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

  const renderLoader = () => {
    return isLoading && datalist.length !== 0 ? (
      <View style={{marginVertical: 16, alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color="blue" />
      </View>
    ) : null;
  };

  const loadMore = _.debounce(isReset => {
    fetchPosts(isReset);
  }, 1000);

  const setStatusFilter = status => {
    setEnd(false);
    callOnScrollEnd.current = false;
    setNextToken(null);
    setStatus(status);
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

  const renderItem = ({item, index}) => {
    return (
      <View key={item}>
        <Post post={item} />
      </View>
    );
  };

  const renderNoHome = () => {
    return (<View
      style={{
        flex: 1,
        paddingTop: 25,
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
          There are no homes in the area you searched. Try expanding your
          search to include other towns and cities near this area.
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
    </View>)
  }

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
            <Feather name="home" size={25} color={'white'} />
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              {homeCount.current === 0
                ? 'Loading...'
                : homeCount.current + ' homes to rent'}
            </Text>
          </View>
          <View style={{marginBottom: 10, top: 80, backgroundColor: 'white'}}>
            <FlatList
              removeClippedSubviews={true}
              data={datalist}
              maxToRenderPerBatch={1}
              initialNumToRender={1}
              contentContainerStyle={{paddingBottom: 40}}
              onEndReached={() => callOnScrollEnd.current = true}
              onMomentumScrollEnd={() => {
                callOnScrollEnd.current && loadMore(false);
                callOnScrollEnd.current = false
              }}
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
              ListEmptyComponent={renderNoHome()}
              renderItem={renderItem}
              ListFooterComponent={renderLoader}
              // getItemCount={data => data.length}
              windowSize={3}
              updateCellsBatchingPeriod={100}
              //renderItem={({item}) => <Post post={item}/>}
            />
          </View>
        </View>
      ) : (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
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
