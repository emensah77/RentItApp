import React, {useState, Component} from 'react';
import {View, Text, Linking,  Platform ,Pressable, ImageBackground,SafeAreaView, ScrollView, Image ,FlatList, TouchableOpacity} from "react-native";
import styles from './styles';
import FontAwesome, { SolidIcons, phone } from 'react-native-fontawesome';
import Fontisto from "react-native-vector-icons/Fontisto";
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from "@react-navigation/native";
const image = {uri : "https://i.postimg.cc/kXP0cdpy/house9.jpg"};
import {FlatListSlider} from 'react-native-flatlist-slider';
import { Dimensions} from "react-native";
import {OptimizedFlatList} from 'react-native-optimized-flatlist';
import FastImage from 'react-native-fast-image';




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
         image:  'https://www.planetware.com/wpimages/2020/07/world-best-luxury-all-inclusive-resorts-lux-south-ari-atoll-maldives.jpg',
         title: 'Kumasi', key: '1'
        },
        {
            image:  'https://thetrumpetwlu.org/wp-content/uploads/2021/03/ia6oOD3DrA0ggTCwavIWxS6EX3ALe2lpMsrZIdXl.jpeg',
            title: 'Accra', key: '2'
           },
    
           {
            image:  'https://i.ytimg.com/vi/doTGAewB04w/maxresdefault.jpg',
            title: 'CapeCoast', key: '3'
           },
       ]);



       const [imagesApt, setimagesapt] = useState([
        {
         image: 'https://i.pinimg.com/originals/51/b1/51/51b151f069082996ffe5104f99c62e01.jpg',
         title: 'Full Homes', key: '1'
        },
        {
            image:  'https://cf.bstatic.com/images/hotel/max1024x768/930/93012959.jpg',
            title: '1 & 2 bedroom', key: '2'
           },
    
           {
            image: 'https://i.postimg.cc/kXP0cdpy/house9.jpg',
           title: 'Apartment', key: '3'
           },
       ]);


       const [partner, setpartner] = useState([
        {
         image: {uri: 'https://i.postimg.cc/kXP0cdpy/house9.jpg',
        }, title: 'Full Homes', key: '1'
        },
        
       ]);









    const navigation = useNavigation();


    const goToLocationSearch = () => {
        navigation.navigate('Destination Search')
    }


    return (
        <ScrollView style={{backgroundColor:"#fff"}}>
            <View>

                <Pressable 
                        style={styles.searchButton}
                        onPress={()=> navigation.navigate('Destination Search')}>
                        <Fontisto name="search" size={25} color={"#f15454"}/>
                        <Text adjustsFontSizeToFit={true} style={styles.searchButtonText}>Where do you want to rent?</Text>
                            
                            </Pressable>
                {/* Search bar */}
                <ImageBackground 
                source={image} 
                style={styles.image}>
                    
                    <Text adjustsFontSizeToFit={true} style={styles.title}>
                        Find your Next Home

                    </Text>

                    <Pressable 
                        style={styles.button}
                        onPress={()=> navigation.navigate
                        ('Destination Search')}>
                        <Text adjustsFontSizeToFit={true} style={styles.buttonText}>Explore nearby stays</Text>
                            
                            </Pressable>
                </ImageBackground>
            </View>

            <ScrollView style={{marginBottom: 40, backgroundColor: 'white'}}>
                    <View style={{padding: 5, margin: 10}}>
                        <Text style={{fontSize: 25, fontWeight: 'normal', fontFamily:'Montserrat-Bold'}}>
                            Live anywhere
                            
                        </Text>
                        <Text style={{fontSize:18, fontWeight: 'normal', fontFamily: 'Montserrat-Medium'}}>
                                Find rooms for rents in</Text>

                    </View>

                    <View>
                        <OptimizedFlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        horizontal={true} 
                           data={images} 
                           renderItem={({item}) => {
                               return (
                                   <View style={{paddingVertical:20, paddingLeft: 16 }}>
                                       <TouchableOpacity onPress={goToLocationSearch}>
                                           <FastImage 
                                           source={{
                                               uri: item.image,
                                               headers: { Authorization: 'token' },
                                               priority: FastImage.priority.high,
                                            }}
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
                        <Text style={{fontSize: 22, fontWeight: 'normal', fontFamily:'Montserrat-Bold'}}>
                            Explore

                        </Text>
                        <Text style={{fontSize:18, fontWeight: 'normal', fontFamily: 'Montserrat-Medium'}}>We have rooms for everyone</Text>
                    </View>
                    <OptimizedFlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                        horizontal={true}
                        decelerationRate="fast" 
                           data={imagesApt} 
                           renderItem={({item}) => {
                               return (
                                   <View style={{paddingVertical:20, paddingLeft: 16 }}>
                                       <TouchableOpacity onPress={goToLocationSearch}>
                                           <FastImage 
                                           source={{
                                               uri: item.image,
                                               headers: { Authorization: 'token' },
                                               priority: FastImage.priority.high,
                                            }} 
                                           style={{width: 250, marginRight: 8, height: 250, borderRadius:10}}/>
                                            <View style={styles.ImageOverlay}></View>
                                            
                                            <Text style={styles.ImageText}>{item.title}</Text>
                                        </TouchableOpacity>
                                       </View>
                               )
                           }}
                        />

                    
                    
                                   <View style={{margin: 20, padding: 16 }}>
                                       
                                        <Image 
                                                source={image} 
                                                style={{borderRadius: 20, height: 500, width: '100%', alignSelf:"center"}}/>
                                                 <View style={styles.ImageOverlay1}></View>   
                                                    <Text adjustsFontSizeToFit={true} style={{ color:"white",
                                                      marginLeft: 60, width:"100%",
                                                      top: 10, position: 'absolute', zIndex:1, fontWeight:"normal",
                                                       fontSize:25, fontFamily:'Montserrat-ExtraBold'
                                                      
                                                    }}>
                                                        Become a Partner

                                                    </Text>
                                                    <Text adjustsFontSizeToFit={true} style={{ color:"white",
                                                       justifyContent: 'center',
                                                      alignSelf: 'center', width:'50%', justifyContent:'center',
                                                      top: 50, position: 'absolute', zIndex:1, fontSize:18,
                                                      fontFamily: 'Montserrat-Medium'
                                                      
                                                    }}>
                                                        Open your home for rent and earn extra income. 

                                                    </Text>

                                                    <Pressable 
                                                      style={{ width: Dimensions.get('screen').width /2, backgroundColor: 'white',
                                                       justifyContent: 'center', flexDirection: 'row',
                                                      alignItems: 'center', borderRadius: 50,
                                                      top: 150, position: 'absolute', zIndex:1, alignSelf:"center"
                                                      
                                                    }}
                                                        onPress={makeCall}>
                                                        <Fontisto name="phone" size={25} style={{color: 'black' , margin: 10 ,transform: [{ rotate: '90deg' }]}} />
                                                        
                                                        <Text adjustsFontSizeToFit={true} style={{justifyContent: 'center', alignItems: 'center', fontSize: 18,
                                                         fontFamily:'Montserrat-SemiBold'}}>Call Now</Text>
                                                            
                                                            </Pressable>
                                                
                                            
                                    </View>




                    </View>

                    

                </ScrollView>

                    <Pressable onPress={() => navigation.navigate('Profile')} style={{margin: 10, padding: 16, backgroundColor: 'lightgray', borderRadius:10}}>
                        <Text adjustsFontSizeToFit={true} style={{margin: 10, fontSize:25, fontFamily:'Montserrat-Bold'}}>Stay Informed</Text>
                        <View style={{margin: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text adjustsFontSizeToFit={true} style={{fontFamily:'Montserrat-SemiBold'}}>For Tenants</Text>
                        
                        <Text adjustsFontSizeToFit={true} style={{fontFamily:'Montserrat-SemiBold'}}>For Landlords</Text>
                        
                        </View>
                        <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View>
                                <View style={{padding: 5, marginBottom: 5,}}>
                                        <Text adjustsFontSizeToFit={true} style={{padding:2, fontSize:14, fontFamily:'Montserrat-Bold'}}>Cancellation Options</Text>
                                        <Text adjustsFontSizeToFit={true} style={{fontSize:12, fontFamily:'Montserrat-Regular'}}>Learn of our flexible policy</Text>
                                    </View>

                                    <View style={{padding: 5, marginBottom: 5,}}>
                                        <Text adjustsFontSizeToFit={true} style={{padding:2, fontSize:14, fontFamily:'Montserrat-Bold'}}>Help Center</Text>
                                        <Text adjustsFontSizeToFit={true} style={{fontSize:12, fontFamily:'Montserrat-Regular'}}>Get Support</Text>
                                    </View>

                                    <View style={{padding: 5, marginBottom: 5,}}>
                                        <Text adjustsFontSizeToFit={true} style={{padding:2, fontSize:14, fontFamily:'Montserrat-Bold'}}>Trust and Safety</Text>
                                        <Text adjustsFontSizeToFit={true} style={{fontSize:12, fontFamily:'Montserrat-Regular'}}>Our Commitment</Text>
                                    </View>
                            </View>


                            <View>
                                <View style={{padding: 5, marginBottom: 5,}}>
                                        <Text adjustsFontSizeToFit={true} style={{padding:2, fontSize:14, fontFamily:'Montserrat-Bold'}}>Cancellation Options</Text>
                                        <Text adjustsFontSizeToFit={true} style={{fontSize:12, fontFamily:'Montserrat-Regular'}}>Learn of our flexible policy</Text>
                                    </View>

                                    <View style={{padding: 5, marginBottom: 5,}}>
                                        <Text adjustsFontSizeToFit={true} style={{padding:2, fontSize:14, fontFamily: 'Montserrat-Bold'}}>Help Center</Text>
                                        <Text adjustsFontSizeToFit={true} style={{fontSize:12, fontFamily:'Montserrat-Regular'}}>Get Support</Text>
                                    </View>

                                    <View style={{padding: 5, marginBottom: 5,}}>
                                        <Text adjustsFontSizeToFit={true} style={{padding:2, fontSize:14, fontFamily: 'Montserrat-Bold'}}>Trust and Safety</Text>
                                        <Text adjustsFontSizeToFit={true} style={{fontSize:12, fontFamily:'Montserrat-Regular'}}>Our Commitment</Text>
                                    </View>
                            </View>
                                

                                
                        </View>
                        
                        
                    </Pressable>
                        
        </ScrollView>
            
    );
};

export default HomeScreen;


