import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const PageSpinner = () => {
  return (
    <View accessible accessibilityLabel="loading" style={styles.pageSpinner}>
      <ActivityIndicator size="large" color="#194CC3" />
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
});

export default PageSpinner;
