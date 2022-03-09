import React , {useState} from 'react';
import {View, Text, ScrollView,ImageBackground, TouchableOpacity ,StatusBar,TextInput, FlatList, Pressable} from 'react-native';
import styles from './styles.js';
import Entypo from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';
import {useNavigation} from "@react-navigation/native";

import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from "react-native-vector-icons/Fontisto";

const OnboardingScreen1 = (props) => {
    const navigation = useNavigation();

    const items = [
        {
            image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/fullhome.jpeg',
            title: 'Full Home',
            key: '1'
        },
        {
            image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/apartment.jpeg',
            title: 'Apartment',
            key: '2'

        },
        {
            image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/1bedroom.jpeg',
            title: 'Entire Flat',
            key: '3'
        },
        {
            image: 'https://i.insider.com/5ed812183ad861312272b2f5?width=700',
            title: 'Self-Contained',
            key: '4'
        },

        {
            image: 'https://pbs.twimg.com/media/CTbpP-AVEAARjVx.jpg',
            title: 'Mansion',
            key: '5'
        },

        {
            image: 'https://media-cdn.tripadvisor.com/media/photo-s/11/d7/82/0c/single-room.jpg',
            title: 'Single Room',
            key: '6'
        },
        
    ]
    
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
 
        <Text style={styles.text_header}> Tell us about  {'\n'} your home </Text>
      </View>
            
                
        
          
               
            <Animatable.View
        useNativeDriver={true}
        animation="fadeInUpBig"
        duration={1500} 
          style={styles.footer}
        >
        <ScrollView>
        
        <Text style={{fontSize:18, fontFamily:'Montserrat-Bold'}}> Select the type  {'\n'} of your home </Text>
        <FlatList
        data={items}
        renderItem={({item}) => {
            return (
                <TouchableOpacity style={styles.row}
                onPress={() => navigation.navigate('OnboardingScreen10', {
                    type: item.title
                })
                }>
                    <View style={{justifyContent:'center'}}>
                        <Text style={{fontWeight: 'bold'}}>{item.title}</Text>
                        
                        
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
 
                    <FastImage
                            source={{
                                uri:item.image,
                                headers: { Authorization: 'token' },
                                priority: FastImage.priority.high,
                                
                            }}
                            style={{
                                height:70,
                                width:70,
                                borderRadius:15,
                                resizeMode: 'cover'
                                
                            }}
                            />
                            
                        
                    </View>





                </TouchableOpacity>
            )
        }}
        />
            
           
               
            </ScrollView>
        </Animatable.View>
        
        

        </LinearGradient>
       
      
            
            
            
            
            
            
    );
};

export default OnboardingScreen1;