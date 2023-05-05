/* eslint-disable react/jsx-no-bind */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Post from '../../components/Post';
import useVisibility from '../../hooks/useVisibility';
import {AuthContext} from '../../navigation/AuthProvider';
import FirebaseRepo from '../../repositry/FirebaseRepo';

const Wishlists = () => {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [posts, setPosts] = useState([]);

  const loadingVisiblity = useVisibility(true);

  const fetchPosts = useCallback(async () => {
    const wishList = await FirebaseRepo.getWishlist(user.uid);
    setPosts(() => wishList);
    loadingVisiblity.hide();
  }, [user.uid, loadingVisiblity]);

  useEffect(() => {
    if (!user.uid) {
      return;
    }
    isFocused && fetchPosts();
  }, [fetchPosts, user.uid, isFocused]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <LinearGradient
        colors={['purple', 'deeppink']}
        start={{x: 0.1, y: 0.2}}
        end={{x: 1, y: 0.5}}
        style={[styles.linearGradient]}>
        <View style={styles.paddingTop15}>
          <Text style={styles.wishlists}>Wishlists</Text>
        </View>
      </LinearGradient>

      <View>
        {posts.length !== 0 ? (
          <>
            <Text style={[styles.subTitle, styles.padding15]}>Your Favorites</Text>
            <FlatList data={posts} renderItem={({item}) => <Post post={item} />} />
          </>
        ) : (
          <View style={styles.main}>
            {loadingVisiblity.visible ? (
              <ActivityIndicator animating size="large" color="blue" style={{opacity: 1}} />
            ) : (
              <>
                <Text style={styles.subTitle}>No saves yet</Text>
                <Text style={styles.description}>
                  Start looking for homes to rent or buy: As you search, tap the heart icon to save
                  your favorite homes to rent or buy.
                </Text>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Welcome')}
                  style={styles.button}>
                  <Text style={styles.startText}>Start exploring</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingBottom: 180,
  },
  linearGradient: {
    height: '25%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  wishlists: {
    fontSize: 32,
    color: 'white',
    fontFamily: 'Montserrat-Bold',
  },
  paddingTop15: {
    paddingTop: 15,
  },
  padding15: {
    padding: 15,
  },
  subTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
  },
  main: {
    padding: 15,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    padding: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    width: '50%',
    height: '20%',
    borderRadius: 10,
  },
  startText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
});

export default Wishlists;
