import React , {useState, useRef, useEffect} from 'react';
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
import PhoneInput from "react-native-phone-number-input";
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'

const OnboardingScreen11 = (props) => {
    const navigation = useNavigation();
    const [selectedItem, setSelectedItem] = useState(null);
    const [isSelected, setisSelected] = useState(false);
    const [usersWithPrivileges, setUsersWithPrivileges] = useState([]);
    
    const [phoneNumber, setValue] = useState('');
    const route = useRoute();
    const title = route.params?.title
    const bed = route.params?.bed;
    const bedroom = route.params?.bedroom;
    const bathroom = route.params?.bathroom;
    const imageUrls = route.params?.imageUrls;
    const homeprice = route.params?.homeprice;
    const latitude = route.params?.latitude;
    const longitude = route.params?.longitude;
    const type = route.params?.type;
    const description = route.params?.description;
    const mode = route.params?.mode;
    const amenities = route.params?.amenities;
    const locality = route.params?.locality;
    const sublocality =  route.params?.sublocality;
    const [value, setPhoneValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [secondformattedValue, setSecondFormattedValue] = useState("");
    const phoneInput = useRef(null);
    
    const hellod = (text) => {
        setValue(text);
        
       
        
        
      };
    
    const setHomePrice = () => {
        
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
   
    getUsersWithPrivileges();
},[])
    
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
 
        <Text style={styles.text_header}> We need  {'\n'} your phone number </Text>
      </View>
            
                
        
          
               
            <Animatable.View
        useNativeDriver={true}
        animation="fadeInUpBig"
        duration={1500} 
          style={styles.footer}
        >
        <ScrollView>
        
        <Text style={{fontSize:18,fontWeight:"600", marginBottom:10}}>We will call you to verify the number</Text>
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>


            
               
               {/* <View style={{flex:1, flexDirection:'row', marginBottom:20, justifyContent:'center'}}>
                       
                       
                       
                       <TextInput
                       adjustsFontSizeToFit={true}
                       
                       placeholder="0245789567"
                       placeholderTextColor={"grey"}
                       autoFocus={true}
                       maxLength={10}
                       keyboardType={"numeric"}
                       onChangeText={(text) => hellod(text)}
                       style={{alignContent:'flex-start',width:'50%',height:70,fontSize:20,fontWeight: 'bold'
                       ,borderWidth:  1,
                       borderColor: 'darkgray',borderRadius:10, padding:10}}>{phoneNumber}</TextInput>
                      
                    
                      
                      
                       
                  </View> */}
                   

                   

                   





              



               



            
            </View>



            <View style={{alignItems:'center', padding:20}}>
            <PhoneInput
           ref={phoneInput}
           defaultValue={phoneNumber}
           defaultCode="GH"
           layout="first"
           onChangeText={(text) => {
             setValue(text);
           }}
           onChangeFormattedText={(text) => {
             setSecondFormattedValue(text);
           }}
           countryPickerProps={{ withAlphaFilter: true }}
           withShadow
           autoFocus
           containerStyle={{borderRadius:5}}
           textContainerStyle={{backgroundColor:'lightgrey'}}
         />
            </View>
           {
            usersWithPrivileges ? 

            

            <View style={{alignItems:'center', padding:20}}>
              <Text style={{fontWeight:"bold", margin:10}}>Add Marketer's Number</Text>
            <PhoneInput
           ref={phoneInput}
           defaultValue={value}
           defaultCode="GH"
           layout="first"
           onChangeText={(text) => {
             setPhoneValue(text);
           }}
           onChangeFormattedText={(text) => {
             setFormattedValue(text);
           }}
           countryPickerProps={{ withAlphaFilter: true }}
           withShadow
           autoFocus
           containerStyle={{borderRadius:5}}
           textContainerStyle={{backgroundColor:'lightgrey'}}
         />
            </View>
               
            
            :
            null
           }
             
            <Text style={{fontWeight:'600'}}>Your Phone Number: {secondformattedValue}</Text>  
                    
            
            
        
        
            
            <TouchableOpacity disabled={value.length < 9 && phoneNumber.length < 9} onPress={() =>
            {
            const checkValid = phoneInput.current?.isValidNumber(value);
            const checkSecondValid = phoneInput.current?.isValidNumber(phoneNumber);
            if(checkValid && checkSecondValid){
              Alert.alert('Your phone number is correct', secondformattedValue);
              navigation.navigate('OnboardingScreen7', {
                title: title,
                type: type,
                description: description,
                bed: bed,
                bedroom: bedroom,
                bathroom: bathroom,
                imageUrls: imageUrls,
                homeprice: homeprice,
                latitude: latitude,
                longitude: longitude,
                mode: mode,
                amenities: amenities,
                phoneNumber: secondformattedValue,
                marketerNumber: usersWithPrivileges ? formattedValue : null,
                locality: locality,
                sublocality: sublocality,
            })
            }
            else{
              Alert.alert('Your phone number is not correct', formattedValue);
            }
             }} style={{opacity: value.length < 9 && phoneNumber.length < 9 ? .2 : 1,left:250,width:100,backgroundColor:'deeppink',
             borderRadius:20, alignItems:'center', paddingHorizontal:20, paddingVertical:20}}>
                <Text style={{color:'white', fontFamily:'Montserrat-SemiBold', fontSize:14}}>Next</Text>
            </TouchableOpacity>
               
            </ScrollView>
        </Animatable.View>
        
        

        </LinearGradient>
       
      
            
            
            
            
            
            
    );
};

export default OnboardingScreen11;