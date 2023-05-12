import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import styles from './HomesCard.styles';

export default () => (
  <TouchableOpacity activeOpacity={0.8} style={styles.container}>
    <Image
      style={styles.image}
      source={{
        uri: 'https://assets-news.housing.com/news/wp-content/uploads/2020/05/04190400/17-fabulous-bedroom-decor-ideas-FB-1200x700-compressed-1200x700.jpg',
      }}
    />

    <View style={styles.mainPadding}>
      <Text style={styles.title}>Manchester</Text>
      <Text style={styles.description}>Private room in home hosted by UiClones</Text>
      <View style={styles.line} />
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.cardFooterTitle}>Feb {'\n'}13 -14</Text>
          <Text style={styles.cardFooterDescription}>2023</Text>
        </View>
        <View style={styles.cardFooterRightSection}>
          <Text style={styles.cardFooterTitle}>Greater Manchester</Text>
          <Text style={styles.cardFooterDescription}>United Kingdom</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);
