import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Card = props => {
  const {post} = props;
  const navigation = useNavigation();

  const goToPostPage = useCallback(() => {
    navigation.navigate('Post', {postId: post.id});
  }, [navigation, post.id]);

  return (
    <TouchableOpacity onPress={goToPostPage}>
      <View style={styles.card}>
        <View style={styles.heartIconContainer}>
          <View style={styles.heartIcon}>
            <FontAwesome name="heart-o" size={18} color="black" />
          </View>
        </View>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{uri: post.image}} />
        </View>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${post.newPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 225,
    backgroundColor: 'lightgrey',
    width: Dimensions.get('screen').width / 2 - 30,
    marginHorizontal: 2,
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
  },
  imageContainer: {
    height: 100,
    width: 100,
    alignItems: 'center',
  },
  image: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
    flex: 1,
    resizeMode: 'cover',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  heartIconContainer: {
    alignItems: 'flex-end',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  heartIcon: {
    width: 30,
    height: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
export default Card;
