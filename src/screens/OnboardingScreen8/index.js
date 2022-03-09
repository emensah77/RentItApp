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

const OnboardingScreen8 = (props) => {
    const navigation = useNavigation();
    const [selectedItem, setSelectedItem] = useState(null);
    const [isSelected, setisSelected] = useState(false);
    
    const [value, setValue] = useState('');
    const route = useRoute();
    const title = route.params?.title;
    const type = route.params?.type;
    const bed = route.params?.bed;
    const bedroom = route.params?.bedroom;
    const bathroom = route.params?.bathroom;
    const mode = route.params?.mode;
    
    const hellod = (text) => {
        setValue(text);
        
        
        
        
      };
    
      
    
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
 
        <Text style={styles.text_header}> Describe your home  {'\n'} in detail </Text>
      </View>
            
                
        
          
               
            <Animatable.View
        useNativeDriver={true}
        animation="fadeInUpBig"
        duration={1500} 
          style={styles.footer}
        >
        <ScrollView>
        
        
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>

           
               
                   <View style={{flex:1, marginBottom:20, alignItems:'center'}}>
                       
                        
                        <TextInput
                        adjustsFontSizeToFit={true}
                        placeholder="Tell us about where your home is located, including landmarks and amenities available"
                        multiline={true}
                        onChangeText={text => hellod(text)}
                        style={{alignContent:'flex-start',width:'100%',height:100,fontSize:18,fontWeight: 'bold'
                        ,borderWidth:  1,
                        borderColor: 'darkgray',borderRadius:10, padding:10}}></TextInput>
                       
                       
                       
                       
                        
                   </View>
                   
                   

                   

                   





               



               

            </View>
                
               
                    
            
            
        
        
            
            <TouchableOpacity disabled={value.length === 0} onPress={() => navigation.navigate('OnboardingScreen3', {
                title: title,
                bed: bed,
                bedroom: bedroom,
                bathroom: bathroom,
                description: value,
                type: type,
                mode: mode,
                
            })} style={{left:250,width:100,backgroundColor:'deeppink',
             borderRadius:20, opacity:value.length === 0 ? .4 : 1,alignItems:'center', paddingHorizontal:20, paddingVertical:20}}>
                <Text style={{color:'white', fontFamily:'Montserrat-SemiBold', fontSize:14}}>Next</Text>
            </TouchableOpacity>
               
            </ScrollView>
        </Animatable.View>
        
        

        </LinearGradient>
       
      
            
            
            
            
            
            
    );
};

export default OnboardingScreen8;