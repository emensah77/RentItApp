import React, {useEffect,useContext, useState} from "react";
import {View,Image ,Text, ScrollView, Platform, Linking ,Pressable, StatusBar, Alert} from "react-native";
import styles from './styles.js';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {FlatListSlider} from 'react-native-flatlist-slider';
import { withAuthenticator } from 'aws-amplify-react-native';
import Amplify from '@aws-amplify/core';
import Feather from 'react-native-vector-icons/Feather';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils , faFan ,faFaucet, faBath, faBed, faToilet} from '@fortawesome/free-solid-svg-icons'
import firebase from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';
import { useNavigation , useRoute} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import ImageCarousel from '../../components/ImageCarousel';
import {SharedElement} from 'react-navigation-shared-element'
import FastImage from 'react-native-fast-image';
import {AuthContext} from '../../navigation/AuthProvider';
//const uploadusers = ["17Kx04gVyJXkO8kZsIxUxRu4uJw1","Ye7iz2KN5Fbk5Y0Z91IEmzywNPh1","UWHvpJ1XoObsFYTFR48zYe6jscJ2","7WGODlIhvkXGhjpngLXxAnQihTK2", "lvtDmH13IRW1njCJKZyKsO2okKr1", "JleriGZuTqXkAyO3xCiDsey1CCb2"]
import firestore from '@react-native-firebase/firestore'
import { TouchableOpacity } from "react-native-gesture-handler";
import {API, graphqlOperation} from 'aws-amplify';
import {deletePost} from '../../graphql/mutations';

