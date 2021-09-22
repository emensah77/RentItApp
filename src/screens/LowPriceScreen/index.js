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
        <ScrollView style={{
            backgroundColor: "#fff",
            flex: 1,
            paddingBottom:180,

        }}>
            <StatusBar hidden={true}/>
            <View style={{
                backgroundColor:'blue',
                height:"5%",
                borderBottomLeftRadius:20,
                borderBottomRightRadius: 20,
                paddingHorizontal:20,
                justifyContent:'center'
            }}>
                <View style={{paddingTop:15 }}>
                    <Text style={{fontSize:32, color:'white', fontFamily:'Montserrat-Bold'}}>Discount</Text>
                    <Text style={{fontSize:22, color:'white', fontFamily:'Montserrat-Regular'}}>Cheap homes to rent</Text>
                </View>
                
                
                


            </View>
            
            
            <View style={styles.container}>
                <View style={styles.sliderContainer}>
                <Swiper style={styles.wrapper} loop autoplay horizontal={false} height={200} activeDotColor="white">
                    <View style={styles.slide}>
                        
                    <Text style={styles.text}>Cheap</Text>
                        {/*<Image
                            source={{uri:'https://d5w4alzj7ppu4.cloudfront.net/house1/house4.jpg'}}
                            resizeMode="cover"
                            style={styles.sliderImage}
                        />
                        */}
                        
                    </View>
                    <View style={styles.slide}>
                        <Text style={styles.text}>Affordable</Text>
                            {/*<Image
                                source={{uri:'https://d5w4alzj7ppu4.cloudfront.net/house1/house4.jpg'}}
                                resizeMode="cover"
                                style={styles.sliderImage}
                            />
                            */}
                        
                    </View>
                    <View style={styles.slide}>
                        <Text style={styles.text}>Homes</Text>
                            {/*<Image
                                source={{uri:'https://d5w4alzj7ppu4.cloudfront.net/house1/house4.jpg'}}
                                resizeMode="cover"
                                style={styles.sliderImage}
                            />
                            */}
                        
                    </View>
                    <View style={styles.slide}>
                        <Text style={styles.text}>For</Text>
                        {/*<Image
                            source={{uri:'https://d5w4alzj7ppu4.cloudfront.net/house1/house4.jpg'}}
                            resizeMode="cover"
                            style={styles.sliderImage}
                        />
                        */}
                        
                    </View>
                    <View style={styles.slide}>
                    <Text style={styles.text}>You</Text>
                        {/*<Image
                            source={{uri:'https://d5w4alzj7ppu4.cloudfront.net/house1/house4.jpg'}}
                            resizeMode="cover"
                            style={styles.sliderImage}
                        />
                        */}
                        
                    </View>
                </Swiper>
                </View>
                <View style={{marginTop: 30}}>
                    <Text
                    style={{
                        alignSelf: 'center',
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#333',
                    }}>
                    Most Affordable
                </Text>
                </View>

                {loading ?
                <ScrollView
         
        
                style={{
                    flex:1, }} contentContainerStyle={{justifyContent:'center', alignItems:'center', paddingTop:50}}>
                    
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
                </ScrollView>
                :
                
                <View style={{marginBottom:10, top:80}}>
                  <OptimizedFlatList
                      data={posts}
                      renderItem={({item}) => <Post post={item}/>}
                />
                  </View>

                }
                  
            </View>
        </ScrollView>
        
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