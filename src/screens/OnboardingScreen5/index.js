import React , {useState} from 'react';
import {View, Text,Alert, TextInput, ScrollView,ImageBackground, TouchableOpacity ,StatusBar, FlatList, Pressable} from 'react-native';
import styles from './styles.js';
import Entypo from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';
import {useNavigation} from "@react-navigation/native";
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
    const [value, setValue] = useState('1')
    const hellod = (text) => {
        setValue(text);
        
        sethomeprice(parseInt(value));
        
        
      };
    
   const goHome = () => {
    Alert.alert("We will review your home, if approved it will be available for lease or sale",);
    navigation.replace('Home');
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
                onPress={() => sethomeprice(Math.max(1, homeprice - 1))}
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


               <TouchableOpacity
                
                style={{

                   flexDirection: 'row', 
                   alignItems:'center',
                   alignSelf:'center', 
                   paddingVertical: 20,
                   borderWidth:  1,
                   borderColor: 'darkgray',
                   borderRadius:10,
                   marginVertical:20,
                   paddingHorizontal:20,
                   marginHorizontal: 20,
                   
                   width:150,
                   
           }}
               >
                   <View style={{flex:1}}>
                       <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                        <Text adjustsFontSizeToFit={true} style={{fontSize:30, fontWeight:'bold'}}>GH₵</Text>
                        <TextInput
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}    
                        onChangeText={text => hellod(text)}
                        style={{alignSelf:'center',fontSize:30,fontWeight: 'bold'
                        }}>{homeprice}</TextInput>
                       </View>
                       
                       
                       <Text>per month</Text>
                        
                   </View>
                   
                   

                   

                   





               </TouchableOpacity>



               <TouchableOpacity
                 onPress={() => sethomeprice(Math.max(1, homeprice + 1))}
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
                
               
                    
            
            
        
        
            
            <Pressable onPress={() => navigation.navigate('OnboardingScreen6')} style={{left:250,width:100,backgroundColor:'deeppink',
             borderRadius:20, alignItems:'center', paddingHorizontal:20, paddingVertical:20}}>
                <Text style={{color:'white', fontFamily:'Montserrat-SemiBold', fontSize:14}}>Next</Text>
            </Pressable>
               
            </ScrollView>
        </Animatable.View>
        
        

        </LinearGradient>
       
      
            
            
            
            
            
            
    );
};

export default OnboardingScreen5;