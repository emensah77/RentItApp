import React, {useState} from 'react';
import {View, Pressable ,Text} from 'react-native';

import styles from './styles.js';
import {useNavigation} from "@react-navigation/native";
const GuestsScreen = (props) => {
    const navigation = useNavigation();
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
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
                    <Text style={{fontWeight: 'bold'}}>Infants</Text>
                    <Text style={{color: 'darkgray'}}>Under 2</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>

                    <Pressable 
                    onPress={() => setInfants(Math.max(0, infants - 1))}
                    style = {styles.button}
                    >
                        <Text style={{fontSize: 20, color: 'black'}}>-</Text>
                        
                    </Pressable>

                    <Text style={{marginHorizontal: 20, fontSize: 20}}>{infants}</Text>

                    <Pressable onPress={() => setInfants (infants + 1)}
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