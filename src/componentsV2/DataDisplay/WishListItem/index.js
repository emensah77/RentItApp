import React, {useCallback} from 'react';
import {Pressable, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Typography from '../Typography';
import {styles} from './styles';

const WishListItem = ({item}) => {
  const navigation = useNavigation();

  const goWishList = useCallback(() => {
    navigation.navigate('WishListItem', {item});
  }, [item]);

  return (
    <>
      <Pressable style={styles.content} onPress={goWishList}>
        {item?.image && (
          <Image
            source={{
              uri: item.image,
            }}
            width={75}
            height={75}
            resizeMode="contain"
          />
        )}

        <Typography style={styles.text} bold>
          {item.title}
        </Typography>
      </Pressable>
    </>
  );
};

export default WishListItem;
