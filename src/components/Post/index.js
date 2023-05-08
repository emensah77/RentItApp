import React, {useCallback, useMemo} from 'react';
import {View, Platform, Text, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';
// import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';

import styles from './styles';

// import {AuthContext} from '../../navigation/AuthProvider';
import useWishlist from '../../hooks/useWishlist';

const Post = props => {
  const {checkIsFav, handleChangeFavorite} = useWishlist();
  // let docRefId;
  // const {user} = useContext(AuthContext);
  // const [counter, setCount] = useState(0);
  // const [isLike, setIsLike] = useState(false);

  const colorStyle = 'deeppink';

  const {post} = props;
  const navigation = useNavigation();

  const currency = useMemo(() => {
    if (post.currency) {
      if (post.currency[0] === 'usd') {
        return '$';
      } else if (post.currency[0] === 'ghs') {
        return 'GH₵';
      } else {
        return 'GH₵';
      }
    } else {
      return 'GH₵';
    }
  }, [post?.currency]);

  const goToPostPage = useCallback(() => {
    navigation.navigate('Post', {postId: post.id});
  }, [navigation, post.id]);

  const onChangeFavorite = useCallback(() => {
    handleChangeFavorite(post);
  }, [handleChangeFavorite, post]);

  // const addToTrends = async () => {
  //   firestore()
  //     .collection('trends')
  //     .doc(post.id)
  //     .set({
  //       image: post.image,
  //       type: post.type,
  //       title: post.title,
  //       description: post.description,

  //       bed: post.bed,
  //       bedroom: post.bedroom,
  //       maxGuests: post.maxGuests,
  //       wifi: post.wifi,
  //       kitchen: post.kitchen,
  //       bathroom: post.bathroom,
  //       water: post.water,
  //       toilet: post.toilet,
  //       images: post.images,

  //       oldPrice: post.oldPrice,
  //       newPrice: post.newPrice,
  //       count: counter,
  //       latitude: post.latitude,
  //       longitude: post.longitude,
  //       id: post.id,
  //     })
  //     .then(() => {
  //       console.log('Added to Trends');
  //     })
  //     .catch(error => {
  //       console.log('Something went wrong adding to Trends', error);
  //     });
  // };

  // const updateTrendCount = async (postid, val) => {
  //   firestore()
  //     .collection('trends')
  //     .doc(postid)
  //     .update({
  //       count: firestore.FieldValue.increment(1),
  //     })
  //     .then(() => {
  //       console.log('User updated!');
  //     });
  // };

  // let rand;
  // const addToFavorites = () => {
  //   const randomString = (Math.random() * 1e32).toString(36);
  //   rand = randomString;
  //   firestore()
  //     .collection('posts')
  //     .doc(rand)
  //     .set({
  //       userId: user.uid,
  //       image: post.image,
  //       type: post.type,
  //       title: post.title,
  //       description: post.description,
  //       randString: randomString,

  //       bed: post.bed,
  //       bedroom: post.bedroom,
  //       maxGuests: post.maxGuests,
  //       wifi: post.wifi,
  //       kitchen: post.kitchen,
  //       bathroom: post.bathroom,
  //       water: post.water,
  //       toilet: post.toilet,
  //       images: post.images,

  //       oldPrice: post.oldPrice,
  //       newPrice: post.newPrice,
  //       count: counter,
  //       liked: false,
  //       latitude: post.latitude,
  //       longitude: post.longitude,
  //       id: post.id,
  //     })
  //     .then(docRef => {
  //       docRefId = docRef.id;
  //       docId = docRefId;
  //     })
  //     .catch(error => {
  //       console.log('Something went wrong adding to Favorites', error);
  //     });
  // };

  return (
    <Pressable onPress={goToPostPage} style={styles.container}>
      {/* Image */}
      <View>
        <FastImage
          fallback={Platform.OS === 'android'}
          source={{
            uri: post.image,
            // headers: {Authorization: 'someAuthToken'},
            priority: FastImage.priority.high,
          }}
          style={styles.image}
        />

        <Pressable style={styles.favorite} onPress={onChangeFavorite}>
          <Fontisto name="heart" size={15} color={checkIsFav(post.id) ? colorStyle : 'black'} />
        </Pressable>
        <View style={styles.forSale}>
          <Text adjustsFontSizeToFit style={styles.forSaleText}>
            {post.mode === 'For Sale' ? 'FOR SALE' : 'FOR RENT'}
          </Text>
        </View>
      </View>

      {/* Bed and Bedroom */}

      {/* Type and Description */}
      {post.locality != null ? (
        <Text style={styles.location}>
          {post.type} in
          {post.locality}
        </Text>
      ) : (
        <Text style={styles.typeTitle} numberOfLines={2}>
          {post.type} |{post.title}
        </Text>
      )}
      <Text style={styles.bedrooms}>
        {post.bedroom} bedrooms |{post.bathroomNumber} bathrooms
      </Text>

      {/* Old and new Price */}

      <Text style={styles.prices}>
        {/* <Text style={styles.oldPrice}>
                GH₵{post.oldPrice}
                </Text> */}
        {post.mode === 'For Sale' ? (
          <Text style={styles.newPrice}>
            {currency}
            {Math.round(post.newPrice * 1.07)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
          </Text>
        ) : (
          <Text style={styles.newPrice}>
            {currency}
            {Math.round((post.newPrice * 1.07) / 12)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
            / month
          </Text>
        )}
      </Text>
      {/* Total price */}

      {/* <Text style={styles.totalPrice}>
                        GH₵{Math.round(post.newPrice * 1.07)}
                    </Text> */}
    </Pressable>
  );
};

export default React.memo(Post);
