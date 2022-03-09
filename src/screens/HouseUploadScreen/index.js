import React , {useState} from 'react';
import {View, Text, ImageBackground, TouchableOpacity ,StatusBar,TextInput, FlatList, Pressable} from 'react-native';
import styles from './styles.js';
import Entypo from 'react-native-vector-icons/Entypo';

import {useNavigation} from "@react-navigation/native";

import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from "react-native-vector-icons/Fontisto";

const HouseUploadScreen = (props) => {
    const navigation = useNavigation();
    
    return (
        
            <>
        
            <ImageBackground 
                source={{uri:'https://envato-shoebox-0.imgix.net/f553/d600-29fe-48ea-8e10-d88c190c4d37/7_T13A4174.jpg?auto=compress%2Cformat&fit=max&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark2.png&markalign=center%2Cmiddle&markalpha=18&w=1600&s=d36a454b3e1ca7c15572d8b4bcddad6a'}} 
                style={styles.image}>
                <Pressable 
        style={{margin:20, shadowColor:"black", shadowOpacity:.5, shadowRadius:20, position: 'absolute', top: Platform.OS === "ios" ? 30 : 0, left: 0, 
        height:40, width:40, backgroundColor:"white",
        borderRadius:20, justifyContent:'center', alignItems:"center"}}
        onPress={() => navigation.goBack()}>
      <Fontisto name="angle-left" size={15}  style={{color:'black',}}/> 
    </Pressable>
                </ImageBackground>
            
                
        
          
        
        <Animatable.View
        useNativeDriver={true}
        animation="fadeInUpBig"
        duration={1500} 
          style={styles.footer}
        >
    
        
        <Text style={styles.text_header}> Upload your home in  {'\n'} 10 easy steps </Text>
        <TouchableOpacity onPress={() => navigation.navigate('OnboardingScreen1')} style={{borderRadius:10, paddingHorizontal:10, 
            marginHorizontal:15, paddingVertical:20, alignItems:'center',
             backgroundColor:'deeppink'}} >
                <Text style={{color:'white', fontSize:18,
        fontFamily:'Montserrat-Bold'}}>Let's go</Text>
            </TouchableOpacity>
            
           
               
          
        </Animatable.View>
        

        </>
       
      
            
            
            
            
            
            
    );
};

export default HouseUploadScreen;