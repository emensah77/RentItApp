import React, {useState} from 'react';
import {View, Pressable, Image,StatusBar, TouchableOpacity ,Text, Platform} from 'react-native';
import * as Animatable from 'react-native-animatable';
import styles from './styles.js';
import {useNavigation, useRoute} from "@react-navigation/native";
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from "react-native-vector-icons/Fontisto";
import FastImage from 'react-native-fast-image';
const HouseTypeScreen = (props) => {
    const navigation = useNavigation();
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [rooms, setrooms] = useState(0);
    const route = useRoute();
    
    return (
        <LinearGradient
          colors={['#DD2476', '#FF512F' ]}
          start={{ x: 0.1, y: 0.2 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.container}
        >
            <StatusBar hidden={true} />
            <Pressable onPress={() => navigation.goBack()}>
                <Fontisto name="angle-left" size={25}  style={{color:'white', margin:20, marginTop:30}}/> 
            </Pressable>
            
        <View style={styles.header}>
   
          
        </View>
        <Text style={styles.text_header}> What are you{'\n'} looking for? </Text>
        <View style={{justifyContent: 'space-between', height: '100%'}}>
        <Animatable.View
        animation="fadeInUpBig"
        duration={1500} 
          style={styles.footer}
        >
                <TouchableOpacity style={styles.row}
                onPress={() => navigation.navigate('Destination Search')
                }>
                    <View style={{justifyContent:'center'}}>
                        <Text style={{fontWeight: 'bold'}}>Full Homes</Text>
                        <Text style={{color: 'darkgray'}}>Complete and full houses</Text>
                        
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
 
                    <FastImage
                            source={{
                                uri:'https://d5w4alzj7ppu4.cloudfront.net/cities/fullhome.jpeg',
                                headers: { Authorization: 'token' },
                                priority: FastImage.priority.high,
                                
                            }}
                            style={{
                                height:100,
                                width:100,
                                borderRadius:15,
                                resizeMode: 'cover'
                                
                            }}
                            />
                            
                        
                    </View>





                </TouchableOpacity>


                <TouchableOpacity style={styles.row} 
                onPress={() => navigation.navigate('Destination Search')
                    }>
                    <View style={{justifyContent:'center'}}>
                        <Text style={{fontWeight: 'bold'}}>Apartment</Text>
                        <Text style={{color: 'darkgray'}}>Fully furnished apartments</Text>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FastImage
                            source={{
                                uri:'https://d5w4alzj7ppu4.cloudfront.net/cities/apartment.jpeg',
                                headers: { Authorization: 'token' },
                                priority: FastImage.priority.high,
                                
                            }}
                            style={{
                                height:100,
                                width:100,
                                borderRadius:15,
                                resizeMode: 'cover'
                                
                            }}
                            />
                      
                       
                    </View>





                </TouchableOpacity>




                <TouchableOpacity style={styles.row}
                onPress={() => navigation.navigate('Destination Search')
                        }>
                <View style={{justifyContent:'center'}}>
                    <Text style={{fontWeight: 'bold'}}>1 and 2 bedroom</Text>
                    <Text style={{color: 'darkgray'}}>Single room, Self-Contain</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FastImage
                                source={{
                                    uri:'https://d5w4alzj7ppu4.cloudfront.net/cities/1bedroom.jpeg',
                                    headers: { Authorization: 'token' },
                                    priority: FastImage.priority.high,
                                    
                                }}
                                style={{
                                    height:100,
                                    width:100,
                                    borderRadius:15,
                                    resizeMode: 'cover'
                                    
                                }}
                                />
                      
                    
                </View>





            </TouchableOpacity>

            


            </Animatable.View>


            









        </View>
        
        </LinearGradient>
    );


};

export default HouseTypeScreen;