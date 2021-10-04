import React, {useEffect, useState} from 'react';
import {View, StatusBar,SafeAreaView,Dimensions, Image, Text, Pressable, ImageBackground, StyleSheet, TextInput, ScrollView, Platform} from 'react-native';
import {Auth} from 'aws-amplify';
import Swiper from 'react-native-swiper';
import {listPosts} from '../../graphql/queries';
import {API, graphqlOperation} from 'aws-amplify';
import {OptimizedFlatList} from 'react-native-optimized-flatlist'
import Post from '../../components/Post';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

const LowPriceScreen = (props) => {
    const[posts, setPosts] = useState([]);
    const[loading, setLoading] = useState(true);

    

    useEffect ( () => {
        const fetchPosts = async () => {
            try{
                const postsResult = await API.graphql(
                    graphqlOperation(listPosts, {
                  
                })
                )

                setPosts(postsResult.data.listPosts.items);
                if(loading){
                    setLoading(false);
                }
            } catch (e){
                console.log(e);
            }
        }

        fetchPosts();
    }, [])
    posts.sort(function (a, b) {
        return a.newPrice - b.newPrice;
      });
      //console.log(posts[0].image);


    var result = posts.map((a, b) => {a.newPrice, b.image});
    //console.log(result)

    return (
        <View style={{
            backgroundColor: "#fff",
            flex: 1,
            paddingBottom:180,

        }}>
            <StatusBar hidden={true}/>
            <View style={{
                backgroundColor:'blue',
                height:"25%",
                borderBottomLeftRadius:20,
                borderBottomRightRadius: 20,
                paddingHorizontal:20,
                justifyContent:'center'
            }}>
                <View style={{paddingTop:15 }}>
                    <Text style={{fontSize:32, color:'white', fontFamily:'Montserrat-Bold'}}>Discount</Text>
                </View>
                
                
                


            </View>
        
    <View style={{padding:15}} >
            <Text 
            style={{
            fontFamily:'Montserrat-Bold',
            fontSize:20,
            paddingBottom:10,
            }}>Most Affordable</Text>
            <Text 
            style={{
            fontFamily:'Montserrat-Regular',
            fontSize:18
            }}>The cheapest homes selected for you</Text>
            

        </View>
        {loading ?
                <View
         
        
                style={{
                     flex:1, marginVertical:20 ,paddingLeft:20, marginHorizontal:20, justifyContent:'flex-start', alignContent:"center" }} >
                    
                    <SkeletonContent
                    containerStyle={{paddingBottom:0, width: 300}}
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
            <OptimizedFlatList
            data={posts}
            renderItem={({item}) => <Post post={item}/>}
            
            />
        </View>
    }
        </View>

                
    );
                
                

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        
    },
    
    searchContainer: {
        paddingTop: Platform.OS === 'android' ? 10: 30,
        paddingLeft: 10,
    },
    UserGreetings: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    userText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    wrapper: {},
    sliderContainer: {
        height: 200,
        width: '90%',
        marginTop: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 8,
    },

    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ff1493',
        borderRadius: 8,
        alignItems: 'center',
    },
    sliderImage: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 8,
    },
    text: {
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold'
      }
})

export default LowPriceScreen;