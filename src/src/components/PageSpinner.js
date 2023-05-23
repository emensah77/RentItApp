import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const PageSpinner = () => {
  return (
    <View style={styles.pageSpinner}>
      <ActivityIndicator size="large" color="blue" />
    </View>
  );
};

const styles = StyleSheet.create({
  pageSpinner: {
    marginVertical: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default PageSpinner;
