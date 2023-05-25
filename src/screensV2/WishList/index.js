import React, {useState, useEffect, useContext} from 'react';
import {SafeAreaView, View} from 'react-native';

import {offsets} from '../../styles/globalStyles';
import {styles} from './styles';

import Typography from '../../componentsV2/DataDisplay/Typography';
import FirebaseRepo from '../../repositry/FirebaseRepo';
import {AuthContext} from '../../navigation/AuthProvider';
import WishListItem from '../../componentsV2/DataDisplay/WishListItem';
import RequestBook from '../../screensV2/RequestBook';
import ListingHome from '../ListingHome';

const WishList = () => {
  const {user} = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const wishList = await FirebaseRepo.getWishlist(user.uid);
    const temp = {};
    const uniquePosts = [];

    wishList?.forEach(function (single) {
      if (!temp[single.id]) {
        uniquePosts.push(single);
      }
    });

    setPosts(uniquePosts);
    setLoading(false);
  };

  useEffect(() => {
    if (!user.uid) {
      return;
    }
    fetchPosts();
  }, []);

  return (
    <>
      <SafeAreaView>
        {/* <View style={styles.mainContent}>
          <Typography variant="xlarge" bold style={{marginTop: offsets.offsetC, marginBottom: 32}}>
            Wishlists
          </Typography>
          {posts?.length > 0 ? (
            <>
              {posts?.map(item => (
                <WishListItem item={item} />
              ))}
            </>
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
        </View> */}
        {/* <RequestBook /> */}
        <ListingHome />
      </SafeAreaView>
    </>
  );
};

export default WishList;
