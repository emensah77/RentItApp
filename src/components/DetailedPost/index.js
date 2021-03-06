import React, {useEffect,useContext, useState} from "react";
import {View, Image ,Text, ScrollView, Platform, Linking ,Pressable, StatusBar} from "react-native";
import styles from './styles.js';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {FlatListSlider} from 'react-native-flatlist-slider';
import { withAuthenticator } from 'aws-amplify-react-native';
import Amplify from '@aws-amplify/core';
import Feather from 'react-native-vector-icons/Feather';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils , faFan ,faFaucet, faBath, faBed, faToilet} from '@fortawesome/free-solid-svg-icons'
import firebase from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';
import { useNavigation , useRoute} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import ImageCarousel from '../../components/ImageCarousel';
import {SharedElement} from 'react-navigation-shared-element'
import FastImage from 'react-native-fast-image';
import {AuthContext} from '../../navigation/AuthProvider';
const uploadusers = ["UWHvpJ1XoObsFYTFR48zYe6jscJ2","7WGODlIhvkXGhjpngLXxAnQihTK2", "lvtDmH13IRW1njCJKZyKsO2okKr1"]
const DetailedPost = (props) => {
    const post = props.post;
    const navigation = useNavigation();
    const route = useRoute();
    const {user, logout} = useContext(AuthContext);

    const randString = route.params.randString;
    

    const logAnalyticsEvent = async () =>{
        await analytics().logEvent('calltorent', {
            id: 3745092,
            item: 'Call to Rent Button Click',
            description: 'Clicked on the call to rent button'
            
        })
    }
    useEffect(() => {
        // console.log(post);
    },[])
    const payRent = () => {
        navigation.navigate('Address', {
            price: Math.round(post.newPrice*1.07), 
            homeimage: post.image,
            hometitle: post.title,
            homebed: post.bed,
            homelatitude: post.latitude,
            homelongitude: post.longitude,
            postid: post.id,
            

        });
    }
    const makeCall = () => {
        const phoneNumbers = ["0552618521", "0597285059", "0597285099", "0205200706", "0579535484"]
        
        let phoneNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
    
        if (Platform.OS === 'android') {
          phoneNumber = `tel:${phoneNumber}`;
        } else {
          phoneNumber = `telprompt:${phoneNumber}`;
        }
        try{
            Linking.openURL(phoneNumber);
        }
        catch(e){
            //console.log(e)
        }
        
      };

    

   

    return(
        <ScrollView showsVerticalScrollIndicator={false}>
            {/* Image */}
            <StatusBar hidden={true} />
            
            <ImageCarousel postId={post.id} images={post.images}/>
            
            
            
            <View style={styles.container}>
                
                {/* Bed and Bedroom */}
                <Text style={styles.description} numberOfLines={2}>
                    {post.title}
                </Text> 
                <View style={styles.hairline}/>
                <Text style={styles.bedrooms}>
                {post.type} | {post.bedroom} bedrooms | {post.bathroomNumber} bathrooms |
                </Text>
                {uploadusers.includes(user.uid) ? <Text>{post.phoneNumbers}</Text> : null}
                <Text style={styles.prices}>
                    {/* <Text style={styles.oldPrice}>
                    GH???{post.oldPrice} 
                    </Text> */}
                    <Text style={styles.newPrice}>
                    GH???{(Math.round(post.newPrice*1.07)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} / year
                    </Text>
                </Text>
                {/* Type and Description */}
                
                {/* Old and new Price */}
                <View style={styles.hairline}/>
                
                {/* Total price */}
                {/* <Text style={styles.totalPrice}>
                GH???{post.totalPrice}
                </Text> */}
                

                <Text style={styles.longDescription}>
                    {post.description}
                </Text>
                <View style={styles.hairline}/>

                <Text style={{margin: 10, fontSize:20, fontFamily:"Montserrat-Bold"}}>
                    Amenities available
                </Text>
                <View style={{margin:10, padding:1, flex:1, flexDirection:'row', justifyContent:"space-between"}}>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>Air Conditioner <FontAwesomeIcon icon={faFan}  size={25} color={'blue'}/></Text>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>{post.aircondition}</Text>
                </View>
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
                    backgroundColor: 'deeppink',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 50,
                    marginHorizontal: 20,
                    borderRadius: 25,
                    justifyContent: 'center'
                }}  onPress={() => {
                    payRent();
                    logAnalyticsEvent();
                }}>
                    <Fontisto name="credit-card" size={25} style={{color: 'white' , margin: 10 ,}} />
                    <Text style={{
                        fontSize: 20,
                        color: 'white',
                        fontWeight: 'bold',
                    }}>Pay to Rent</Text>
            </Pressable> 
            <Pressable
                title="Call to Rent Event"
                
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
                }}  onPress={() => {
                    makeCall();
                    logAnalyticsEvent();
                }}>
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