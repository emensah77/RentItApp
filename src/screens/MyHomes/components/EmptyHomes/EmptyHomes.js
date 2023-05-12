import React, {memo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './EmptyHomes.styles';

export default memo(() => (
  <View style={[styles.container, styles.mainPadding]}>
    <Text style={styles.title}>No homes booked ... yet!</Text>
    <View style={styles.box} />
    <Text style={styles.description}>
      Time to dust off your bags and start planning your next adventure
    </Text>

    <TouchableOpacity style={styles.searchButton}>
      <Text style={styles.searchButtonText}>Start searching</Text>
    </TouchableOpacity>

    <View style={styles.line} />

    <View>
      <Text style={styles.reservationTitle}>Can’t find your reservation here?</Text>
      <TouchableOpacity>
        <Text style={styles.reservationHelpCenterText}>Visit the Help Centre</Text>
      </TouchableOpacity>
    </View>
  </View>
));
