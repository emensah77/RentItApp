import React , {useState, useEffect} from 'react';
import {View, Modal,ActivityIndicator,Text, ScrollView, Image, ImageBackground, TouchableOpacity ,StatusBar,TextInput, FlatList, Pressable, Dimensions, Alert} from 'react-native';
import styles from './styles.js';
import Entypo from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';
import {useNavigation, useRoute} from "@react-navigation/native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus ,faFaucet, faBath, faBed, faToilet, faWifi, faWater, faCamera, faUpload, faCameraRetro, faFileUpload, faCloudUploadAlt, faArrowAltCircleUp, faPlusCircle} from '@fortawesome/free-solid-svg-icons'
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from "react-native-vector-icons/Fontisto";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Amplify, {Storage} from 'aws-amplify';
import uuid from 'react-native-uuid';
import awsconfig from '../../../src/aws-exports';
Amplify.configure(awsconfig);

const OnboardingScreen4 = (props) => {
    const navigation = useNavigation();
    const [images, setImages] = useState([]);
    const [progressText, setProgressText] = useState(0);
    const [isLoading, setisLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState('');
    const [urls, setUrls] = useState([]);
    const route = useRoute();
    const title = route.params?.title;
    const bed = route.params?.bed;
    const bedroom = route.params?.bedroom;
    const bathroom = route.params?.bathroom;
    const type = route.params?.type;
    const description = route.params?.description;
    const mode = route.params?.mode;
    const amenities = route.params?.amenities;
    

    async function pathToImageFile(uri) {
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          await Storage.put(uuid.v4(), blob, {
              level: 'public',
            contentType: "image/jpeg", // contentType is optional
          });
        } catch (err) {
          console.log("Error uploading file:", err);
        }
      }
    
    const fetchResourceFromURI = async (uri) => {
        const response = await fetch(uri);
        //console.log(response);
        const blob = await response.blob();
        
        return blob;
      };
      
      useEffect(() => {
        
        
       
          if (imageUrls != ""){
            setUrls(prevImages => prevImages.concat(imageUrls))
          }
        
      }, [imageUrls])
      const uploadResource = async (image) => {
        if (isLoading) return;
        setisLoading(true);
        const img = await fetchResourceFromURI(image.uri);
        setImageUrls('https://d1mgzi0ytcdaf9.cloudfront.net/public/'+image.name);
        
        return Storage.put(image.name, img, {
          level: 'public',
          contentType: "image/jpeg",
          progressCallback(uploadProgress) {
              setProgressText((uploadProgress.loaded / uploadProgress.total)*100);
            // setProgressText(
            
            //   `Progress: ${Math.round(
            //     (uploadProgress.loaded / uploadProgress.total) * 100,
            //   )} %`,
            // );
            // Alert.alert(`Uploading: ${Math.round(
            //     (uploadProgress.loaded / uploadProgress.total) * 100,
            //   )}%`);
            
          },
        })
          .then(res => {
            
            
            setisLoading(false);
            Storage.get(res.key, {
                level:'public',
                contentType: 'image/jpeg'
            })
              .then(result => {
                  console.log(urls)
              })
              .catch(err => {
                setProgressText('Upload Error');
                console.log(err);
              });
          })
          .catch(err => {
            setisLoading(false);
            setProgressText('Upload Error');
            console.log(err);
          });
      };

    

    const openCamera = () => {
        const options = {
            storageOptions:{
                path: 'images',
                maxWidth: 1024,
                maxHeight: 683,
                

            }
        }
        launchCamera(options, response => {
            //console.log('Response = ', response);
            if(response.didCancel){
                
                return;
            }
            else if(response.errorCode === 'camera_unavailable'){
                
                return;
            }
            else if(response.customButton){
                
                return;
            }
            else {
            const img = {
                uri: response.assets[0].uri,
                type: response.assets[0].type,
                name: uuid.v4(),
            };
            
            setImages(prevImages => prevImages.concat(img));
            uploadResource(img);
            
        }
        })
        
        
        
  
    }
    const openLibrary = () => {
        
        launchImageLibrary({maxWidth:1024, maxHeight:683}, response => {
            //console.log('Response = ', response);
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
                name: uuid.v4(),
                };
                // pathToImageFile(img.uri);
                
                setImages(prevImages => prevImages.concat(img));
                uploadResource(img);
                

            }
        
        })
        
        
        
  
    }

   
    if (isLoading){ 
        
        
        return(
        
            <Modal
            transparent={true}
            animationType={'none'}
            visible={isLoading}
            style={{ zIndex: 1100 }}
            onRequestClose={() => { }}>
            <View style={{flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    zIndex: 1000}}>
              <View style={{backgroundColor: '#FFFFFF',
    height: 150,
    width: 150,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'}}>
                <Text style={{fontSize:24, fontWeight:'bold'}}>Uploading...</Text>
              <ActivityIndicator animating={true} size="large"  color="blue" style={{opacity:1}}/>
                
                
              </View>
            </View>
          </Modal>

           
         
      
         
       
      );}
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
 
        <Text style={styles.text_header}> Let's take pictures  {'\n'} of your home </Text>
      </View>
            
                
        
          
               
            <Animatable.View
        useNativeDriver={true}
        animation="fadeInUpBig"
        duration={1500} 
          style={styles.footer}
        >
            
                    
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
            <TouchableOpacity disabled={images.length < 5 ? true : false} onPress={() => navigation.navigate('OnboardingScreen5', {
                title: title,
                type: type,
                description: description,
                bed: bed,
                bedroom: bedroom,
                bathroom: bathroom,
                imageUrls: urls,
                mode: mode,
                amenities: amenities,
            })} style={{left:250,width:100,backgroundColor:'deeppink',
             borderRadius:20, alignItems:'center', paddingHorizontal:20, paddingVertical:20, marginTop:15, opacity:images.length < 5 ? .2 : 1}}>
                <Text style={{color:'white', fontFamily:'Montserrat-Bold', fontSize:18}}>Next</Text>
            </TouchableOpacity>
            </View>
        :

        <ScrollView>
        
        


           

        <Text style={{fontSize:18,fontWeight:"600", marginBottom:10}}>The first picture should be of the house or the living room, not the bathroom!</Text>
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
                        <Text style={{fontWeight: 'bold'}}>Upload photos</Text>
                        
                        
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
                        <Text style={{fontWeight: 'bold'}}>Take new photos</Text>
                        
                        
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
 
                    <FontAwesomeIcon icon={faCamera}  size={30} color={'black'}/>
                            
                        
                    </View>

                    





                </TouchableOpacity>
            
            
        
        
            
            <TouchableOpacity disabled={images.length === 0} onPress={() => navigation.navigate('OnboardingScreen5', {
                title: title,
                bed: bed,
                bedroom: bedroom,
                bathroom: bathroom,
                imageUrls: urls,
            })} style={{left:250,width:100,backgroundColor:'deeppink',
             opacity:images.length === 0 ? .4 : 1,borderRadius:20, alignItems:'center', paddingHorizontal:20, paddingVertical:20}}>
                <Text style={{color:'white', fontFamily:'Montserrat-Bold', fontSize:18}}>Next</Text>
            </TouchableOpacity>
 
            </ScrollView>

        }
        </Animatable.View>
        
        

        </LinearGradient>
       
      
            
            
            
            
            
            
    );
};

export default OnboardingScreen4;