const DetailedPost = (props) => {
    const post = props.post;
    const navigation = useNavigation();
    const route = useRoute();
    const {user, logout} = useContext(AuthContext);

    const randString = route.params.randString;
    const [phoneNumbers, setphones] = useState([]);
    const [usersWithPrivileges, setUsersWithPrivileges] = useState([]);

    const logAnalyticsEvent = async () =>{
        await analytics().logEvent('calltorent', {
            id: user.displayName,
            item: user.phoneNumber,
            description: 'Clicked on the call to rent button'
            
        })
    }
    const getPhoneNumbers = async () => {
        const callers = await firebase.firestore().collection('callers')
        callers.get().then((querySnapshot) => {
            
            querySnapshot.forEach((doc) => {
                
                setphones(prev => [...prev, doc.data().number])
                })
            
            //console.log('phoneNumbers',phoneNumbers)
         })
    }

    const getUsersWithPrivileges = async () => {
        const callers = await firebase.firestore().collection('usersWithPrivileges')
        callers.get().then((querySnapshot) => {
            
            querySnapshot.forEach((doc) => {
                
                setUsersWithPrivileges(prev => [...prev, doc.data().userId])
                })
            
            //console.log('phoneNumbers',phoneNumbers)
         })
    }


    useEffect(() => {
        getPhoneNumbers();
        getUsersWithPrivileges();
    },[])
    const payRent = () => {
        navigation.navigate('Address', {
            price: Math.round(post.newPrice*1.07), 
            homeimage: post.image,
            hometitle: post.title,
            homebed: post.bed,
            homelatitude: post.latitude,
            homelongitude: post.longitude,
            postid: post.id,
            

        });
    }
    const makeCall = () => {
        
        
        let phoneNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
        //console.log('rand',phoneNumber, phoneNumbers)
        if (Platform.OS === 'android') {
          phoneNumber = `tel:${phoneNumber}`;
        } else {
          phoneNumber = `telprompt:${phoneNumber}`;
        }
        try{
            Linking.openURL(phoneNumber);
        }
        catch(e){
            //console.log(e)
        }
        
      };

      const deleteFromFavorites = async (id) => {
        const ref = firestore().collection('posts');
        ref.where("id", '==', id)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              firestore()
              .collection('posts')
              .doc(doc.id)
              .delete()
              .then(() => {
                console.log('Deleted from favorite posts!');
              });
              //console.log(doc.id);
              //console.log(doc.id, "=>", doc.data());
            });
          });
        
      }
      const deleteFromTrends = async (id) => {
      
        await firestore()
        .collection('trends')
        .doc(id)
        .delete();
    
      }
      const deleteHome = async (id) => {
    
        try {
          let input = {
            id
          }
          const deletedTodo  = await API.graphql(
            graphqlOperation(deletePost, {
    
              input
            })
    
          );
          console.log("Succesfully deleted the post");
        }
        catch(e){
          console.log('Error deleting post', e);
        }
      }

      const deleteListing = async (id) =>{
              deleteHome(id);
              deleteFromTrends(id);
              deleteFromFavorites(id);
      }

   

    return(
        <View style={{backgroundColor:'white'}}>
        <ScrollView contentContainerStyle={{paddingBottom:150}} showsVerticalScrollIndicator={false}>
            {/* Image */}
            <StatusBar hidden={true} />
            
            <ImageCarousel postId={post.id} images={post.images}/>
            
            
            
            <View style={styles.container}>
                
                {/* Bed and Bedroom */}
                <View style={{flex:1, flexDirection:"row", justifyContent:"space-between"}}>
                <Text style={styles.description} numberOfLines={2}>
                    {post.title}
                </Text>
                {usersWithPrivileges.includes(user.uid) ? 
                 <TouchableOpacity onPress={() => {
                    Alert.alert(
                     "Are you sure you want to delete?",
                     "This is irreversible and cannot be undone",
                     [
                         
                         { text: "OK", onPress: () => {
                             
                             deleteListing(post.id)
                             navigation.goBack();
                             
                         }
                          
                         
                     },
                     { text: "Cancel",  style: 'cancel'
                     
                     
                 }
                     ],
                     { cancelable: true }
                     );
                     }
                     }>
                     <Fontisto name="trash" size={25} color={"blue"} />
                 </TouchableOpacity>
                  
                 : 
                 null
                 
                 }
                
                </View>
                
                <View style={styles.hairline}/>
                <Text style={styles.bedrooms}>
                {post.type} | {post.bedroom} bedrooms | {post.bathroomNumber} bathrooms |
                </Text>
                {usersWithPrivileges.includes(user.uid) ? <Text>{post.phoneNumbers}</Text> : null}
                <Text style={styles.prices}>
                    {/* <Text style={styles.oldPrice}>
                    GH₵{post.oldPrice} 
                    </Text> */}
                    <Text style={styles.newPrice}>
                    GH₵{(Math.round(post.newPrice*1.07)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} / year
                    </Text>
                </Text>
                {/* Type and Description */}
                
                {/* Old and new Price */}
                <View style={styles.hairline}/>
                
                {/* Total price */}
                {/* <Text style={styles.totalPrice}>
                GH₵{post.totalPrice}
                </Text> */}
                

                <Text style={styles.longDescription}>
                    {post.description}
                </Text>
                <View style={styles.hairline}/>
                <Text style={styles.longDescription}>
                    {post.createdAt} | now
                </Text>
                <View style={styles.hairline}/>
                <Text style={{margin: 10, fontSize:20, fontFamily:"Montserrat-Bold"}}>
                    Amenities available
                </Text>
                <View style={{margin:10, padding:1, flex:1, flexDirection:'row', justifyContent:"space-between"}}>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>Air Conditioner <FontAwesomeIcon icon={faFan}  size={25} color={'blue'}/></Text>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>{post.aircondition}</Text>
                </View>
                <View style={{margin:10, padding:1, flex:1, flexDirection:'row', justifyContent:"space-between"}}>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>Wifi <Feather name="wifi" size={25} color={'blue'}/></Text>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>{post.wifi}</Text>
                </View>
                <View style={{margin:10, padding:1, flex:1, flexDirection:'row', justifyContent:"space-between"}}>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>Kitchen <FontAwesomeIcon icon={faUtensils} color={'blue'}/></Text>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>{post.kitchen}</Text>
                </View>
                <View style={{margin:10, padding: 1, flex:1, flexDirection:'row', justifyContent:"space-between"}}>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>Bathroom <FontAwesomeIcon icon={faBath} size={25} color={'blue'}/></Text>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>{post.bathroom}</Text>
                </View>
                <View style={{margin:10, padding:1, flex:1, flexDirection:'row', justifyContent:"space-between"}}>
                    <Text style={{color:'blue',fontSize:18, fontWeight:'bold'}}>Bedroom <FontAwesomeIcon icon={faBed} size={25} color={'blue'}/></Text>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>{post.bed}</Text>
                </View>
                <View style={{margin:10, padding:1, flex:1, flexDirection:'row', justifyContent:"space-between"}}>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>Water <FontAwesomeIcon icon={faFaucet} size={25} color={'blue'}/></Text>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>{post.water}</Text>
                </View>
                <View style={{margin:10, padding:1, flex:1, flexDirection:'row', justifyContent:"space-between"}}>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>Toilet <FontAwesomeIcon icon={faToilet} size={25} color={'blue'}/></Text>
                    <Text style={{color: 'blue', fontSize:18, fontWeight:'bold'}}>{post.toilet}</Text>
                </View>

       
                
                
            </View>


            
        </ScrollView>

       

            <View style={{ flex:1, borderTopColor:'lightgrey',borderTopWidth:1,
            flexDirection:'row',backgroundColor: "white",
             position: 'absolute', height:150,
             width:'100%' ,bottom:0, alignItems:'center', justifyContent:'space-between'}}>
            <View>
            <Text style={{fontSize:22, fontWeight:'bold', marginHorizontal:20}}>
                    GH₵{(Math.round(post.newPrice*1.07)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {"\n"} / year
                    </Text>
            </View>
            <View style={{flex:1, flexDirection:'column', marginTop:10,}}>
            <Pressable
                
                
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginBottom: 20,
                    backgroundColor: 'deeppink',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    width:'80%',
                    marginHorizontal: 20,
                    borderRadius: 5,
                    justifyContent: 'center'
                }}  onPress={() => {
                    payRent();
                    logAnalyticsEvent();
                }}>
                    <Fontisto name="credit-card" size={25} style={{color: 'white' , margin: 10 ,}} />
                    <Text style={{
                        fontSize: 20,
                        color: 'white',
                        fontWeight: 'bold',
                    }}>Pay to Rent</Text>
            </Pressable> 
            <Pressable
                title="Call to Rent Event"
                
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginBottom: 20,
                    backgroundColor: 'blue',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '50%',
                    width:'80%',
                    marginHorizontal: 20,
                    borderRadius: 5,
                    justifyContent: 'center'
                }}  onPress={() => {
                    makeCall();
                    logAnalyticsEvent();
                }}>
                    <Fontisto name="phone" size={25} style={{color: 'white' , margin: 10 ,transform: [{ rotate: '90deg' }]}} />
                    <Text style={{
                        fontSize: 20,
                        color: 'white',
                        fontWeight: 'bold',
                    }}>Call to Rent</Text>
                </Pressable>

            </View>
                        </View>
            </View>
    
    );
};


export default (DetailedPost);