import React from "react";
import {View, Image ,Text, Pressable} from "react-native";
import styles from './styles.js';
import {useNavigation} from '@react-navigation/native';
const Post = (props) => {

    const post = props.post;
    const navigation = useNavigation();
    const goToPostPage = () =>{
            navigation.navigate("Post", {postId: post.id});
    }


    return(
        <Pressable onPress={goToPostPage} style={styles.container}>
            {/* Image */}
            <Image style={styles.image}
            source={{uri: post.image}}/>
            {/* Bed and Bedroom */}

            <Text style={styles.bedrooms}>
                {post.bed} bed {post.bedrooms} bedrooms
            </Text>

            {/* Type and Description */}
            <Text style={styles.description} numberOfLines={2}>
                {post.type}. {post.title}
            </Text> 
            {/* Old and new Price */}
            <Text style={styles.prices}>
                <Text style={styles.oldPrice}>
                    ${post.oldPrice}
                </Text>
                <Text style={styles.newPrice}>
                      ${post.newPrice} / night
                </Text>
            </Text>
            {/* Total price */}
            <Text style={styles.totalPrice}>
                ${post.totalPrice}
            </Text>
        </Pressable>
    );
};

export default Post;