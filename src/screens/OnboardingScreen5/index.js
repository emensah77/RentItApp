import React , {useState, useEffect} from 'react';
import {View, Text,Alert, TextInput, ScrollView,ImageBackground, TouchableOpacity ,StatusBar, FlatList, Pressable} from 'react-native';
import styles from './styles.js';
import Entypo from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';
import {useNavigation, useRoute} from "@react-navigation/native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils , faFan ,faFaucet, faBath, faBed, faToilet, faWifi, faWater, faCamera, faUpload, faCameraRetro, faFileUpload, faCloudUploadAlt, faArrowAltCircleUp} from '@fortawesome/free-solid-svg-icons'
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from "react-native-vector-icons/Fontisto";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const OnboardingScreen5 = (props) => {
    const navigation = useNavigation();
    const [selectedItem, setSelectedItem] = useState(null);
    const [isSelected, setisSelected] = useState(false);
    const [homeprice, sethomeprice] = useState(1);
    const [value, setValue] = useState();
    const route = useRoute();
    const title = route.params?.title
    const type = route.params?.type;
    const description = route.params?.description;
    const bed = route.params?.bed;
    const bedroom = route.params?.bedroom;
    const bathroom = route.params?.bathroom;
    const imageUrls = route.params?.imageUrls;
    const mode = route.params?.mode;
    const amenities = route.params?.amenities;
    const hellod = (text) => {
        setValue(parseInt(text));
        
        sethomeprice(value);
        
        
      };
    
    const setHomePrice = () => {
        
    }
    
    return (
        
        <LinearGradient
        colors={['blue', 'deeppink' ]}
        start={{ x: 0.1, y: 0.2 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.container}
      >
          <StatusBar hidden={true} />
          <Pressable onPress={() => navigation.goBack()}>
              <Fontisto name="angle-left" size={25}  style={{color:'white', margin:20, marginTop:30}}/> 
          </Pressable>
          
          <View style={styles.header}>
 
        <Text style={styles.text_header}> Let's set the price  {'\n'} of your home </Text>
      </View>
            
                
        
          
               
            <Animatable.View
        useNativeDriver={true}
        animation="fadeInUpBig"
        duration={1500} 
          style={styles.footer}
        >
        <ScrollView>
        
        
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>

            <TouchableOpacity
                onPress={() => setValue(Math.max(1, value - 1))}
                style={{

                    
                    alignItems:'center',
                    alignSelf:'center', 
                    justifyContent:'center',
                    borderWidth:  2,
                    borderColor: 'darkgray',
                    
                    height:40,
                    width:40,
                    borderRadius:20
                    
            }}
               >
                   <View style={{justifyContent:'center'}}>
                       <Text style={{fontSize:18, fontWeight: 'bold'}}>-</Text>
                       
                       
                   </View>

                   

                   





               </TouchableOpacity>


               
               <View style={{flex:1, flexDirection:'row', marginBottom:20, justifyContent:'center'}}>
                       
                        <Text style={{alignSelf:'center',fontSize:24,fontWeight:'600'}}>GHS</Text>
                       
                       <TextInput
                       adjustsFontSizeToFit={true}
                       
                       placeholder="1"
                       placeholderTextColor={"black"}
                       autoFocus={true}
                       maxLength={50}
                       keyboardType={"numeric"}
                       onChangeText={(text) => hellod(text)}
                       style={{alignContent:'flex-start',width:'50%',height:70,fontSize:20,fontWeight: 'bold'
                       ,borderWidth:  1,
                       borderColor: 'darkgray',borderRadius:10, padding:10}}>{value}</TextInput>
                      
                      <Text style={{alignSelf:'center', fontWeight:'500'}}>per month</Text>
                      
                      
                       
                  </View>
                   

                   

                   





              



               <TouchableOpacity
                 onPress={() => setValue(Math.max(1, value + 1))}
                 style={{

                    
                    alignItems:'center',
                    alignSelf:'center', 
                    justifyContent:'center',
                    borderWidth:  2,
                    borderColor: 'darkgray',
                    
                    height:40,
                    width:40,
                    borderRadius:20
                    
            }}
                >
                    <View style={{justifyContent:'center'}}>
                        <Text style={{fontSize:25,fontWeight: 'bold'}}>+</Text>
                        
                        
                    </View>

                    

                    





                </TouchableOpacity>





            </View>
                
               
                    
            
            
        
        
            
            <Pressable onPress={() => navigation.navigate('OnboardingScreen6', {
                title: title,
                type: type,
                description: description,
                bed: bed,
                bedroom: bedroom,
                bathroom: bathroom,
                imageUrls: imageUrls,
                homeprice: value,
                mode: mode,
                amenities: amenities,
            })} style={{left:250,width:100,backgroundColor:'deeppink',
             borderRadius:20, alignItems:'center', paddingHorizontal:20, paddingVertical:20}}>
                <Text style={{color:'white', fontFamily:'Montserrat-SemiBold', fontSize:14}}>Next</Text>
            </Pressable>
               
            </ScrollView>
        </Animatable.View>
        
        

        </LinearGradient>
       
      
            
            
            
            
            
            
    );
};

export default OnboardingScreen5;