import React, {useCallback, useMemo} from 'react';
import {Pressable, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Typography from '../Typography';
import {styles} from './styles';

const WishListItem = ({item}) => {
  const navigation = useNavigation();

  const goWishList = useCallback(() => {
    navigation.navigate('Post', {postId: item.id});
  }, [item.id, navigation]);

  const imageUri = useMemo(
    () => ({
      uri: item.image,
    }),
    [item.image],
  );

  return (
    <>
      <Pressable style={styles.content} onPress={goWishList}>
        {item?.image && (
          <Image
            source={imageUri}
            style={styles.image}
            width={75}
            height={75}
            resizeMode="contain"
          />
        )}

        <Typography style={styles.text} bold numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Typography>
      </Pressable>
    </>
  );
};

export default WishListItem;
