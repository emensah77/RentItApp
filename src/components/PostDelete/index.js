import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import useVisibility from '../../hooks/useVisibility';
import styles from './styles';

const days = 1;
const PostDelete = props => {
  //   const {user, logout} = useContext(AuthContext);
  const likeVisiblity = useVisibility();

  const colorStyle = 'white';

  const {post} = props;
  const navigation = useNavigation();

  const goToPostPage = useCallback(() => {
    navigation.navigate('Post', {postId: post.id});
  }, [navigation, post.id]);

  //   const deletePost = postId => {
  //     if (user.uid === post.userId) {
  //       firestore()
  //         .collection('posts')
  //         .doc(postId)
  //         .delete()
  //         .then(() => {
  //           console.log('User deleted!');
  //         });
  //     }
  //   };

  return (
    <Pressable onPress={goToPostPage} style={styles.container}>
      {/* Image */}
      <View>
        <Image style={styles.image} source={{uri: post.image}} />
        <Pressable style={styles.button} onPress={likeVisiblity.toggle}>
          <Fontisto name="heart" size={30} color={likeVisiblity.visible ? colorStyle : 'yellow'} />
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
