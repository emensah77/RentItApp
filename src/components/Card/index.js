/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Dimensions, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Card = props => {
  const {post} = props;
  const navigation = useNavigation();
  const goToPostPage = () => {
    navigation.navigate('Post', {postId: post.id});
  };

  return (
    <TouchableOpacity onPress={goToPostPage}>
      <View style={styles.card}>
        <View style={{alignItems: 'flex-end'}}>
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
            }}
          >
            <FontAwesome name="heart-o" size={18} color="black" />
          </View>
        </View>
        <View style={{height: 100, width: 100, alignItems: 'center'}}>
          <Image
            style={{
              borderRadius: 10,
              height: '100%',
              width: '100%',
              flex: 1,
              resizeMode: 'cover',
            }}
            source={{uri: post.image}}
          />
        </View>
        <Text style={{fontWeight: 'bold', fontSize: 14, marginTop: 10}}>{post.title}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
          }}
        >
          <Text style={{fontSize: 14, fontWeight: 'bold'}}>${post.newPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  card: {
    height: 225,
    backgroundColor: 'lightgrey',
    width: Dimensions.get('screen').width / 2 - 30,
    marginHorizontal: 2,
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
  },
});
export default Card;
