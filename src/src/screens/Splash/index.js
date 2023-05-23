import React, {useEffect} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Onboarding');
    }, 1000);
  }, []);
  return (
    <View style={styles.home}>
      <Image
        source={{uri: 'https://i.postimg.cc/Qd4fJmzz/rentit.jpg'}}
        resizeMode="contain"
        style={{width: 200, height: 200}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  home: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default Splash;
