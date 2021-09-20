import React, {useEffect, useState} from 'react';
import {View, SafeAreaView,Dimensions, Image, Text, Pressable, ImageBackground, StyleSheet, TextInput, ScrollView, Platform} from 'react-native';
import {Auth} from 'aws-amplify';
import Swiper from 'react-native-swiper';
import {listPosts} from '../../graphql/queries';
import {API, graphqlOperation} from 'aws-amplify';
import {OptimizedFlatList} from 'react-native-optimized-flatlist'
import Post from '../../components/Post';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LowPriceScreen = (props) => {
    const[posts, setPosts] = useState([]);


    

    useEffect ( () => {
        const fetchPosts = async () => {
            try{
                const postsResult = await API.graphql(
                    graphqlOperation(listPosts, {
                  
                })
                )

                setPosts(postsResult.data.listPosts.items);
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
        <ScrollView style={{backgroundColor:'#fff', paddingBottom:180}}>
            <View> 
            <ImageBackground
            source={{uri:"https://i.postimg.cc/QdkCDW7C/wallpaper1.jpg"}}
            style={{width: Dimensions.get('screen').width, height: Dimensions.get('screen').height/6}}
            imageStyle={{borderBottomRightRadius:25, borderBottomLeftRadius:25}}>

                <View style={styles.DarkOverlay}></View>
                <View style={styles.searchContainer}>
                    <Text style={styles.UserGreetings}>Discount</Text>
                    <Text style={styles.userText}>Cheap Homes to Rent</Text>
                </View>
                
            </ImageBackground>
            </View>
            <View>
                <Text></Text>
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
                
                <View style={{marginBottom:10, top:80}}>
                  <OptimizedFlatList
                      data={posts}
                      renderItem={({item}) => <Post post={item}/>}
                />
                  </View>
                  
            </View>
        </ScrollView>
        
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        
    },
    DarkOverlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        width: Dimensions.get('screen').width, 
        height: Dimensions.get('screen').height/6,
        backgroundColor: '#000',
        opacity: 0.3,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25
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