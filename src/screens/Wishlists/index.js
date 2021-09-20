import React, { useContext, useEffect, useState } from 'react';
import {Share, FlatList ,StatusBar,View, SafeAreaView ,Dimensions, Text, Pressable, Image, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Post from '../../components/Post';
import PostDelete from '../../components/PostDelete';
import { AuthContext } from '../../navigation/AuthProvider';

const Wishlists = (props) => {
    const {user, logout} =  useContext(AuthContext);
    const navigation = useNavigation();
    
    const[loading, setLoading] = useState(true);
    const[posts, setPosts] = useState([]);
    
    
    useEffect ( () => {
        const fetchPosts = async () => {
            try{
                const favorite = [];
        
                await firestore()
                .collection('posts')
                .get()
                .then((querySnapshot) =>{
                    
                    querySnapshot.forEach(doc => {
                        const{
                            userId,
                            image, 
                            type,
                            title,
                            description,
                            bed, 
                            bedroom,
                            maxGuests,
                            wifi,
                            kitchen,
                            bathroom,
                            water,
                            toilet,
                            image2, 
                            image3, 
                            image4, 
                            image5,
                            
                            oldPrice,
                            newPrice,
                                 
                            
                            latitude,
                            longitude,
                            id,
                        } = doc.data();
                        if (user.uid === userId && !favorite.some(e => e.id === id)){
                        favorite.push({
                            userId: userId,
                            image: image,
                            type: type,
                            title: title,
                            description: description,
                            
                            bed: bed,
                            bedroom: bedroom,
                            maxGuests: maxGuests,
                            wifi: wifi,
                            kitchen: kitchen,
                            bathroom: bathroom,
                            water: water,
                            toilet: toilet,
                            image2: image2, 
                            image3: image3, 
                            image4: image4, 
                            image5: image5,
                            
                            oldPrice: oldPrice,
                            newPrice: newPrice,
                                 
                            
                            latitude: latitude,
                            longitude: longitude,
                            
    
                        }) }
                    })
                })
                    
                    setPosts(favorite);
               

                
                

                
            } catch (e){
                console.log(e);
            }
        }

        fetchPosts();
    })


    
    
    
    
        if (posts.length > 0){
            return (
                <View style={{
                    backgroundColor: "#fff",
                    flex: 1,
                    paddingBottom:180,
        
                }}>
                    <StatusBar hidden={true}/>
                    <View style={{
                        backgroundColor:'#00008b',
                        height:"25%",
                        borderBottomLeftRadius:20,
                        borderBottomRightRadius: 20,
                        paddingHorizontal:20,
                        justifyContent:'center'
                    }}>
                        <View style={{paddingTop:15 }}>
                            <Text style={{fontSize:32, color:'white', fontFamily:'Montserrat-Bold'}}>Wishlists</Text>
                        </View>
                        
                        
                        
        
        
                    </View>
                
            <View style={{padding:15}} >
                    <Text 
                    style={{
                    fontFamily:'Montserrat-Bold',
                    fontSize:20
                    }}>Your Favorites</Text>
                    

                </View>
                
                <View>
                    <FlatList
                    data={posts}
                    renderItem={({item}) => <PostDelete post={item}/>}
                    
                    />
                </View>

                </View>
            );
        }
    
    else{    
    
    return (
        <View style={{
            backgroundColor: "#fff",
            flex: 1,

        }}>
            <StatusBar hidden={true}/>
            <View style={{
                backgroundColor:'#00008b',
                height:"25%",
                borderBottomLeftRadius:20,
                borderBottomRightRadius: 20,
                paddingHorizontal:20,
                justifyContent:'center'
            }}>
                <View style={{paddingTop:15 }}>
                    <Text style={{fontSize:32, color:'white', fontFamily:'Montserrat-Bold'}}>Wishlists</Text>
                </View>
                

                


            </View>
            
            <View style={{padding:15}} >
                    <Text 
                    style={{
                    fontFamily:'Montserrat-Bold',
                    fontSize:20
                    }}>No saves yet</Text>
                    <View style={{padding:10}}>
                        <Text style={{fontSize:16, fontFamily:'Montserrat-Regular'}}>Start planning what's next: As you search, tap the 
                            heart icon to save your favorite places to stay or things 
                            to do here.
                        </Text>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('Welcome')}
                    style={{
                        alignItems:'center',
                        justifyContent:'center',
                        borderWidth:1, borderColor:'black',
                        width:'50%', height:'20%', 
                        
                        borderRadius:10}}>
                        <Text style={{
                            fontSize:16,
                            fontFamily:'Montserrat-Bold'
                        }}>Start exploring</Text>
                    </TouchableOpacity>
                </View>
           

        </View>
    );
                    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        
    },

})


export default Wishlists;