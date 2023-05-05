import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Platform, Pressable, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import styles from './styles';

const Post = props => {
  const {post} = props;
  const {width} = useWindowDimensions();
  const navigation = useNavigation();

  const goToPostPage = useCallback(() => {
    navigation.navigate('Post', {postId: post.id});
  }, [navigation, post.id]);

  return (
    <Pressable
      onPress={goToPostPage}
      style={(styles.container, {width: width - 60, marginHorizontal: 5})}>
      {/* Image */}
      <View style={styles.innerContainer}>
        <FastImage
          fallback={Platform.OS === 'android'}
          source={{
            uri: post.image,
            headers: {Authorization: 'someAuthToken'},
            priority: FastImage.priority.high,
          }}
          style={styles.image}
        />
        {/* Bed and Bedroom */}
        <View style={styles.bedroom}>
          <Text style={styles.bedrooms}>
            {post.bed} bed{post.bedrooms} bedrooms
          </Text>

          {/* Type and Description */}
          <Text style={styles.description} numberOfLines={1}>
            {post.type}.{post.title}
          </Text>
          {/* Old and new Price */}
          <Text style={styles.prices}>
            <Text style={styles.newPrice}>
              GH₵
              {Math.round(post.newPrice * 1.07)} / year
            </Text>
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default Post;
