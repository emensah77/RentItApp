import React, {useEffect, useContext,useState} from "react";
import {View, Image , ImageBackground,Text, Pressable} from "react-native";
import styles from './styles.js';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from "react-native-vector-icons/Fontisto";
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../navigation/AuthProvider';
const days = 1;

const Post = (props) => {
    var docRefId;
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
        image2: post.image2, 
        image3: post.image3, 
        image4: post.image4, 
        image5: post.image5,
        
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
    const updateTrendCount = async(postid) => {
        firestore()
        .collection('trends')
        .doc(postid)
        .update({
            count: counter + 1
        })
        .then(() => {
            console.log('User updated!');
        });
    }

    
    
    const addToFavorites = async () => {
    firestore()
    .collection('posts')
    .add({
        userId: user.uid,
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
        image2: post.image2, 
        image3: post.image3, 
        image4: post.image4, 
        image5: post.image5,
        
        oldPrice: post.oldPrice,
        newPrice: post.newPrice,
        count: counter,   
        
        latitude: post.latitude,
        longitude: post.longitude,
        id: post.id,
    })
    .then((docRef) =>{
        docRefId = docRef.id;
        
        console.log('Added to Favorites');
    })
    .catch((error) => {
        console.log('Something went wrong adding to Favorites', error);
    });
    }


    const [counter, setCount] = useState(0);
    const[isLike, setIsLike] = useState(false);
    
    const colorStyle = "white"

    
    
    const handleClick = () => {
        var trendRef = firestore().collection('trends').doc(post.id);
        setIsLike(!isLike);
        
        
        
        if (!isLike){
            setCount(counter => counter + 1);
            
            var getDoc = trendRef.get()
                .then(doc => {
                    if (!doc.exists) {
                        addToTrends();
                        console.log('No such document!');
                    } else {
                        updateTrendCount(post.id);
                        console.log('Document data:', doc.data().image2);
                    }
                })
                .catch(err => {
                    console.log('Error getting document', err);
                });


            
            
            
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