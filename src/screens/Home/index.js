import React, {useState,useEffect,useRef, Component} from 'react';
import {View, Text, Linking,  Platform ,Pressable, ImageBackground,SafeAreaView,PermissionsAndroid, ScrollView, Image ,FlatList, TouchableOpacity, Alert, BackHandler} from "react-native";
import styles from './styles';
import FontAwesome, { SolidIcons, phone } from 'react-native-fontawesome';
import Fontisto from "react-native-vector-icons/Fontisto";
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation, useRoute} from "@react-navigation/native";
const image = {uri : "https://d5w4alzj7ppu4.cloudfront.net/cities/night.jpeg"};
import {FlatListSlider} from 'react-native-flatlist-slider';
import { Dimensions} from "react-native";
import {OptimizedFlatList} from 'react-native-optimized-flatlist';
import FastImage from 'react-native-fast-image';
import VersionCheck from 'react-native-version-check';
import Geolocation from 'react-native-geolocation-service';
import {API, graphqlOperation} from 'aws-amplify';
import {listPosts} from '../../graphql/queries'; 
import Geocoder from 'react-native-geocoding';
const colors = ["magenta","lime","fuchsia","crimson", "aqua", "blue", "red", "yellow", "green", "white", "deeppink"]

const HomeScreen =(props) => {



    const [updateNeeded, setUpdateNeeded] = useState(false);
    const [updateUrl, setUpdateUrl] = useState('');
    const[posts, setPosts] = useState([]);
    const [postLatest, setLatest] = useState([]);
    const [addresss, setaddress] = useState('');
    const [forceLocation, setForceLocation] = useState(true);
    const [highAccuracy, setHighAccuracy] = useState(true);
    const [locationDialog, setLocationDialog] = useState(true);
    const [significantChanges, setSignificantChanges] = useState(false);
    const [observing, setObserving] = useState(false);
    const [foregroundService, setForegroundService] = useState(false);
    const [useLocationManager, setUseLocationManager] = useState(false);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [color, setcolor]  =  useState('white');
    const map = useRef();
    const route = useRoute();
    const title = route.params?.title
    const type = route.params?.type
    const description = route.params?.description
    const bed = route.params?.bed;
    const bedroom = route.params?.bedroom;
    const bathroom = route.params?.bathroom;
    const imageUrls = route.params?.imageUrls;
    const homeprice = route.params?.homeprice;
    const mode = route.params?.mode;
    const amenities = route.params?.amenities;
    
    
        const hasPermissionIOS = async () => {
            const openSetting = () => {
            Linking.openSettings().catch(() => {
                Alert.alert('Unable to open settings');
            });
            };
            const status = await Geolocation.requestAuthorization('whenInUse');

            if (status === 'granted') {
            return true;
            }

            if (status === 'denied') {
            Alert.alert('Location permission denied');
            }

            if (status === 'disabled') {
            Alert.alert(
                `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
                '',
                [
                { text: 'Go to Settings', onPress: openSetting },
                { text: "Don't Use Location", onPress: () => {} },
                ],
            );
            }

            return false;
        };

        const hasLocationPermission = async () => {
            if (Platform.OS === 'ios') {
            const hasPermission = await hasPermissionIOS();
            return hasPermission;
            }

            if (Platform.OS === 'android' && Platform.Version < 23) {
            return true;
            }

            const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );

            if (hasPermission) {
            return true;
            }

            const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );

            if (status === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
            }

            if (status === PermissionsAndroid.RESULTS.DENIED) {
            ToastAndroid.show(
                'Location permission denied by user.',
                ToastAndroid.LONG,
            );
            } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            ToastAndroid.show(
                'Location permission revoked by user.',
                ToastAndroid.LONG,
            );
            }

            return false;
        };

        const getLocation = async () => {
            const hasPermission = await hasLocationPermission();

            if (!hasPermission) {
            return;
            }

            Geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                
            },
            (error) => {
                Alert.alert(`Code ${error.code}`, error.message);
                setLocation(null);
                console.log(error);
            },
            {
                accuracy: {
                android: 'high',
                ios: 'best',
                },
                enableHighAccuracy: highAccuracy,
                timeout: 15000,
                maximumAge: 10000,
                distanceFilter: 0,
                forceRequestLocation: forceLocation,
                forceLocationManager: useLocationManager,
                showLocationDialog: locationDialog,
            },
            );
        };

    const makeCall = () => {
        const phoneNumbers = ["0552618521", "0597285059", "0597285099", "0205200706", "0579535484"]
        
        let phoneNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
    
        if (Platform.OS === 'android') {
          phoneNumber = `tel:${phoneNumber}`;
        } else {
          phoneNumber = `telprompt:${phoneNumber}`;
        }
        try{
            Linking.openURL(phoneNumber);
        }
        catch(e){
            console.log(e)
        }
        
      };
      
    
    
   
    
    
    function selectColor  () {
        
       setcolor(colors[Math.floor(Math.random() * colors.length)]);
        
    }
    const [images, setimages] = useState([
        {
         image:  'https://d5w4alzj7ppu4.cloudfront.net/cities/Kejetia_Kumasi.jpeg',
         title: 'Kumasi', key: '1'
        },
        {
            image:  'https://d5w4alzj7ppu4.cloudfront.net/cities/accra.jpeg',
            title: 'Accra', key: '2'
           },
    
           {
            image:  'https://d5w4alzj7ppu4.cloudfront.net/cities/capecoast.jpeg',
            title: 'CapeCoast', key: '3'
           },
       ]);



       const [imagesApt, setimagesapt] = useState([
        {
         image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/fullhome.png',
         title: 'Full Homes', key: '1'
        },
        {
            image:  'https://d5w4alzj7ppu4.cloudfront.net/cities/1bedroom.jpeg',
            title: '1 & 2 bedroom', key: '2'
           },
    
           {
            image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/house9.jpg',
           title: 'Apartment', key: '3'
           },
       ]);


       const [partner, setpartner] = useState([
        {
         image: {uri: 'https://d5w4alzj7ppu4.cloudfront.net/cities/house9.jpg',
        }, title: 'Full Homes', key: '1'
        },
        
       ]);

       const fetchPosts = async () => {
        try{
            const postsResult = await API.graphql(
                graphqlOperation(listPosts,  {

                
               
                limit: 1000000,
                filter: {
                    and: {
                        
                        latitude: {
                        
                            between: [
                                latitude - (.8/2),
                                latitude + (.8/2),
                            ],
                        },
                        longitude: {
                            between: [
                                longitude - (.8/2),
                                longitude + (.8/2),
                            ],
                        }
                    }
                    
                },
                
                
            })
            )
            
            setPosts(postsResult.data.listPosts.items);
           
            
        } catch (e){
            console.log(e);
        }
    }
    
    const getLatestPost = async () => {
        try{
            const postsResult = await API.graphql(
                graphqlOperation(listPosts,  {
                    limit:1000000
                    
                })
            )
            
            setLatest(postsResult.data.listPosts.items);
            
            
        } catch (e){
            console.log(e);
        }
    }



       useEffect (() => {
        
        setInterval(selectColor, 2000);
        VersionCheck.needUpdate()
        .then(async res => {
          //console.log(res.isNeeded);    // true
          if (res.isNeeded) {
              setUpdateNeeded(true);
              setUpdateUrl(res.storeUrl);
              //console.log(res.storeUrl === updateUrl);
            //Linking.openURL(res.storeUrl);  // open store if update is needed.
          }
        });
        
        
        getLocation();
        fetchPosts();
        getLatestPost();
        
        //console.log('This is latest',postLatest.map(item => (item.createdAt)));
        clearInterval(selectColor);
       }, [])
       if (postLatest){
        postLatest.sort(function (a, b) {
            return Date.parse(b.createdAt) - Date.parse(a.createdAt);
          });
       }
       

    const updateApp = () => {
        Linking.openURL(updateUrl);
    }

    const navigation = useNavigation();


    const goToLocationSearch = () => {
        navigation.navigate('House Type')
    }


    return (
        <ScrollView style={{backgroundColor:"#fff"}}>
            <View>
                {updateNeeded ? <TouchableOpacity onPress={updateApp}  style={{backgroundColor:'black',alignItems:'center', }}>
                <Text style={{alignItems:'center', fontWeight:'bold',fontSize:15, textDecorationLine:'underline',textDecorationStyle:'solid',paddingBottom:10, marginTop: Platform.OS === 'android' ? 10 : 50, color:'white'}}>Get the latest app update</Text>
            </TouchableOpacity>: null}
            
                <Pressable 
                        style={styles.searchButton}
                        onPress={()=> navigation.navigate('House Type')}>
                        <Fontisto name="search" size={20} color={"deeppink"}/>
                        <Text adjustsFontSizeToFit={true} style={styles.searchButtonText}>Where do you want to rent?</Text>
                            
                            </Pressable>
                {/* Search bar */}
                <ImageBackground 
                 
                style={styles.image}>
                    
                    <Text adjustsFontSizeToFit={true} style={{marginTop:-20,
                        fontSize:30,
                        alignSelf:'center',
                        zIndex:1,
                        fontFamily:'Montserrat-Bold',
                        color: color}}>
                       
                            A home for everyone
                        
                    </Text>

                    {/* <Pressable 
                        style={styles.button}
                        onPress={()=> navigation.navigate
                        ('House Type')}>
                        <Text adjustsFontSizeToFit={true} style={styles.buttonText}>Explore nearby stays</Text>
                            
                            </Pressable> */}
                </ImageBackground>
                <View>
                    
                    <Image

                        
                    style={{height:500, width:Dimensions.get('screen').width - 20, top:-150, borderRadius:25, marginHorizontal:10}}
                        source={image}

                    />
                    
                    
                </View>
            </View>

            <ScrollView style={{marginBottom: 40, backgroundColor: 'white'}}>
            <View style={{padding: 5, margin: 10}}>
                <Text style={{fontSize: 25, fontWeight: 'bold', fontFamily:'Montserrat-Bold'}}>
                    New Homes

                    
                
                </Text>
                <Text style={{fontSize:18, fontWeight: 'normal', fontFamily: 'Montserrat-Medium'}}>
                        Browse homes you will love</Text>

                </View>

                <OptimizedFlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        decelerationRate={"fast"}
                        snapToInterval={Dimensions.get("window").width - 60}
                        snapToAlignment={"center"}
                        initialNumToRender={10}
                        horizontal={true} 
                           data={postLatest} 
                           renderItem={({item}) => {
                               return (
                                   <View style={{paddingVertical:20, paddingLeft: 16 }}>
                                       <TouchableOpacity onPress={() => {navigation.navigate("Post", {postId: item.id})}}>
                                        
                                           <FastImage 
                                           source={{
                                               uri: item.image,
                                               headers: { Authorization: 'token' },
                                               priority: FastImage.priority.high,
                                            }}
                                           style={{flex:1, width: Dimensions.get("window").width - 60, marginRight: 8, height: 250, borderRadius:10, resizeMode:'cover'}}/>
                                           
                                            <View style={{width: Dimensions.get("window").width - 60,
                                                            height: 250,
                                                            marginRight: 8,
                                                            borderRadius: 10,
                                                            position: 'absolute',
                                                            backgroundColor: '#000',
                                                            opacity: .4}}></View>
                                            <View style={{
                                shadowColor:"black", shadowOpacity:.5, shadowRadius:30, margin: 10, left:0, top:5, position: 'absolute'
                                ,height:30, width:80, backgroundColor:"white", elevation:90,
                                borderRadius:10, justifyContent:'center', alignItems:"center"}}>
                                    <Text adjustsFontSizeToFit={true} style={{fontSize:14, fontWeight:'bold'}}>{item.mode === "For Sale" ? "FOR SALE":"FOR RENT"}</Text>
                </View>
                                            <Text style={{ position: 'absolute',
                                                            color: 'white',
                                                            marginTop: 4,
                                                            fontSize: 14,
                                                            fontWeight: 'bold',
                                                            left: 25,
                                                            bottom: 15}}>GH₵ {(Math.round(item.newPrice*1.07)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} |  {item.bedroom} bedrooms</Text>
                                        </TouchableOpacity>
                                        
                                        {/* <Text>{geocod(item.latitude, item.longitude)}</Text> */}
                                        {/* <Text style={{fontSize:32}}>This {resiul}</Text> */}
                                       {
                                        
                                        item.locality != null ?
                                            <View style={{flex:1, marginHorizontal:10,
                                            flexDirection:'row' }}>
                                             {/* <Feather style={{paddingTop:9, marginHorizontal:1}}  name='map-pin' size={20}/>    */}
                                            <Text style={{fontWeight:'bold', paddingTop:10, fontSize:14}}>
                                                 {item.type} in {item.locality}, {item.sublocality}
                                                
                                                
                                                </Text> 
                                                </View>
                                                :
                                           
                                           
                                           <Text style={{fontSize:14, paddingTop:10, fontWeight:'bold'}}>{item.type}</Text>
                                       }
                                       </View>
                               )
                           }}
                        />
                {posts.length === 0 ? 
                
                null :
                <View style={{padding: 5, margin: 10}}>
                <Text style={{fontSize: 25, fontWeight: 'bold', fontFamily:'Montserrat-Bold'}}>
                    Nearby Homes
                    
                </Text>
                <Text style={{fontSize:18, fontWeight: 'normal', fontFamily: 'Montserrat-Medium'}}>
                        Find homes near you</Text>

            </View>
                
                }
                    
                    <OptimizedFlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        decelerationRate={"fast"}
                        snapToInterval={Dimensions.get("window").width - 60}
                        snapToAlignment={"center"}
                        initialNumToRender={10}
                        horizontal={true} 
                           data={posts} 
                           renderItem={({item}) => {
                               return (
                                   <View style={{paddingVertical:20, paddingLeft: 16 }}>
                                       <TouchableOpacity onPress={() => {navigation.navigate("Post", {postId: item.id})}}>
                                           <FastImage 
                                           source={{
                                               uri: item.image,
                                               headers: { Authorization: 'token' },
                                               priority: FastImage.priority.high,
                                            }}
                                           style={{flex:1, width: Dimensions.get("window").width - 60, marginRight: 8, height: 250, borderRadius:10, resizeMode:'cover'}}/>
                                            <View style={{width: Dimensions.get("window").width - 60,
                                                            height: 250,
                                                            marginRight: 8,
                                                            borderRadius: 10,
                                                            position: 'absolute',
                                                            backgroundColor: '#000',
                                                            opacity: .4}}></View>
                                            
                                            <Text style={{ position: 'absolute',
                                                            color: 'white',
                                                            marginTop: 4,
                                                            fontSize: 14,
                                                            fontWeight: 'bold',
                                                            left: 25,
                                                            bottom: 15}}>GH₵ {(Math.round(item.newPrice*1.07)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} |  {item.bed} bedrooms</Text>
                                        </TouchableOpacity>
                                       </View>
                               )
                           }}
                        />



                    <View style={{padding: 5, margin: 10}}>
                        <Text style={{fontSize: 25, fontWeight: 'bold', fontFamily:'Montserrat-Bold'}}>
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
                        <Text style={{fontSize: 22, fontWeight: 'bold', fontFamily:'Montserrat-Bold'}}>
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
                                                    <Text adjustsFontSizeToFit={true} style={{flex:1, alignItems: "center", color:"white",
                                                      marginLeft: Dimensions.get('screen').width/3.5, width:"100%",
                                                      top: 10, position: 'absolute', zIndex:1, fontWeight:"bold",
                                                       fontSize:16, fontFamily:'Montserrat-ExtraBold',
                                                      
                                                    }}>
                                                        Become a Partner

                                                    </Text>
                                                    <Text adjustsFontSizeToFit={true} style={{ color:"white",
                                                       justifyContent: 'center',
                                                      alignSelf: 'center', width:'50%', justifyContent:'center',
                                                      top: 50, position: 'absolute', zIndex:1, fontSize:12,
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

                    <Pressable onPress={() => navigation.navigate('About')} style={{margin: 10, padding: 16, backgroundColor: 'lightgray', borderRadius:10}}>
                        <Text adjustsFontSizeToFit={true} style={{margin: 10, fontSize:25, fontFamily:'Montserrat-Bold'}}>Stay Informed</Text>
                        <View style={{margin: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text adjustsFontSizeToFit={true} style={{fontFamily:'Montserrat-SemiBold', fontSize:12}}>For Tenants</Text>
                        
                        <Text adjustsFontSizeToFit={true} style={{fontFamily:'Montserrat-SemiBold', fontSize:12}}>For Landlords</Text>
                        
                        </View>
                        <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View>
                                <View style={{padding: 5, marginBottom: 5,}}>
                                        <Text adjustsFontSizeToFit={true} style={{flex:0.8,padding:2, fontSize:10, fontFamily:'Montserrat-Bold'}}>Cancellation Options</Text>
                                        <Text adjustsFontSizeToFit={true} style={{fontSize:8, fontFamily:'Montserrat-Regular'}}>Learn of our flexible policy</Text>
                                    </View>

                                    <View style={{padding: 5, marginBottom: 5,}}>
                                        <Text adjustsFontSizeToFit={true} style={{padding:2, fontSize:10, fontFamily:'Montserrat-Bold'}}>Help Center</Text>
                                        <Text adjustsFontSizeToFit={true} style={{fontSize:8, fontFamily:'Montserrat-Regular'}}>Get Support</Text>
                                    </View>

                                    <View style={{padding: 5, marginBottom: 5,}}>
                                        <Text adjustsFontSizeToFit={true} style={{padding:2, fontSize:10, fontFamily:'Montserrat-Bold'}}>Trust and Safety</Text>
                                        <Text adjustsFontSizeToFit={true} style={{fontSize:8, fontFamily:'Montserrat-Regular'}}>Our Commitment</Text>
                                    </View>
                            </View>


                            <View>
                                <View style={{padding: 5, marginBottom: 5,}}>
                                        <Text adjustsFontSizeToFit={true} style={{padding:2, fontSize:10, fontFamily:'Montserrat-Bold'}}>Cancellation Options</Text>
                                        <Text adjustsFontSizeToFit={true} style={{fontSize:8, fontFamily:'Montserrat-Regular'}}>Learn of our flexible policy</Text>
                                    </View>

                                    <View style={{padding: 5, marginBottom: 5,}}>
                                        <Text adjustsFontSizeToFit={true} style={{padding:2, fontSize:10, fontFamily: 'Montserrat-Bold'}}>Help Center</Text>
                                        <Text adjustsFontSizeToFit={true} style={{fontSize:8, fontFamily:'Montserrat-Regular'}}>Get Support</Text>
                                    </View>

                                    <View style={{padding: 5, marginBottom: 5,}}>
                                        <Text adjustsFontSizeToFit={true} style={{padding:2, fontSize:10, fontFamily: 'Montserrat-Bold'}}>Trust and Safety</Text>
                                        <Text adjustsFontSizeToFit={true} style={{fontSize:8, fontFamily:'Montserrat-Regular'}}>Our Commitment</Text>
                                    </View>
                            </View>
                                

                                
                        </View>
                        
                        
                    </Pressable>
                        
        </ScrollView>
            
    );
};

export default HomeScreen;


