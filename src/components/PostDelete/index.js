import React, {useEffect, useContext, useState} from 'react';
import {View, Image, TouchableOpacity, ImageBackground, Text, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import firestore from '@react-native-firebase/firestore';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {AuthContext} from '../../navigation/AuthProvider';
import styles from './styles.js';

const days = 1;
const PostDelete = props => {
  const {user, logout} = useContext(AuthContext);

  const [isLike, setIsLike] = useState(false);

  const colorStyle = 'white';

  const handleClick = () => {
    setIsLike(!isLike);
  };

  const {post} = props;
  const navigation = useNavigation();
  const goToPostPage = () => {
    navigation.navigate('Post', {postId: post.id});
  };

  const deletePost = postId => {
    if (user.uid === post.userId) {
      firestore()
        .collection('posts')
        .doc(postId)
        .delete()
        .then(() => {
          console.log('User deleted!');
        });
    }
  };

  return (
    <Pressable onPress={goToPostPage} style={styles.container}>
      {/* Image */}
      <View>
        <Image style={styles.image} source={{uri: post.image}} />
        <Pressable
          style={{
            padding: 15,
            right: 0,
            top: 0,
            position: 'absolute',
            backgroundColor: 'transparent',
          }}
          onPress={handleClick}>
          <Fontisto name="heart" size={30} color={isLike ? colorStyle : 'yellow'} />
        </Pressable>
      </View>

      {/* Bed and Bedroom */}
      <View>
        <Text style={styles.bedrooms}>
          {post.bed} bed{post.bedrooms} bedrooms
        </Text>

        {/* Type and Description */}
        <Text style={styles.description} numberOfLines={2}>
          {post.type}.{post.title}
        </Text>
        {/* Old and new Price */}

        <Text style={styles.prices}>
          <Text style={styles.oldPrice}>
            GH₵
            {post.oldPrice}
          </Text>
          <Text style={styles.newPrice}>GH₵{post.newPrice} / year</Text>
        </Text>
        {/* Total price */}

        <Text style={styles.totalPrice}>
          GH₵
          {post.newPrice * days}
        </Text>
      </View>
      {/* <TouchableOpacity onPress={() => deletePost(post.id)} style={{right:0,top:-55,flex:1, flexDirection:'row',justifyContent:'flex-end'}}>
                <FontAwesomeIcon icon={faTrash} size={25} color={'blue'}/>
            </TouchableOpacity> */}
    </Pressable>
  );
};

export default PostDelete;
