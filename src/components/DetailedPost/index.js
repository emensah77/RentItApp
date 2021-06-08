import React from "react";
import {View, Image ,Text, ScrollView, Platform, Linking ,Pressable} from "react-native";
import styles from './styles.js';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {FlatListSlider} from 'react-native-flatlist-slider';
import { withAuthenticator } from 'aws-amplify-react-native';
import Amplify from '@aws-amplify/core';


const DetailedPost = (props) => {


    const makeCall = () => {

        let phoneNumber = '';
    
        if (Platform.OS === 'android') {
          phoneNumber = 'tel:${1234567890}';
        } else {
          phoneNumber = 'telprompt:${1234567890}';
        }
    
        Linking.openURL(phoneNumber);
      };

    const post = props.post;

    const images = [
        {
            image: post.image2
        }, 
        {
            image: post.image3
        },
        {
            image: post.image4
        },
        {
            image: post.image5
        },

    ]

    return(
        <ScrollView>
            <View style={styles.container}>
                {/* Image */}
                <FlatListSlider 
                    data={images} 
                    indicatorActiveWidth={15}
                    indicatorActiveColor={'blue'}
                    animation
                />
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

                <Text style={styles.longDescription}>
                    {post.description}
                </Text>
                
                
            </View>


            <View style={{margin: 20}}>
            <Pressable
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginBottom: 20,
                    backgroundColor: 'blue',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 50,
                    marginHorizontal: 20,
                    borderRadius: 25,
                    justifyContent: 'center'
                }}  onPress={makeCall}>
                    <Fontisto name="phone" size={25} style={{color: 'white' , margin: 10 ,transform: [{ rotate: '90deg' }]}} />
                    <Text style={{
                        fontSize: 20,
                        color: 'white',
                        fontWeight: 'bold',
                    }}>Call to Rent</Text>
                </Pressable>
            </View>
        </ScrollView>

    
    );
};

export default (DetailedPost);