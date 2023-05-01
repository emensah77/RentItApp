import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Post from '../../components/Post';
import {AuthContext} from '../../navigation/AuthProvider';
import FirebaseRepo from '../../repositry/FirebaseRepo';
import BackButton from '../../components/BackButton/BackButton';

const Wishlists = () => {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
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
  }, [user.uid]);

  useEffect(() => {
    if (!user.uid) {
      return;
    }
    fetchPosts();
  }, [fetchPosts, user.uid]);

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
          <View
            style={{
              transform: [
                {
                  translateY: 20,
                },
              ],
            }}>
            <BackButton />
          </View>
          <Text
            style={{
              fontSize: 32,
              color: 'white',
              paddingTop: 25,
              fontFamily: 'Montserrat-Bold',
            }}>
            Wishlists
          </Text>
        </View>
      </LinearGradient>

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
            {loading ? (
              <ActivityIndicator
                animating={true}
                size="large"
                color="blue"
                style={{opacity: 1}}
              />
            ) : (
              <>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: 20,
                  }}>
                  No saves yet
                </Text>
                <View style={{padding: 10}}>
                  <Text
                    style={{fontSize: 16, fontFamily: 'Montserrat-Regular'}}>
                    Start looking for homes to rent or buy: As you search, tap
                    the heart icon to save your favorite homes to rent or buy.
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
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default Wishlists;
