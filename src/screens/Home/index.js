import React, {useState, Component} from 'react';
import {View, Text, Linking,  Platform ,Pressable, ImageBackground,SafeAreaView, ScrollView, Image ,FlatList, TouchableOpacity} from "react-native";
import styles from './styles';
import FontAwesome, { SolidIcons, phone } from 'react-native-fontawesome';
import Fontisto from "react-native-vector-icons/Fontisto";
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from "@react-navigation/native";
const image = {uri : "https://a0.muscache.com/im/pictures/7d82ca14-56e5-4465-8218-dcfa7d69b6ac.jpg?im_w=720"};
import {FlatListSlider} from 'react-native-flatlist-slider';




const HomeScreen =(props) => {

    const makeCall = () => {

        let phoneNumber = '';
    
        if (Platform.OS === 'android') {
          phoneNumber = 'tel:${1234567890}';
        } else {
          phoneNumber = 'telprompt:${1234567890}';
        }
    
        Linking.openURL(phoneNumber);
      };
    

    const [images, setimages] = useState([
        {
         image: {uri: 'https://www.planetware.com/wpimages/2020/07/world-best-luxury-all-inclusive-resorts-lux-south-ari-atoll-maldives.jpg',
        }, title: 'Kumasi', key: '1'
        },
        {
            image: {uri: 'https://thetrumpetwlu.org/wp-content/uploads/2021/03/ia6oOD3DrA0ggTCwavIWxS6EX3ALe2lpMsrZIdXl.jpeg',
           }, title: 'Accra', key: '2'
           },
    
           {
            image: {uri: 'https://i.ytimg.com/vi/doTGAewB04w/maxresdefault.jpg',
           }, title: 'CapeCoast', key: '3'
           },
       ]);



       const [imagesApt, setimagesapt] = useState([
        {
         image: {uri: 'https://i.pinimg.com/originals/51/b1/51/51b151f069082996ffe5104f99c62e01.jpg',
        }, title: 'Full Homes', key: '1'
        },
        {
            image: {uri: 'https://cf.bstatic.com/images/hotel/max1024x768/930/93012959.jpg',
           }, title: '1 & 2 bedroom', key: '2'
           },
    
           {
            image: {uri: 'https://i.ytimg.com/vi/doTGAewB04w/maxresdefault.jpg',
           }, title: 'Apartment', key: '3'
           },
       ]);


       const [partner, setpartner] = useState([
        {
         image: {uri: 'https://i.pinimg.com/originals/51/b1/51/51b151f069082996ffe5104f99c62e01.jpg',
        }, title: 'Full Homes', key: '1'
        },
        
       ]);









    const navigation = useNavigation();


    const goToLocationSearch = () => {
        navigation.navigate('Destination Search')
    }


    return (
        <ScrollView>
            <View>

                <Pressable 
                        style={styles.searchButton}
                        onPress={()=> navigation.navigate('Destination Search')}>
                        <Fontisto name="search" size={25} color={"#f15454"}/>
                        <Text style={styles.searchButtonText}>Where do you want to rent?</Text>
                            
                            </Pressable>
                {/* Search bar */}
                <ImageBackground 
                source={image} 
                style={styles.image}>
                    
                    <Text style={styles.title}>
                        Find your Next Home

                    </Text>

                    <Pressable 
                        style={styles.button}
                        onPress={()=> navigation.navigate
                        ('Destination Search')}>
                        <Text style={styles.buttonText}>Explore nearby stays</Text>
                            
                            </Pressable>
                </ImageBackground>
            </View>

            <ScrollView style={{marginBottom: 40, backgroundColor: 'white'}}>
                    <View style={{padding: 5, margin: 10}}>
                        <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                            Live Anywhere
                            
                        </Text>
                        <Text style={{fontSize:18, fontWeight: 'normal', fontFamily: 'sans-serif'}}>
                                Find rooms for rents in</Text>

                    </View>

                    <View>
                        <FlatList
                        horizontal={true} 
                           data={images} 
                           renderItem={({item}) => {
                               return (
                                   <View style={{paddingVertical:20, paddingLeft: 16 }}>
                                       <TouchableOpacity onPress={goToLocationSearch}>
                                           <Image 
                                           source={item.image} 
                                           style={{width: 250, marginRight: 8, height: 250, borderRadius:10, resizeMode: 'cover'}}/>
                                            <View style={styles.ImageOverlay}></View>
                                            <Feather name='map-pin' size={26} color='white'
                                            style={styles.imageLocationIcon}/>
                                            <Text style={styles.ImageText}>{item.title}</Text>
                                        </TouchableOpacity>
                                       </View>
                               )
                           }}
                        />

                    <View style={{padding: 5, margin: 10}}>
                        <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                            Explore

                        </Text>
                        <Text style={{fontSize:18, fontWeight: 'normal', fontFamily: 'sans-serif'}}>We have rooms for everyone</Text>
                    </View>
                    <FlatList
                        horizontal={true}
                        decelerationRate="fast" 
                           data={imagesApt} 
                           renderItem={({item}) => {
                               return (
                                   <View style={{paddingVertical:20, paddingLeft: 16 }}>
                                       <TouchableOpacity onPress={goToLocationSearch}>
                                           <Image 
                                           source={item.image} 
                                           style={{width: 250, marginRight: 8, height: 250, borderRadius:10}}/>
                                            <View style={styles.ImageOverlay}></View>
                                            
                                            <Text style={styles.ImageText}>{item.title}</Text>
                                        </TouchableOpacity>
                                       </View>
                               )
                           }}
                        />

                    
                    
                                   <View style={{margin: 20, padding: 16 }}>
                                       
                                        <ImageBackground 
                                                source={image} 
                                                style={{borderRadius: 200, height: 550, width: '100%'}}>
                                                 <View style={styles.ImageOverlay1}></View>   
                                                    <Text style={{marginLeft: 60 ,alignItems: 'center' ,justifyContent: 'center', margin: 10, top: 10, color: 'white', fontWeight: 'bold', fontSize: 25}}>
                                                        Become a Partner

                                                    </Text>
                                                    <Text style={{marginLeft: 60 ,alignItems: 'center' ,justifyContent: 'center', margin: 10, top: 10, color: 'white', fontWeight: 'normal', fontSize: 15}}>
                                                        Upload your home for rent and earn extra income. Fast, Easy, Convenient 

                                                    </Text>

                                                    <Pressable 
                                                      style={{ height: 50, width: 150, backgroundColor: 'white',
                                                      marginHorizontal: 100, justifyContent: 'center', flexDirection: 'row',
                                                      alignItems: 'center', borderRadius: 50,
                                                      marginTop: 20
                                                      
                                                    }}
                                                        onPress={makeCall}>
                                                        <Fontisto name="phone" size={25} style={{color: 'black' , margin: 10 ,transform: [{ rotate: '90deg' }]}} />
                                                        
                                                        <Text style={{justifyContent: 'center', alignItems: 'center', fontSize: 18, fontWeight: 'bold'}}>Call Now</Text>
                                                            
                                                            </Pressable>
                                                </ImageBackground>
                                            
                                    </View>




                    </View>

                </ScrollView>
                        
        </ScrollView>
            
    );
};

export default HomeScreen;


