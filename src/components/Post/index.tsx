import React, {useCallback, useMemo} from 'react';
import {View, Platform, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SizedBox, Text} from '@components';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FastImage from 'react-native-fast-image';

import {colors, global} from '@assets/styles';
import styles from './styles';

import useWishlist from '../../hooks/useWishlist';

const Post = props => {
  const {checkIsFav, handleChangeFavorite} = useWishlist();

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

  const source = useMemo(
    () => ({
      uri: post.images[0],
      priority: FastImage.priority.high,
    }),
    [post],
  );

  return (
    <Pressable onPress={goToPostPage} style={styles.container}>
      {/* Image */}
      <View>
        <FastImage fallback={Platform.OS === 'android'} source={source} style={styles.image} />

        <Pressable style={styles.favorite} onPress={onChangeFavorite}>
          <Fontisto name="heart" size={15} color={checkIsFav(post.id) ? colorStyle : 'black'} />
        </Pressable>
      </View>

      {/* Bed and Bedroom */}
      <SizedBox height={10} />
      <View style={styles.contentContainer}>
        <View style={global.flex}>
          <Text text={post.title} weight="bold" size="sm" />
          <SizedBox height={2} />
          <Text
            text={post.description}
            weight="400"
            size="xs"
            numberOfLines={1}
            color={colors.palette.textInverse300}
          />
          <SizedBox height={2} />
          <Text
            text={`${post.bedroom} bedrooms | ${post.bathroomNumber} bathrooms`}
            weight="400"
            size="xs"
            numberOfLines={1}
            color={colors.palette.textInverse300}
          />

          <Text style={styles.prices}>
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
        </View>
        <SizedBox width={20} />
        {/* <View style={styles.starContainer}>
          <Icon icon="starFilled" size={15} />
          <SizedBox width={4} />
          <Text text="4.6" size="sm" />
        </View> */}
      </View>
    </Pressable>
  );
};

export default React.memo(Post);
