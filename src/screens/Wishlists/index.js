import React, {useState, useEffect, useContext, useCallback} from 'react';
import {SafeAreaView, View, ActivityIndicator} from 'react-native';

import {offsets} from '../../assets/styles/global';
import {styles} from './styles';

import Typography from '../../components/DataDisplay/Typography';
import FirebaseRepo from '../../repositry/FirebaseRepo';
import {AuthContext} from '../../navigation/AuthProvider';
import WishListItem from '../../components/DataDisplay/WishListItem';
import {global} from '../../assets/styles';

const loadingStyle = [global.flex, global.center];
const safeAreaStyle = {flex: 1, backgroundColor: '#fff'};
const wishListTextStyle = {marginTop: offsets.offsetC, marginBottom: 32};

const WishList = () => {
  const {user} = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    const wishList = await FirebaseRepo.getWishlist(user?.uid);
    const temp = {};
    const uniquePosts = [];

    wishList?.forEach(function (single) {
      if (!temp[single.id]) {
        uniquePosts.push(single);
      }
    });

    setPosts(uniquePosts);
    setLoading(false);
  }, [user]);

  const keyExtractor = useCallback(item => item.id, []);

  useEffect(() => {
    if (!user.uid) {
      return;
    }
    fetchPosts();
  }, [fetchPosts, user]);

  return (
    <>
      <SafeAreaView style={safeAreaStyle}>
        <View style={styles.mainContent}>
          <Typography variant="xlarge" bold style={wishListTextStyle}>
            Wishlists
          </Typography>
          {loading ? (
            <View style={loadingStyle}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <>
              {posts.length > 0 &&
                posts.map(item => <WishListItem key={keyExtractor(item)} item={item} />)}
              {posts.length === 0 && (
                <>
                  <Typography bold style={styles.subTitle}>
                    Create your first wishlist
                  </Typography>
                  <Typography style={styles.text}>
                    As you search, tap the heart icon to save your favourite places to stay or
                    things to do to a wishlist.
                  </Typography>
                </>
              )}
            </>
          )}
        </View>
        {/* <RequestBook /> */}
        {/* <ListingHome /> */}
        {/* <Payment /> */}
      </SafeAreaView>
    </>
  );
};

export default WishList;
