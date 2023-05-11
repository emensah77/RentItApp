import {faMap} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useRef, useState, useContext, useEffect} from 'react';
import {FlatList, ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Post from './components/Post';
import SettingModal from './components/SettingModal';
import FirebaseRepo from '../../repositry/FirebaseRepo';
import styles1 from './FirstScreenOfWishlists.styles';
import styles2 from './SecondScreenOfWishlists.styles';
import EmptyWishList from './components/EmptyWishList';
import {AuthContext} from '../../navigation/AuthProvider';

export default () => {
  const modalizeRef = useRef(null);
  const isFocused = useIsFocused();
  const {user} = useContext(AuthContext);

  const [posts, setPosts] = useState({
    loading: false,
    data: [],
  });

  const fetchPosts = useCallback(async () => {
    if (!user.uid) return;

    setPosts(() => ({loading: true, data: []}));

    try {
      const res = await FirebaseRepo.getWishlist(user.uid);
      setPosts(() => ({
        loading: false,
        data: res,
      }));
    } catch (err) {
    } finally {
      setPosts(oldPosts => ({...oldPosts, loading: false}));
    }
  }, [user.uid]);

  useEffect(() => {
    isFocused && fetchPosts();
  }, [fetchPosts, isFocused]);

  const openModal = useCallback(() => {
    modalizeRef.current?.open();
  }, []);

  const renderLoading = useCallback(
    () => (
      <View style={styles2.loadingContainer}>
        <ActivityIndicator animating size="large" color="blue" />
      </View>
    ),
    [],
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles2.px24}>
        <Text style={[styles1.title, styles2.title]}>Your wishlists</Text>
      </View>
    ),
    [],
  );

  const renderMapButton = useCallback(
    () => (
      <TouchableOpacity activeOpacity={0.7} style={styles2.mapButton} onPress={openModal}>
        <Text style={[styles2.desTitle, styles2.whiteText]}>
          Map
          <View style={styles2.starIconOfDes}>
            <FontAwesomeIcon icon={faMap} size={16} color="white" />
          </View>
        </Text>
      </TouchableOpacity>
    ),
    [openModal],
  );

  const renderItem = useCallback(({item}) => <Post item={item} />, []);

  const renderFlatlist = useCallback(
    () => (
      <FlatList
        keyExtractor={renderKey}
        showsVerticalScrollIndicator={false}
        data={posts.data}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles2.px24}>
            <EmptyWishList />
          </View>
        }
        contentContainerStyle={styles2.scrollView}
      />
    ),
    [posts.data, renderItem, renderKey],
  );

  const renderKey = useCallback((_, key) => key.toString(), []);
  return (
    <SafeAreaView style={styles1.container}>
      {posts.loading ? (
        renderLoading()
      ) : (
        <>
          {renderHeader()}
          {renderFlatlist()}
        </>
      )}

      {renderMapButton()}

      <SettingModal modalizeRef={modalizeRef} />
      {/* <WishlistsModal modalizeRef={modalizeRef}>{renderDescription()}</WishlistsModal> */}
      {/* <WishlistsModal modalizeRef={modalizeRef} /> */}
    </SafeAreaView>
  );
};
