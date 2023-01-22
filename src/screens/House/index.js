import React, { useContext, useEffect, useState } from 'react';
import {Share, StatusBar,View, FlatList ,SafeAreaView ,Dimensions, Text, Pressable, Image, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../navigation/AuthProvider';
import Post from '../../components/Post';
import {  faHouseUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import LinearGradient from 'react-native-linear-gradient';
const House = (props) => {
    const {user, logout} =  useContext(AuthContext);
    const navigation = useNavigation();
    const[posts, setPosts] = useState([]);
    const[loading, setLoading] = useState(true);
    const route = useRoute();
    

    const renderItem = ({ item }) => (
        <Pressable 
         onPress={() => navigation.navigate('HouseDetails', {
             houseimage: item.image,
             housetitle: item.title,
             houseamount: item.amount,
             houselatitude: item.latitude,
             houselongitude: item.longitude,
             houseyears: item.homeyears,
             housemonths: item.homemonths,
             confirmCode: item.confirmCode,
         })}
         style={{flex:1, flexDirection:'row', 
        marginHorizontal:20, paddingBottom:20, justifyContent:'flex-start', }}> 
            <Image
            source={{uri:item.image}}
            style={{width:150, height:150, borderRadius:15,
                
            }}
            />
            <View style={{flex:1, marginHorizontal:15}}>
            <Text style={{
                fontFamily:'Montserrat-Bold'}} numberOfLines={1}>{item.title}</Text>
            <Text style={{
                fontFamily:'Montserrat-Bold'}}>GH₵ {item.amount}</Text>
            <Text style={{
                fontFamily:'Montserrat-Bold'}}>{item.bed} bedrooms</Text>
            <Text style={{
                fontFamily:'Montserrat-Bold'}}>Payment Status: {item?.paymentStatus}</Text>
            </View>
            
        </Pressable>
      );
    
    useEffect ( () => {
        const fetchOrders = async () => {
            try{
                const orders = [];
        
                await firestore()
                .collection('homeorders')
                .get()
                .then((querySnapshot) =>{
                    
                    querySnapshot.forEach(doc => {
                        const{
                            userId,
                            userName,
                            image, 
                            title,
                            bed,
                            homeid,
                            homeyears,
                            homemonths,
                            confirmCode,
                            amount, 
                            latitude,
                            longitude                            
                        } = doc.data();
                        if (user.uid === userId && !orders.some(e => e.homeid === homeid)){
                        orders.push({
                            userId: userId,
                            userName: userName,
                            image: image,
                            title: title,
                            homeid: homeid,
                            homeyears: homeyears,
                            homemonths: homemonths,
                            confirmCode: confirmCode,
                            bed: bed,
                            latitude: latitude,
                            longitude: longitude,
                            amount: amount,
                            paymentStatus: doc?.data()?.paymentStatus
                        }) }
                    })
                })
                    
                    setPosts(orders);
                    if(loading){
                        setLoading(false);
                    }
                    
               

                
                

                
            } catch (e){
                console.log(e);
            }
        }

        fetchOrders();
    })
   

    

    
    
    
    
        if (posts.length > 0){
            return (
                <View style={{
                    backgroundColor: "#fff",
                    flex: 1,
                    paddingBottom:180,
        
                }}>
                    <StatusBar hidden={true}/>
                    <LinearGradient
                    colors={['#ff0084', '#33001b' ]}
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
                            <Text style={{fontSize:32, color:'white', fontFamily:'Montserrat-Bold'}}>Your Home</Text>
                        </View>
                        
                        
                        
        
        
                    </LinearGradient>
                
            <View style={{padding:15}} >
                    <Text 
                    style={{
                    fontFamily:'Montserrat-Bold',
                    fontSize:20
                    }}>Homes you have rented</Text>
                    

                </View>
                
                <View>
                    <FlatList
                    data={posts}
                    renderItem={renderItem}
                    

                    
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
            <LinearGradient
             colors={['#ff0084', '#33001b' ]}
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
                    <Text style={{fontSize:32, color:'white', fontFamily:'Montserrat-Bold'}}>Your Home</Text>
                </View>
                

                


            </LinearGradient>
            <View style={{padding:15}} >
                    <Text 
                    style={{
                    fontFamily:'Montserrat-Bold',
                    fontSize:20
                    }}>No Home yet</Text>
                    <View style={{padding:10}}>
                        <Text style={{fontSize:16, fontFamily:'Montserrat-Regular'}}>
                            You have not rented a house yet. If you rent a house, you should check
                            here to receive details about the address of the house, when to move in, and 
                            other details here.
                        </Text>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('Welcome')}
                    style={{
                        alignItems:'center',
                        justifyContent:'center',
                        alignSelf: 'center',
                        borderWidth:1, borderColor:'black',
                        width:'90%', height:'50%', 
                        
                        borderRadius:10}}>
                        <FontAwesomeIcon icon={faHouseUser} size={75} color="black" />  
                        <Text style={{
                            fontSize:16,
                            fontFamily:'Montserrat-Bold'
                        }}>Find your next Home</Text>
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


export default House;