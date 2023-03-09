import React, {useEffect,useContext, useState} from "react";
import {View,Image,FlatList,TextInput, TouchableOpacity ,Modal ,Text, ScrollView, Platform, Linking ,Pressable, StatusBar, Alert} from "react-native";
import styles from './styles.js';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {FlatListSlider} from 'react-native-flatlist-slider';
import { withAuthenticator } from 'aws-amplify-react-native';
import Amplify from '@aws-amplify/core';
import Feather from 'react-native-vector-icons/Feather';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils , faFan, faPencilAlt ,faFaucet, faBath, faBed, faToilet, faBackward, faTimes} from '@fortawesome/free-solid-svg-icons'
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

import {API, graphqlOperation} from 'aws-amplify';
import {deletePost, updatePost} from '../../graphql/mutations';

const DetailedPost = (props) => {
    const post = props.post;
    const navigation = useNavigation();
    const route = useRoute();
    const {user, logout} = useContext(AuthContext);
    const [modalvisible, setmodalvisible] = useState(false);
    const randString = route.params.randString;
    const [phoneNumbers, setphones] = useState([]);
    const [usersWithPrivileges, setUsersWithPrivileges] = useState([]);
    const [value, setValue] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [homeprice, sethomeprice] = useState(1);

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
    const hellod1 = (text) => {
        setValue(parseInt(text));
        
        sethomeprice(value);
        console.log(value);
        
      };
    const helloTitle = (text) => {
        setTitle(text);
        console.log(title);
        
        
        
      };
      const helloDescrip = (text) => {
        setDescription(text);
        console.log(description);
        
        
        
      };
    

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
            post: post,
            price: Math.round(post.newPrice*1.07), 
            homeimage: post.image,
            hometitle: post.title,
            homebed: post.bed,
            homelatitude: post.latitude,
            homelongitude: post.longitude,
            postid: post.id,
            

        });
    }
    const makeCall = (number) => {
        
        
        let phoneNumber = number;
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
      const updateHome = async (id) => {
        try {
            let input = {
              id: id,
              title: title,
              description: description,
              newPrice: value,
            }
            const deletedTodo  = await API.graphql(
              graphqlOperation(updatePost, {
      
                input
              })
      
            );
            console.log("Succesfully updated the home");
            setmodalvisible(false);
          }
          catch(e){
            console.log('Error updating home', e);
          }
        }
      
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
      const sendWhatsApp = () => {
        let msg = "I am interested in this home " + `https://rentit.homes/rooms/room/${post.id}` + " " + `${post.title}` + " which is located in " + `${post.locality}` + " , " + `${post.sublocality}` + " and the price is " + `${Math.round((post.newPrice / 12)*1.07)}` + " per month";
        let phoneWithCountryCode =  '+233' + phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
        let mobile =
          Platform.OS == "ios" ? phoneWithCountryCode : "+" + phoneWithCountryCode;
        if (mobile) {
          if (msg) {
            let url = "whatsapp://send?text=" + msg + "&phone=" + mobile;
            Linking.openURL(url)
              .then(data => {
                console.log("WhatsApp Opened");
              })
              .catch(() => {
                alert("Make sure WhatsApp installed on your device");
              });
          } else {
            alert("Please insert message to send");
          }
        } else {
          alert("Please insert mobile no");
        }
      };
   

    return(
        <View style={{flex:1,backgroundColor:'white'}}>

            <Modal style = {{flex: 1,
                        alignItems: 'center',
                        backgroundColor: 'white',
                        padding: 20, }} animationType = {"slide"} transparent = {false}
                        visible = {modalvisible}
                        onRequestClose = {() => { 
                            navigation.goBack();
                            console.log("Modal has been closed.") 
                            } }
                        >
                            
                        

                        
                            <ScrollView contentContainerStyle={{flex:1, flexDirection:"column", justifyContent:"space-evenly"}}>
                                
                                <View style={{padding:10}}>
                                    <Text>Title</Text>
                                    <TextInput
                                    adjustsFontSizeToFit={true}
                                    placeholder={post.title}
                                    multiline={true}
                                    maxLength={50}
                                    onChangeText={text => helloTitle(text)}
                                    style={{alignContent:'flex-start',width:'100%',height:40,fontSize:18,fontWeight: 'bold'
                                    ,borderWidth:  1,
                                    borderColor: 'darkgray',borderRadius:10, padding:10}}></TextInput>
                                
                                   
                                </View>

                                <View style={{padding:10}}>
                                    <Text>Price</Text>
                                    <TextInput
                                    adjustsFontSizeToFit={true}
                                    placeholder={JSON.stringify(post.newPrice)}
                                    multiline={true}
                                    maxLength={50}
                                    onChangeText={text => hellod1(text)}
                                    style={{alignContent:'flex-start',width:'100%',height:40,fontSize:18,fontWeight: 'bold'
                                    ,borderWidth:  1,
                                    borderColor: 'darkgray',borderRadius:10, padding:10}}></TextInput>
                                
                       
                                   
                                </View>


                                <View style={{padding:10}}>
                                    <Text>Description</Text>
                                    <TextInput
                                    adjustsFontSizeToFit={true}
                                    placeholder={post.description}
                                    multiline={true}
                                    //maxLength={50}
                                    onChangeText={text => helloDescrip(text)}
                                    style={{alignContent:'flex-start',width:'100%',height:80,fontSize:18,fontWeight: 'bold'
                                    ,borderWidth:  1,
                                    borderColor: 'darkgray',borderRadius:10, padding:10}}></TextInput>
                                
                                   
                                </View>
                                

                                
                            
                            
                            
                              
                            <TouchableOpacity onPress={() => updateHome(post.id)} style={{height:40,margin:20,borderRadius:10,alignItems:"center",backgroundColor:"black"}}>
                                    <Text style={{paddingTop:10,color:"white"}}>Update</Text>
                                </TouchableOpacity>
  
                            
                            
                            
                            </ScrollView>


                           
                        
                        
            </Modal>

        <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{paddingBottom:100}}  showsVerticalScrollIndicator={false}>
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
                
                {usersWithPrivileges.includes(user.uid) ? 
                <Pressable onPress={() => makeCall(post.phoneNumbers)} style={{margin:5,paddingRight:5,alignItems:"center",flexDirection:"row",justifyContent:"space-evenly",width:"40%",backgroundColor:"blue",borderRadius:5}}>
                     <Fontisto name="phone" size={15} style={{color: 'white' , margin: 10 ,transform: [{ rotate: '90deg' }]}} ></Fontisto>
                     <Text style={{color:"white"}}>Call Homeowner</Text>
                     
                     </Pressable>
                      : null}
                {usersWithPrivileges.includes(user.uid) ? 
                <Pressable onPress={() => makeCall(post.marketerNumber)} style={{borderColor:"black",margin:5,paddingRight:5,alignItems:"center",flexDirection:"row",justifyContent:"space-evenly",width:"40%",backgroundColor:"yellow",borderRadius:5}}>
                     <Fontisto name="phone" size={15} style={{color: 'black' , margin: 10 ,transform: [{ rotate: '90deg' }]}} ></Fontisto>
                     <Text style={{color:"black"}}>Call Marketer</Text>
                     
                     </Pressable>
                      : null}
                    
                <View style={{flex:1, flexDirection:"row",
                 justifyContent:"space-between"}}>
                    <View>
                    <Text style={styles.prices}>
                    {/* <Text style={styles.oldPrice}>
                    GH₵{post.oldPrice} 
                    </Text> */}
                    {post.mode === "For Sale" ? 
                <Text style={styles.newPrice}>
                {post.currency === null ?
                  
                  "GH₵"
                 : 
                 
                   post.currency[0] === "usd" ? "$" : "GH₵"
                 
                 }
                 
                {Math.round((post.newPrice * 1.07))
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                
              </Text> :
                <Text style={styles.newPrice}>
                  {post.currency === null ?
                  
                   "GH₵"
                  : 
                  
                    post.currency[0] === "usd" ? "$" : "GH₵"
                  
                  }
                
                
                {Math.round((post.newPrice * 1.07)/12)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                / month
                </Text>}
                <View style={styles.hairline}/>
                </Text>
                    </View>
                    <Pressable onPress={sendWhatsApp}  style={{flexDirection:"row",alignItems:"center",
                    width:"40%",borderRadius:5,
                    padding:5,backgroundColor:"limegreen",
                    margin:10, justifyContent:"space-evenly"}}>
                        <Fontisto name="whatsapp" size={20}/>
                        <Text>Chat to Rent</Text>
                        
                    </Pressable>
                </View>
                
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
                <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={styles.longDescription}>
                    {post.createdAt} 
                </Text>
                {usersWithPrivileges.includes(user.uid) ?
                <Pressable onPress={() => setmodalvisible(true)} style={{padding:15}}>
                <FontAwesomeIcon icon={faPencilAlt} size={25}/>
                </Pressable> : null}
                
                </View>
                
                <View style={styles.hairline}/>
<Text style={{margin: 10, fontSize:20, fontFamily:"Montserrat-Bold"}}>
  Amenities available
</Text>
<View style={styles.amenitiesContainer}>
  {post.aircondition === 'Yes' &&
    <View style={styles.amenityCard}>
      <FontAwesomeIcon icon={faFan} size={25} color={'blue'} />
      <Text style={styles.amenityText}>Air Conditioner</Text>
    </View>
  }
  {post.wifi === 'Yes' &&
    <View style={styles.amenityCard}>
      <Feather name="wifi" size={25} color={'blue'} />
      <Text style={styles.amenityText}>Wifi</Text>
    </View>
  }
  {post.kitchen === 'Yes' &&
    <View style={styles.amenityCard}>
      <FontAwesomeIcon icon={faUtensils} color={'blue'} />
      <Text style={styles.amenityText}>Kitchen</Text>
    </View>
  }
  {post.bathroom === 'Yes' &&
    <View style={styles.amenityCard}>
      <FontAwesomeIcon icon={faBath} size={25} color={'blue'} />
      <Text style={styles.amenityText}>Bathroom</Text>
    </View>
  }
  {post.bed === 'Yes' &&
    <View style={styles.amenityCard}>
      <FontAwesomeIcon icon={faBed} size={25} color={'blue'} />
      <Text style={styles.amenityText}>Bedroom</Text>
    </View>
  }
  {post.water === 'Yes' &&
    <View style={styles.amenityCard}>
      <FontAwesomeIcon icon={faFaucet} size={25} color={'blue'} />
      <Text style={styles.amenityText}>Water</Text>
    </View>
  }
  {post.toilet === 'Yes' &&
    <View style={styles.amenityCard}>
      <FontAwesomeIcon icon={faToilet} size={25} color={'blue'} />
      <Text style={styles.amenityText}>Toilet</Text>
    </View>
  }
</View>




       
                
                
            </View>


            
        </ScrollView>

       </View>

        <View style={{
  position: 'absolute',
  bottom: 0,
  borderTopColor: 'lightgrey',
  borderTopWidth: 1,
  flexDirection: 'row',
  backgroundColor: 'white',
  height: 80,
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between'
}}>
  <View>
    {post.mode === 'For Sale' ? (
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginHorizontal: 20 }}>
        {post.currency === null ? 'GH₵' : post.currency[0] === 'usd' ? '$' : 'GH₵'}
        {(Math.round(post.newPrice * 1.07)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{'\n'}
      </Text>
    ) : (
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginHorizontal: 20 }}>
        {post.currency === null ? 'GH₵' : post.currency[0] === 'usd' ? '$' : 'GH₵'}
        {(Math.round(post.newPrice * 1.07 / 12)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{'\n'} / month
      </Text>
    )}
  </View>
  <View style={{ marginTop: 10, marginHorizontal: 40 }}>
    <Pressable
      style={{
        marginBottom: 10,
        backgroundColor: 'deeppink',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: '100%',
        marginHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center'
      }}
      onPress={() => {
        payRent();
        logAnalyticsEvent();
      }}>
      <Text style={{
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
      }}>Pay to Rent</Text>
    </Pressable>
  </View>
</View>

            </View>
    
    );
};


export default (DetailedPost);