import React, {useState} from "react";
import {View, Image ,Text, Pressable} from "react-native";
import useWindowDimensions from "react-native/Libraries/Utilities/useWindowDimensions";
import styles from './styles.js';
import {useNavigation} from '@react-navigation/native';
import Fontisto from "react-native-vector-icons/Fontisto";
const Post = (props) => {
    const [count, setCount] = useState(0)
    const[isLike, setIsLike] = useState(false);

    const colorStyle = "blue"

    const handleClick = () => {
        setIsLike(!isLike);
    }

    const post = props.post;
    const width = useWindowDimensions().width;
    
    const navigation = useNavigation();
    const goToPostPage = () =>{
            navigation.navigate("Post", {postId: post.id});
    }
    
    
    return(
        <Pressable onPress={goToPostPage} style={styles.container, {width: width - 60}}>
            {/* Image */}
            <View style={styles.innerContainer}>
                <Image style={styles.image}
                source={{uri: post.image}}/>
                {/* Bed and Bedroom */}
                <View style={{flex: 1, marginHorizontal: 10}}>
                        <Text style={styles.bedrooms}>
                            {post.bed} bed {post.bedrooms} bedrooms
                        </Text>

                        {/* Type and Description */}
                        <Text style={styles.description} numberOfLines={2}>
                            {post.type}. {post.title}
                        </Text> 
                        {/* Old and new Price */}
                        <Text style={styles.prices}>
                            
                                
                          
                            <Text style={styles.newPrice}>
                                ${post.newPrice} / night
                            </Text>
                            <View  style={{paddingHorizontal: 30, paddingVertical:1}}>
                            <Pressable onPress={handleClick}>
                        
                            <Fontisto name="heart" size={20} color={isLike ? colorStyle : "yellow"}/>
                        </Pressable>
                </View>
                        </Text>

                        
                        
                </View>
            </View>
            
        </Pressable>
    );
};

export default Post;