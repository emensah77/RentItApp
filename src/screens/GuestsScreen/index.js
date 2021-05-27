import React, {useState} from 'react';
import {View, Pressable ,Text} from 'react-native';

import styles from './styles.js';
import {useNavigation, useRoute} from "@react-navigation/native";
const GuestsScreen = (props) => {
    const navigation = useNavigation();
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [rooms, setrooms] = useState(0);
    const route = useRoute();
    
    return (

        <View style={{justifyContent: 'space-between', height: '100%'}}>
            <View>
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
                    marginBottom: 20,
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
            











        </View>
    );


};

export default GuestsScreen;