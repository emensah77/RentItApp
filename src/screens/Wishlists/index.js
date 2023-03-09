/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StatusBar, View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Post from '../../components/Post';
import {AuthContext} from '../../navigation/AuthProvider';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import LinearGradient from 'react-native-linear-gradient';
import FirebaseRepo from '../../repositry/FirebaseRepo';

const Wishlists = () => {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    setLoading(true);
    const wishList = await FirebaseRepo.getWishlist(user.uid);
    const temp = {};
    const uniquePosts = [];
    wishList?.map(single => {
      if (!temp[single.id]) {
        uniquePosts.push(single);
      }
    });
    setPosts(uniquePosts);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
        paddingBottom: 180,
      }}>
      <StatusBar hidden={true} />
      <LinearGradient
        colors={['purple', 'deeppink']}
        start={{x: 0.1, y: 0.2}}
        end={{x: 1, y: 0.5}}
        style={[
          {
            height: '25%',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            paddingHorizontal: 20,
            justifyContent: 'center',
          },
        ]}>
        <View style={{paddingTop: 15}}>
          <Text
            style={{
              fontSize: 32,
              color: 'white',
              fontFamily: 'Montserrat-Bold',
            }}>
            Wishlists
          </Text>
        </View>
      </LinearGradient>

      {loading ? (
        <View
          style={{
            marginVertical: 20,
            padding: 10,
            marginHorizontal: 0,
            justifyContent: 'flex-start',
            alignContent: 'center',
          }}>
          <SkeletonContent
            containerStyle={{paddingBottom: 100, width: 300}}
            animationDirection="horizontalLeft"
            layout={[
              {width: 370, height: 220, marginBottom: 10, borderRadius: 10},
              {width: 220, height: 20, marginBottom: 6},
              {width: 90, height: 20, marginBottom: 20},

              {width: 370, height: 220, marginBottom: 10, borderRadius: 10},
              {width: 220, height: 20, marginBottom: 6},
              {width: 90, height: 20, marginBottom: 20},

              {width: 370, height: 220, marginBottom: 10, borderRadius: 10},
              {width: 220, height: 20, marginBottom: 6},
              {width: 90, height: 20, marginBottom: 20},
            ]}
          />
        </View>
      ) : (
        <View>
          {posts.length !== 0 ? (
            <>
              <View style={{padding: 15}}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: 20,
                  }}>
                  Your Favorites
                </Text>
              </View>
              <FlatList
                data={posts}
                renderItem={({item}) => <Post post={item} />}
              />
            </>
          ) : (
            <View style={{padding: 15}}>
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: 20,
                }}>
                No saves yet
              </Text>
              <View style={{padding: 10}}>
                <Text style={{fontSize: 16, fontFamily: 'Montserrat-Regular'}}>
                  Start looking for homes to rent or buy: As you search, tap the
                  heart icon to save your favorite homes to rent or buy.
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('Welcome')}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: 'black',
                  width: '50%',
                  height: '20%',

                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Montserrat-Bold',
                  }}>
                  Start exploring
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default Wishlists;
