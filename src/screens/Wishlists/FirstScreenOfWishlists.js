import React from 'react';
import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './FirstScreenOfWishlists.styles';
import EmptyWishList from './components/EmptyWishList';
import WishListItem from './components/WishListItem';

export default () => (
  <SafeAreaView style={styles.container}>
    <View>
      <Text style={styles.title}>Wishlists</Text>
      <EmptyWishList />
      <WishListItem />
    </View>
  </SafeAreaView>
);
