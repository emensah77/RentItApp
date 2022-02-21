import React , {useState} from 'react';
import {View, Alert,Text, ScrollView, Image, ImageBackground, TouchableOpacity ,StatusBar,TextInput, FlatList, Pressable, Dimensions} from 'react-native';
import styles from './styles.js';
import Entypo from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';
import {useNavigation} from "@react-navigation/native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus ,faFaucet, faBath, faBed, faToilet, faWifi, faWater, faCamera, faUpload, faCameraRetro, faFileUpload, faCloudUploadAlt, faArrowAltCircleUp, faPlusCircle} from '@fortawesome/free-solid-svg-icons'
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from "react-native-vector-icons/Fontisto";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const OnboardingScreen7 = (props) => {
    const navigation = useNavigation();
    const [images, setImages] = useState([]);

    const goHome = () => {
        Alert.alert("We will review your home, if approved it will be available for lease or sale",);
        navigation.replace('Home');
    }
    const openCamera = () => {
        const options = {
            storageOptions:{
                path: 'images',
                maxWidth: 1024,
                maxHeight: 683,
                

            }
        }
        launchCamera(options, response => {
            console.log('Response = ', response);
            if(response.didCancel){
                
                return;
            }
            else if(response.errorCode === 'camera_unavailable'){
                
                return;
            }
            else if(response.customButton){
                
                return;
            }
            else{
            const img = {
                uri: response.assets[0].uri,
                type: response.assets[0].type,
                name: response.assets[0].fileName || 'file'
            };

            setImages(prevImages => prevImages.concat(img));
            console.log(images);
        }
        })
        
        
        
  
    }
    const openLibrary = () => {
        
        launchImageLibrary({maxWidth:1024, maxHeight:683}, response => {
            console.log('Response = ', response);
            if(response.didCancel){
                
                return;
            }
            else if(response.error){
                
                return;
            }
            else if(response.customButton){
                
                return;

            }
            else{
            
            const img = {
                    uri: response.assets[0].uri,
                    type: response.assets[0].type,
                    name: response.assets[0].fileName || 'file'
                };

                setImages(prevImages => prevImages.concat(img));
                console.log(images);
            }
        
        })
        
        
        
  
    }

   
    
    return (
        
        <LinearGradient
        colors={['purple', 'deeppink' ]}
        start={{ x: 0.1, y: 0.2 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.container}
      >
          <StatusBar hidden={true} />
          <Pressable onPress={() => navigation.goBack()}>
              <Fontisto name="angle-left" size={25}  style={{color:'white', margin:20, marginTop:30}}/> 
          </Pressable>
          
          <View style={styles.header}>
 
        <Text style={styles.text_header}> We need to verify {'\n'} your home </Text>
      </View>
            
                
        
          
               
            <Animatable.View
        useNativeDriver={true}
        animation="fadeInUpBig"
        duration={1500} 
          style={styles.footer}
        >
        <Text style={{fontSize:18, fontFamily:'Montserrat-Bold'}}> Take a picture of your ID Card  {'\n'} and light bill of your home </Text>
   
                    
        {images.length != 0 ? 
            <View style={{flex:1,}}>
                <TouchableOpacity
                onPress={() => openLibrary()}
                 style={{padding:10,borderColor:'black',borderWidth:1,borderRadius:10,flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{fontSize:18,fontFamily:'Montserrat-Bold'}}>Add {images.length >= 5 ? 'more' : 'at least 5'} photos</Text>
                <TouchableOpacity
                onPress={() => openLibrary()}
                >

                <FontAwesomeIcon icon={faPlusCircle}  size={25} color={'black'}/>

                </TouchableOpacity>

                </TouchableOpacity>
                
                <FlatList
                data={images}
                numColumns={2}
                renderItem={({item}) => 
                <View style={{width:Dimensions.get('window').width/2,
                    height:200, flex:1, flexDirection:'column', margin:5}}>
                        <Image source={{uri:item.uri}} style={{borderRadius:10,flex:1, width:'100%', height:'100%', resizeMode:'cover'}} />
                    </View>
            }
                keyExtractor={(item, index) => index.toString()}
                
                />
            <TouchableOpacity disabled={images.length < 5 ? true : false} onPress={goHome} style={{left:250,width:100,backgroundColor:'deeppink',
             borderRadius:20, alignItems:'center', paddingHorizontal:20, paddingVertical:20, marginTop:15, opacity:images.length < 5 ? .2 : 1}}>
                <Text style={{color:'white', fontFamily:'Montserrat-Bold', fontSize:14}}>Submit</Text>
            </TouchableOpacity>
            </View>
        :

        <ScrollView>
        
        


           

        
                <TouchableOpacity
                onPress={() => openLibrary()}
                
                 style={{

                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    paddingVertical: 20,
                    borderWidth:  1,
                    borderColor: 'darkgray',
                    borderRadius:10,
                    marginVertical:20,
                    paddingHorizontal:20,
                    marginHorizontal: 20,
                    flex:1,
                    
            }}
                >
                    <View style={{justifyContent:'center'}}>
                        <Text style={{fontWeight: 'bold'}}>Upload a picture of your ID or bill</Text>
                        
                        
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
 
                    <FontAwesomeIcon icon={faArrowAltCircleUp}  size={30} color={'black'}/>
                            
                        
                    </View>

                    





                </TouchableOpacity>


                <TouchableOpacity
                onPress={ () => openCamera()}
                
                 style={{

                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    paddingVertical: 20,
                    borderWidth:  1,
                    borderColor: 'darkgray',
                    borderRadius:10,
                    marginVertical:20,
                    paddingHorizontal:20,
                    marginHorizontal: 20,
                    flex:1,
                    
            }}
                >
                    <View style={{justifyContent:'center'}}>
                        <Text style={{fontWeight: 'bold'}}>Take a picture of your ID or bill</Text>
                        
                        
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
 
                    <FontAwesomeIcon icon={faCamera}  size={30} color={'black'}/>
                            
                        
                    </View>

                    





                </TouchableOpacity>
            
            
        
            
            
            <TouchableOpacity disabled={images.length === 0 ? true : false} onPress={goHome} style={{left:250,width:100,backgroundColor:'deeppink',
             opacity: images.length === 0 ? .4 : 1, borderRadius:20, alignItems:'center', paddingHorizontal:20, paddingVertical:20}}>
                <Text style={{color:'white', fontFamily:'Montserrat-Bold', fontSize:14}}>Submit</Text>
            </TouchableOpacity>
 
            </ScrollView>

        }
        </Animatable.View>
        
        

        </LinearGradient>
       
      
            
            
            
            
            
            
    );
};

export default OnboardingScreen7;