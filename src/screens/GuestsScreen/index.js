import React, {useState} from 'react';
import {View, Pressable, StatusBar ,Text, Platform} from 'react-native';
import * as Animatable from 'react-native-animatable';
import styles from './styles.js';
import {useNavigation, useRoute} from "@react-navigation/native";
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from "react-native-vector-icons/Fontisto";

const GuestsScreen = (props) => {
    const navigation = useNavigation();
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [rooms, setrooms] = useState(0);
    const route = useRoute();
    
    return (
        <LinearGradient
          colors={['#009245', '#FCEE21' ]}
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
        <Text style={styles.text_header}> How many {'\n'} people and rooms? </Text>
        <View style={{justifyContent: 'space-between', height: '100%'}}>
        <Animatable.View
        animation="fadeInUpBig"
        duration={1500} 
          style={styles.footer}
        >
                <View style={styles.row}>
                    <View>
                        <Text style={{fontWeight: 'bold'}}>Adults</Text>
                        <Text style={{color: 'darkgray'}}>Ages 13 or above</Text>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>

                        <Pressable 
                        onPress={() => setAdults(Math.max(0, adults - 1))}
                        style = {styles.button}
                        >
                            <Text style={{fontSize: 20, color: 'black'}}>-</Text>
                            
                        </Pressable>

                        <Text style={{marginHorizontal: 20, fontSize: 20}}>{adults}</Text>

                        <Pressable onPress={() => setAdults (adults + 1)}
                        style = {styles.button}
                        >
                            <Text style={{fontSize: 20, color: 'black'}}>+</Text>
                            
                        </Pressable>
                    </View>





                </View>


                <View style={styles.row}>
                    <View>
                        <Text style={{fontWeight: 'bold'}}>Children</Text>
                        <Text style={{color: 'darkgray'}}>2 - 12</Text>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>

                        <Pressable 
                        onPress={() => setChildren(Math.max(0, children - 1))}
                        style = {styles.button}
                        >
                            <Text style={{fontSize: 20, color: 'black'}}>-</Text>
                            
                        </Pressable>

                        <Text style={{marginHorizontal: 20, fontSize: 20}}>{children}</Text>

                        <Pressable onPress={() => setChildren (children + 1)}
                        style = {styles.button}
                        >
                            <Text style={{fontSize: 20, color: 'black'}}>+</Text>
                            
                        </Pressable>
                    </View>





                </View>




                <View style={styles.row}>
                <View>
                    <Text style={{fontWeight: 'bold'}}>Rooms</Text>
                    <Text style={{color: 'darkgray'}}>Number of Rooms</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>

                    <Pressable 
                    onPress={() => setrooms(Math.max(0, rooms - 1))}
                    style = {styles.button}
                    >
                        <Text style={{fontSize: 20, color: 'black'}}>-</Text>
                        
                    </Pressable>

                    <Text style={{marginHorizontal: 20, fontSize: 20}}>{rooms}</Text>

                    <Pressable onPress={() => setrooms (rooms + 1)}
                    style = {styles.button}
                    >
                        <Text style={{fontSize: 20, color: 'black'}}>+</Text>
                        
                    </Pressable>
                </View>





            </View>

            <Pressable 
                onPress={() => 
                    
                    navigation.navigate("Home", {
                        screen: 'Explore',
                        params: {
                            screen: 'SearchResults',
                            params:{
                                guests: rooms,
                                viewport: route.params.viewport,
                            }
                            
                        },

                    })
                
            
            
                }
                style={{
                    marginTop: Platform.OS === 'android' ? 150 : 330,
                    backgroundColor: 'blue',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 50,
                    marginHorizontal: 20,
                    borderRadius: 25,
                }}>
                    <Text style={{
                        fontSize: 20,
                        color: 'white',
                        fontWeight: 'bold',
                    }}>Search</Text>
                </Pressable>
            


            </Animatable.View>


            









        </View>
        
        </LinearGradient>
    );


};

export default GuestsScreen;