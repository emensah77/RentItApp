import React, {useEffect, useContext,useState} from "react";
import {View, Image , Platform ,ImageBackground,Text, Pressable} from "react-native";
import styles from './styles.js';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from "react-native-vector-icons/Fontisto";
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../navigation/AuthProvider';
import FastImage from 'react-native-fast-image';
import {SharedElement} from 'react-navigation-shared-element';
const days = 1;

const Post = (props) => {
    var docRefId;
    let docId;
    const {user, logout} =  useContext(AuthContext);
    const addToTrends = async () => {
    firestore()
    .collection('trends')
    .doc(post.id)
    .set({
        
        image: post.image,
        type: post.type,
        title: post.title,
        description: post.description,
        
        bed: post.bed,
        bedroom: post.bedroom,
        maxGuests: post.maxGuests,
        wifi: post.wifi,
        kitchen: post.kitchen,
        bathroom: post.bathroom,
        water: post.water,
        toilet: post.toilet,
        images: post.images,
        
        
        oldPrice: post.oldPrice,
        newPrice: post.newPrice,
        count: counter,   
        
        latitude: post.latitude,
        longitude: post.longitude,
        id: post.id,
    })
    .then(() =>{
        console.log('Added to Trends');
    })
    .catch((error) => {
        console.log('Something went wrong adding to Trends', error);
    });



    }
    const updateTrendCount = async(postid, val) => {
        firestore()
        .collection('trends')
        .doc(postid)
        .update({
            count: firestore.FieldValue.increment (1)
        })
        .then(() => {
            console.log('User updated!');
        });
    }
    
    
    var rand;
    const addToFavorites =  () => {
    
    var randomString = (Math.random()*1e32).toString(36);
    rand = randomString;
    firestore()
    .collection('posts')
    .doc(rand)
    .set({
        userId: user.uid,
        image: post.image,
        type: post.type,
        title: post.title,
        description: post.description,
        randString: randomString,
        
        bed: post.bed,
        bedroom: post.bedroom,
        maxGuests: post.maxGuests,
        wifi: post.wifi,
        kitchen: post.kitchen,
        bathroom: post.bathroom,
        water: post.water,
        toilet: post.toilet,
        images: post.images,
        
        oldPrice: post.oldPrice,
        newPrice: post.newPrice,
        count: counter,
        liked: false,   
        
        latitude: post.latitude,
        longitude: post.longitude,
        id: post.id,
    })
    .then((docRef) =>{
        docRefId = docRef.id;
        docId = docRefId;
        
       
        
    })
    .catch((error) => {
        console.log('Something went wrong adding to Favorites', error);
    });
    }


    const [counter, setCount] = useState(0);
    const[isLike, setIsLike] = useState(false);
    
    const colorStyle = "deeppink"

    
    
    const handleClick = () => {
        var trendRef = firestore().collection('trends').doc(post.id);
        setIsLike(!isLike);
        
        
        
        if (!isLike){
            setCount(counter + 1);
            
            
            var getDoc = trendRef.get()
                .then(doc => {
                    if (!doc.exists) {
                        addToTrends();
                       
                    } else {
                        updateTrendCount(post.id, counter);
                        
                    }
                })
                .catch(err => {
                    console.log('Error getting document', err);
                });


            
            
            //console.log(post.id);
            addToFavorites();
            
            
        }
        
        

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
            
            <FastImage
                fallback={Platform.OS === 'android' ? true : false} 
                source={{
                        uri: post.image,
                        headers: {  Authorization: 'someAuthToken' },
                        priority: FastImage.priority.high,
                        
                        }}
                        style={styles.image}/>
                
            
                <Pressable  style={{
                shadowColor:"black", shadowOpacity:.5, shadowRadius:30, margin: 8, right:0, top:5, position: 'absolute'
                ,height:40, width:40, backgroundColor:"white", elevation:90,
                borderRadius:20, justifyContent:'center', alignItems:"center"}} onPress={handleClick}>
                            
                            <Fontisto name="heart" size={20} color={isLike ? colorStyle : "dimgrey"}/>
                        </Pressable>
                <View style={{
                shadowColor:"black", shadowOpacity:.5, shadowRadius:30, margin: 10, left:0, top:5, position: 'absolute'
                ,height:40, width:100, backgroundColor:"white", elevation:90,
                borderRadius:15, justifyContent:'center', alignItems:"center"}}>
                    <Text adjustsFontSizeToFit={true} style={{fontSize:16, fontWeight:'bold'}}>{post.mode === "For Sale" ? "FOR SALE":"FOR RENT"}</Text>
                </View>
            </View>
            
            {/* Bed and Bedroom */}

            <Text style={styles.bedrooms}>
                {post.bed} bedrooms | {post.bathroomNumber} bathrooms
            </Text>

            {/* Type and Description */}
            <Text style={styles.description} numberOfLines={2}>
                {post.type}. {post.title}
            </Text> 
            {/* Old and new Price */}
            
            <Text style={styles.prices}>
                {/* <Text style={styles.oldPrice}>
                GH₵{post.oldPrice}
                </Text> */}
                <Text style={styles.newPrice}>
                GH₵{Math.round(post.newPrice * 1.07)} / year
                </Text>
                
                
            </Text>
            {/* Total price */}
            
                {/* <Text style={styles.totalPrice}>
                        GH₵{Math.round(post.newPrice * 1.07)}
                    </Text> */}
                
                        
                  
            
        </Pressable>
    );
};

export default Post;