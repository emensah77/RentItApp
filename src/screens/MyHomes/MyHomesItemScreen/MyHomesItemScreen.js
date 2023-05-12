import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HomesCarousel from '../components/HomesCarousel/HomesCarousel';

import styles from './MyHomesItemScreen.styles';

export default () => (
  <View style={styles.container}>
    <HomesCarousel
      images={[
        'https://assets-news.housing.com/news/wp-content/uploads/2020/05/04190400/17-fabulous-bedroom-decor-ideas-FB-1200x700-compressed-1200x700.jpg',
        'https://stylesatlife.com/wp-content/uploads/2020/01/couples-master-bedroom-ideas.jpg',
        'https://i.pinimg.com/originals/cb/ce/38/cbce389eb00293757390d84707af2ec9.jpg',
        'https://88designbox.com/upload/2016/01/04/modern-bedroom-ideas-18.jpg',
      ]}
    />

    <Text style={styles.carouselTitle}>You’re all set for Manchester</Text>
    <View style={styles.stickyHeader}>
      <TouchableOpacity activeOpacity={0.6} style={styles.stickyHeaderButton}>
        <Icon name="close" size={20} style={styles.stickyHeaderIcon} />
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.6} style={styles.stickyHeaderButton}>
        <MaterialIcons name="share" size={20} style={styles.stickyHeaderIcon} />
      </TouchableOpacity>
    </View>
  </View>
);
