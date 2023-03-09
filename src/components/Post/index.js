import React, {useContext, useState} from 'react';
import {View, Platform, Text, Pressable} from 'react-native';
import styles from './styles.js';
import {useNavigation} from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../../navigation/AuthProvider';
import FastImage from 'react-native-fast-image';
import useWishlist from '../../hooks/useWishlist.js';

const Post = props => {
  const {checkIsFav, handleChangeFavorite} = useWishlist();
  var docRefId;
  let docId;
  const {user, logout} = useContext(AuthContext);
  const addToTrends = async () => {
    firestore()
      .collection('trends')
      .doc(post.id)
      .set({
        image: post.image,
        type: post.type,
        title: post.title,
        description: post.description,

        bed: post.bed,
        bedroom: post.bedroom,
        maxGuests: post.maxGuests,
        wifi: post.wifi,
        kitchen: post.kitchen,
        bathroom: post.bathroom,
        water: post.water,
        toilet: post.toilet,
        images: post.images,

        oldPrice: post.oldPrice,
        newPrice: post.newPrice,
        count: counter,
        latitude: post.latitude,
        longitude: post.longitude,
        id: post.id,
      })
      .then(() => {
        console.log('Added to Trends');
      })
      .catch(error => {
        console.log('Something went wrong adding to Trends', error);
      });
  };
  const updateTrendCount = async (postid, val) => {
    firestore()
      .collection('trends')
      .doc(postid)
      .update({
        count: firestore.FieldValue.increment(1),
      })
      .then(() => {
        console.log('User updated!');
      });
  };

  var rand;
  const addToFavorites = () => {
    var randomString = (Math.random() * 1e32).toString(36);
    rand = randomString;
    firestore()
      .collection('posts')
      .doc(rand)
      .set({
        userId: user.uid,
        image: post.image,
        type: post.type,
        title: post.title,
        description: post.description,
        randString: randomString,

        bed: post.bed,
        bedroom: post.bedroom,
        maxGuests: post.maxGuests,
        wifi: post.wifi,
        kitchen: post.kitchen,
        bathroom: post.bathroom,
        water: post.water,
        toilet: post.toilet,
        images: post.images,

        oldPrice: post.oldPrice,
        newPrice: post.newPrice,
        count: counter,
        liked: false,
        latitude: post.latitude,
        longitude: post.longitude,
        id: post.id,
      })
      .then(docRef => {
        docRefId = docRef.id;
        docId = docRefId;
      })
      .catch(error => {
        console.log('Something went wrong adding to Favorites', error);
      });
  };

  const [counter, setCount] = useState(0);
  const [isLike, setIsLike] = useState(false);

  const colorStyle = 'deeppink';

  const post = props.post;
  const navigation = useNavigation();
  const goToPostPage = () => {
    navigation.navigate('Post', {postId: post.id});
  };

  return (
    <Pressable onPress={goToPostPage} style={styles.container}>
      {/* Image */}
      <View>
        <FastImage
          fallback={Platform.OS === 'android' ? true : false}
          source={{
            uri: post.image,
            // headers: {Authorization: 'someAuthToken'},
            priority: FastImage.priority.high,
          }}
          style={styles.image}
        />

        <Pressable
          style={{
            shadowColor: 'black',
            shadowOpacity: 0.5,
            shadowRadius: 30,
            margin: 8,
            right: 0,
            top: 5,
            position: 'absolute',
            height: 35,
            width: 35,
            backgroundColor: 'white',
            elevation: 90,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => handleChangeFavorite(post)}>
          <Fontisto
            name="heart"
            size={15}
            color={checkIsFav(post.id) ? colorStyle : 'black'}
          />
        </Pressable>
        <View
          style={{
            shadowColor: 'black',
            shadowOpacity: 0.5,
            shadowRadius: 30,
            margin: 10,
            left: 0,
            top: 5,
            position: 'absolute',
            height: 30,
            width: 80,
            backgroundColor: 'white',
            elevation: 90,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            adjustsFontSizeToFit={true}
            style={{fontSize: 14, fontWeight: 'bold'}}>
            {post.mode === 'For Sale' ? 'FOR SALE' : 'FOR RENT'}
          </Text>
        </View>
      </View>

      {/* Bed and Bedroom */}

      {/* Type and Description */}
      {post.locality != null ? (
        <Text style={{marginTop: 5, fontWeight: '400', fontSize: 14}}>
          {post.type} in {post.locality}
        </Text>
      ) : (
        <Text
          style={{marginTop: 5, fontWeight: '400', fontSize: 14}}
          numberOfLines={2}>
          {post.type} | {post.title}
        </Text>
      )}
      <Text style={styles.bedrooms}>
        {post.bedroom} bedrooms | {post.bathroomNumber} bathrooms
      </Text>

      {/* Old and new Price */}

      <Text style={styles.prices}>
        {/* <Text style={styles.oldPrice}>
                GH₵{post.oldPrice}
                </Text> */}
        {post.mode === 'For Sale' ? (
          <Text style={styles.newPrice}>
            {post.currency
              ? post.currency[0] === 'usd'
                ? '$'
                : post.currency[0] === 'ghs'
                ? 'GH₵'
                : 'GH₵'
              : 'GH₵'}
            {Math.round(post.newPrice * 1.07)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
          </Text>
        ) : (
          <Text style={styles.newPrice}>
            {post.currency
              ? post.currency[0] === 'usd'
                ? '$'
                : post.currency[0] === 'ghs'
                ? 'GH₵'
                : 'GH₵'
              : 'GH₵'}
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
