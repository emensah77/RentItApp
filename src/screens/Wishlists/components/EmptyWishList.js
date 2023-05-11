import React from 'react';
import {Text} from 'react-native';
import styles from '../FirstScreenOfWishlists.styles';

export default () => (
  <>
    <Text style={styles.subTitle}>Create your wishlist</Text>

    <Text style={styles.body}>
      As you search, tap the heart icon to save your favourite places to stay or things to do to a
      wishlist.
    </Text>
  </>
);
