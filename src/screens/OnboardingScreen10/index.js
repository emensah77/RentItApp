import React , {useEffect, useState} from 'react';
import {View, Text, ScrollView,ImageBackground, TouchableOpacity ,StatusBar,TextInput, FlatList, Pressable} from 'react-native';
import styles from './styles.js';
import Entypo from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';
import {useNavigation, useRoute} from "@react-navigation/native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils , faFan ,faFaucet, faBath, faBed, faToilet, faWifi, faWater} from '@fortawesome/free-solid-svg-icons'
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from "react-native-vector-icons/Fontisto";

const OnboardingScreen10 = (props) => {
    const navigation = useNavigation();
    const [selectedItem, setSelectedItem] = useState(null);
    const [isSelected, setisSelected] = useState(false);
    const [mode, setMode] = useState('');
    const route = useRoute();
    const type = route.params?.type;
    
    
    
    const increment = a => !a ;
    const onPressHandler = (id, isSelect, title) => {
        
        setSelectedItem(id);
        setisSelected(!isSelect);
        setMode(title);

        console.log(id, isSelect, isSelected);
        
  
    }

    const items = [
        {
            
            title: 'For Rent',
            description: 'You are renting your home to tenants, and require monthly payments and offering a stay limited by a time agreed upon. ',
            id: '1',
            isSelected: isSelected,
            
        },
        {
            
            title: 'For Sale',
            description: 'You are selling your home for a stipulated amount and are not offering a stay limited by time.',
            id: '2',
            isSelected: isSelected,
            

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
 
        <Text style={styles.text_header}> Are you renting or {'\n'} selling your home?</Text>
      </View>
            
                
       
          
               
            <Animatable.View
        useNativeDriver={true}
        animation="fadeInUpBig"
        duration={1500} 
          style={styles.footer}
        >
        <ScrollView>
        
        
        <FlatList
        data={items}
        renderItem={({item}) => {
            return (
                <TouchableOpacity
                onPress={() => onPressHandler(item.id, item.isSelected, item.title)}
                 style={{

                    flexDirection: 'column', 
                    justifyContent: 'space-between', 
                    paddingVertical: 20,
                    borderWidth: item.isSelected === true && item.id === selectedItem ? 1.5 : .5,
                    borderColor: item.isSelected === true && item.id === selectedItem ? 'black' : 'darkgray',
                    backgroundColor: item.isSelected === true && item.id === selectedItem ? 'gainsboro' : 'white',
                    borderRadius:10,
                    marginVertical:20,
                    paddingHorizontal:20,
                    marginHorizontal: 20,
                    flex:1,
                    
            }}
                >
                    <View style={{justifyContent:'center'}}>
                        <Text style={{fontWeight: 'bold'}}>{item.title}</Text>
                        
                        
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
 
                    <Text>{item.description}</Text>
                            
                        
                    </View>





                </TouchableOpacity>
            )
        }}
        />
            
            <TouchableOpacity disabled={isSelected === false} onPress={() => navigation.navigate('OnboardingScreen2',{
                type: type,
                mode: mode,
                
            })} style={{left:250,width:100,backgroundColor:'deeppink',
             borderRadius:20, opacity: isSelected === false ? .4 : 1,alignItems:'center', paddingHorizontal:20, paddingVertical:20}}>
                <Text style={{color:'white', fontFamily:'Montserrat-Bold', fontSize:18}}>Next</Text>
            </TouchableOpacity>
               
            </ScrollView>
        </Animatable.View>
        
        

        </LinearGradient>
       
      
            
            
            
            
            
            
    );
};

export default OnboardingScreen10;