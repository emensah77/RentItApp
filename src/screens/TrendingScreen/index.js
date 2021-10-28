import React, { useContext, useEffect, useState } from 'react';
import {Share, StatusBar,View, FlatList ,SafeAreaView ,Dimensions, Text, Pressable, Image, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../navigation/AuthProvider';
import Post from '../../components/Post';
import LinearGradient from 'react-native-linear-gradient';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

const Trending = (props) => {
    const {user, logout} =  useContext(AuthContext);
    const navigation = useNavigation();
    const[posts, setPosts] = useState([]);
    const[loading, setLoading] = useState(true);
    
    useEffect ( () => {
        const fetchPosts = async () => {
            try{
                const favorite = [];
        
                await firestore()
                .collection('trends')
                .orderBy('count', 'desc')
                .get()
                .then((querySnapshot) =>{
                    
                    querySnapshot.forEach(doc => {
                        const{
                            
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
                            images,
                            
                            oldPrice,
                            newPrice,
                            count,
                                 
                            
                            latitude,
                            longitude,
                            id,
                        } = doc.data();
                        
                        favorite.push({
                            
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
                            images: images,
                            
                            oldPrice: oldPrice,
                            newPrice: newPrice,
                            count: count,
                                 
                            
                            latitude: latitude,
                            longitude: longitude,
                            id: id,
    
                        }) 
                    })
                })
                    
                    setPosts(favorite);
                    if(loading){
                        setLoading(false);
                    }
               

                
                

                
            } catch (e){
                console.log(e);
            }
        }

        fetchPosts();
    })


    
    
    
    
        if (posts){
            return (
                <View style={{
                    backgroundColor: "#fff",
                    flex: 1,
                    paddingBottom:180,
        
                }}>
                    <StatusBar hidden={true}/>
                    <LinearGradient
                    colors={['purple', 'deeppink' ]}
                    start={{ x: 0.1, y: 0.2 }}
                    end={{ x: 1, y: 0.5 }}
                     style={[{
                        
                        height:"25%",
                        borderBottomLeftRadius:20,
                        borderBottomRightRadius: 20,
                        paddingHorizontal:20,
                        justifyContent:'center'
                    }]}>
                        <View style={{paddingTop:15 }}>
                            <Text style={{fontSize:32, color:'white', fontFamily:'Montserrat-Bold'}}>Trending</Text>
                        </View>
                        
                        
                        
        
        
                    </LinearGradient>
                
            <View style={{padding:15}} >
                    <Text 
                    style={{
                    fontFamily:'Montserrat-Bold',
                    fontSize:20
                    }}>Most Popular</Text>
                    

                </View>
                {loading ?
                <View
         
        
                style={{
                    flex:1, marginVertical:20 ,paddingLeft:20, marginHorizontal:20, justifyContent:'flex-start', alignContent:"center" }}>
                    
                    <SkeletonContent
                    containerStyle={{paddingBottom:100, width: 300}}
                    animationDirection="horizontalLeft"
                    layout={[
                        // long line
                        { width: 320, height: 220, marginBottom: 10, borderRadius:10 },
                        { width: 220, height: 20, marginBottom: 6 },
                        // short line
                        { width: 90, height: 20, marginBottom: 20 },
        
                        { width: 320, height: 220, marginBottom: 10, borderRadius:10 },
                        { width: 220, height: 20, marginBottom: 6 },
                        // short line
                        { width: 90, height: 20, marginBottom: 20 },
        
                        { width: 320, height: 220, marginBottom: 10, borderRadius:10},
                        { width: 220, height: 20, marginBottom: 6 },
                        // short line
                        { width: 90, height: 20, marginBottom: 20 },
                        
                        // ...
                    ]}
                    >
                        
                    
                    </SkeletonContent>
                </View>
                :
                <View>
                    <FlatList
                    data={posts}
                    renderItem={({item}) => <Post post={item}/>}
                    
                    />
                </View>
        }
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
            <LinearGradient
            colors={['purple', 'deeppink' ]}
            start={{ x: 0.1, y: 0.2 }}
            end={{ x: 1, y: 0.5 }}
            style={[{
                backgroundColor:'blue',
                height:"25%",
                borderBottomLeftRadius:20,
                borderBottomRightRadius: 20,
                paddingHorizontal:20,
                justifyContent:'center'
            }]}>
                <View style={{paddingTop:15 }}>
                    <Text style={{fontSize:32, color:'white', fontFamily:'Montserrat-Bold'}}>Trending</Text>
                </View>
                

                


            </LinearGradient>
            <View style={{padding:15}} >
                    <Text 
                    style={{
                    fontFamily:'Montserrat-Bold',
                    fontSize:20
                    }}>No trends yet</Text>
                    <View style={{padding:10}}>
                        <Text style={{fontSize:16, fontFamily:'Montserrat-Regular'}}>
                            As you browse through the listings, be sure to love your Favorites
                            and check back here to see the properties our community loves.
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


export default Trending;