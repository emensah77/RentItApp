import React, {useState, useEffect, useContext, useCallback} from 'react';
import {View, ActivityIndicator} from 'react-native';

import {offsets} from '../../assets/styles/global';
import {styles} from './styles';

import Typography from '../../components/DataDisplay/Typography';
import FirebaseRepo from '../../repositry/FirebaseRepo';
import {AuthContext} from '../../navigation/AuthProvider';
import WishListItem from '../../components/DataDisplay/WishListItem';
import Page from '../../components/Page'; // Importing the Page component

const loadingStyle = [styles.flex, styles.center];
const wishListTextStyle = {marginTop: offsets.offsetC, marginBottom: 32};

const WishList = () => {
  const {user} = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    const wishList = await FirebaseRepo.getWishlist(user?.uid);
    const temp = {};
    const uniquePosts = wishList?.filter(single => {
      if (!temp[single.id]) {
        temp[single.id] = true;
        return true;
      }
      return false;
    });

    setPosts(uniquePosts);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user?.uid) {
      fetchPosts();
    }
  }, [fetchPosts, user]);

  return (
    <Page>
      <Typography variant="xlarge" bold style={wishListTextStyle}>
        Wishlists
      </Typography>
      {loading ? (
        <View style={loadingStyle}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          {posts.length > 0 ? (
            posts.map(item => <WishListItem key={item.id} item={item} />)
          ) : (
            <>
              <Typography bold style={styles.subTitle}>
                Create your first wishlist
              </Typography>
              <Typography style={styles.text}>
                As you search, tap the heart icon to save your favourite places to stay or things to
                do to a wishlist.
              </Typography>
            </>
          )}
        </>
      )}
    </Page>
  );
};

export default WishList;
