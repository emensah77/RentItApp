import React from "react";
import {View, Image ,Text, ScrollView, Platform, Linking ,Pressable} from "react-native";
import styles from './styles.js';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {FlatListSlider} from 'react-native-flatlist-slider';
import { withAuthenticator } from 'aws-amplify-react-native';
import Amplify from '@aws-amplify/core';
import Feather from 'react-native-vector-icons/Feather';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils , faFaucet, faBath, faBed, faToilet} from '@fortawesome/free-solid-svg-icons'



const DetailedPost = (props) => {


    const makeCall = () => {

        let phoneNumber = '';
    
        if (Platform.OS === 'android') {
          phoneNumber = 'tel:${0552618521}';
        } else {
          phoneNumber = 'telprompt:${0552618521}';
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
                    GH₵{post.oldPrice} 
                    </Text>
                    <Text style={styles.newPrice}>
                    GH₵{post.newPrice} / year
                    </Text>
                </Text>
                {/* Total price */}
                <Text style={styles.totalPrice}>
                GH₵{post.totalPrice}
                </Text>
                

                <Text style={styles.longDescription}>
                    {post.description}
                </Text>

                <Text style={{margin: 10, fontSize:20, fontFamily:"Montserrat-Bold"}}>
                    Amenities available
                </Text>
                <View style={{margin:10, padding:1, flex:1, flexDirection:'row', justifyContent:"space-between"}}>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>Wifi <Feather name="wifi" size={25} color={'blue'}/></Text>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>{post.wifi}</Text>
                </View>
                <View style={{margin:10, padding:1, flex:1, flexDirection:'row', justifyContent:"space-between"}}>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>Kitchen <FontAwesomeIcon icon={faUtensils} color={'blue'}/></Text>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>{post.kitchen}</Text>
                </View>
                <View style={{margin:10, padding: 1, flex:1, flexDirection:'row', justifyContent:"space-between"}}>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>Bathroom <FontAwesomeIcon icon={faBath} size={25} color={'blue'}/></Text>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>{post.bathroom}</Text>
                </View>
                <View style={{margin:10, padding:1, flex:1, flexDirection:'row', justifyContent:"space-between"}}>
                    <Text style={{color:'blue',fontSize:18, fontWeight:'bold'}}>Bedroom <FontAwesomeIcon icon={faBed} size={25} color={'blue'}/></Text>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>{post.bed}</Text>
                </View>
                <View style={{margin:10, padding:1, flex:1, flexDirection:'row', justifyContent:"space-between"}}>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>Water <FontAwesomeIcon icon={faFaucet} size={25} color={'blue'}/></Text>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>{post.water}</Text>
                </View>
                <View style={{margin:10, padding:1, flex:1, flexDirection:'row', justifyContent:"space-between"}}>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>Toilet <FontAwesomeIcon icon={faToilet} size={25} color={'blue'}/></Text>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>{post.toilet}</Text>
                </View>
       
                
                
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