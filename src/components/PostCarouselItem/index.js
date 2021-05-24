import React from "react";
import {View, Image ,Text} from "react-native";
import useWindowDimensions from "react-native/Libraries/Utilities/useWindowDimensions";
import styles from './styles.js';

const Post = (props) => {

    const post = props.post;
    const width = useWindowDimensions().width;
    return(
        <View style={styles.container, {width: width - 60}}>
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
                        </Text>
                        
                </View>
            </View>
            
        </View>
    );
};

export default Post;