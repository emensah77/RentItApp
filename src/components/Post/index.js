import React, {useState} from "react";
import {View, Image ,Text, Pressable} from "react-native";
import styles from './styles.js';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from "react-native-vector-icons/Fontisto";
const days = 1;
const Post = (props) => {

    const [count, setCount] = useState(0)
    const[isLike, setIsLike] = useState(false);

    const colorStyle = "blue"

    const handleClick = () => {
        setIsLike(!isLike);
    }


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
                GH₵{post.oldPrice}
                </Text>
                <Text style={styles.newPrice}>
                GH₵{post.newPrice} / year
                </Text>
                
                
            </Text>
            {/* Total price */}
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={styles.totalPrice}>
                        GH₵{post.newPrice * days}
                    </Text>
                <View  style={{padding:5,}}>
                        <Pressable onPress={handleClick}>
                            
                            <Fontisto name="heart" size={30} color={isLike ? colorStyle : "yellow"}/>
                        </Pressable>
                    </View>
                    
            </View>
            
        </Pressable>
    );
};

export default Post;