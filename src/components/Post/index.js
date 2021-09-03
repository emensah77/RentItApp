import React, {useState} from "react";
import {View, Image , ImageBackground,Text, Pressable} from "react-native";
import styles from './styles.js';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from "react-native-vector-icons/Fontisto";
const days = 1;
const Post = (props) => {

    const [count, setCount] = useState(0)
    const[isLike, setIsLike] = useState(false);
    //const [trending, setTrending] = useState([]);
    const trending = [];
    const colorStyle = "white"
    
    const handleClick = () => {
        setIsLike(!isLike);
        //setTrending(prev => [...prev, {post}]);
        //console.log(trending);
        trending.push(post);
        console.log(trending.length)

    }


    const post = props.post;
    const navigation = useNavigation();
    const goToPostPage = () =>{
            navigation.navigate("Post", {postId: post.id});
    }


    return(
        <Pressable onPress={goToPostPage} style={styles.container}>
            {/* Image */}
            <View >
            <Image style={styles.image}
                source={{uri: post.image}}/>
                <Pressable  style={{padding: 15, right:0, top:0, position: 'absolute'
            ,backgroundColor: 'transparent'}} onPress={handleClick}>
                            
                            <Fontisto name="heart" size={30} color={isLike ? colorStyle : "yellow"}/>
                        </Pressable>
            </View>
            
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
            
                <Text style={styles.totalPrice}>
                        GH₵{post.newPrice * days}
                    </Text>
                
                        
                  
            
        </Pressable>
    );
};

export default Post;