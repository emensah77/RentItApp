import React, { useContext, useEffect, useState, useRef } from 'react';
import {Share, FlatList ,StatusBar,View ,SafeAreaView ,Dimensions, Text, Pressable, Image, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform, Alert} from 'react-native';
import PhoneInput from "react-native-phone-number-input";
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = ({props}) => {
    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const phoneInput = useRef(null);
    const navigation = useNavigation();

    return (
        <View style={{flex:1, top:100, padding:10, backgroundColor:'white'}}>
            <Text style={{fontSize:32,fontWeight:'bold', padding:10}}>Hi, Welcome</Text>
            <Text style={{fontWeight:'400',fontSize:18, padding:10}}>We are glad you are here. We began RentIt to make it easier for people like you 
                to find homes they love!

                 
            </Text>
            <Text style={{fontWeight:'400', fontSize:18, padding:10}}>We really hope you find the home you love, because we truly 
                believe everyone deserves a home!
            </Text>
            <View style={{alignItems:'center', padding:20}}>
            <PhoneInput
           ref={phoneInput}
           defaultValue={value}
           defaultCode="GH"
           layout="first"
           onChangeText={(text) => {
             setValue(text);
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
            
            <TouchableOpacity
            
            onPress={() => {
                const checkValid = phoneInput.current?.isValidNumber(value);
                var trendRef = firestore().collection('users').doc(auth().currentUser.uid);
                if(checkValid){
                    Alert.alert('Your phone number is valid', formattedValue)
                    
                    var getDoc = trendRef.get()
                    .then(doc => {
                        if (doc.exists) {
                        firestore().collection('users').doc(auth().currentUser.uid)
                        .update({
                            
                            phoneNumber: formattedValue,
                        })
                        navigation.navigate('Home')
                        console.log('User phonenumber successfully added');
                        
                        } else {
                            
                            console.log('User does not already exists');
                            return;
                            
                        }
              
            })
                
                }
                else{
                    Alert.alert('Your phone number is not correct', formattedValue)
                }
              }}
            
            style={{borderRadius:15,backgroundColor:'deeppink', width:100,
             height:50, marginLeft:10,justifyContent:'center', alignItems:'center'

        }}>
                <Text style={{fontWeight:'bold', fontSize:18, color:'white'}}>Continue</Text>
            </TouchableOpacity>
        </View>
    )

}



export default WelcomeScreen;