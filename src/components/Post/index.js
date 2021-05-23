import React from "react";
import {View, Image ,Text} from "react-native";
import styles from './styles.js';

const Post = (props) => {
    return(
        <View style={styles.container}>
            {/* Image */}
            <Image style={styles.image}
            source={{uri: "https://rentalhousingjournal.com/wp-content/uploads/2019/01/1-25-19-renters-spend-more-for-studio-apartments.png"}}/>
            {/* Bed and Bedroom */}

            <Text style={styles.bedrooms}>
                1 bed 1 bedroom
            </Text>

            {/* Type and Description */}
            <Text style={styles.description} numberOfLines={2}>
                Entire Flat Located in Abuakwa Sepaase
            </Text>
            {/* Old and new Price */}
            <Text style={styles.prices}>
                <Text style={styles.oldPrice}>
                    $36
                      
                </Text>
                <Text style={styles.newPrice}>
                      $30 / night
                </Text>
            </Text>
            {/* Total price */}
            <Text style={styles.totalPrice}>
                $100
            </Text>
        </View>
    );
};

export default Post;