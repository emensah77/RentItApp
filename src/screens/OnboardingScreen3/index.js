import React , {useState} from 'react';
import {View, Text, ScrollView,ImageBackground, TouchableOpacity ,StatusBar,TextInput, FlatList, Pressable} from 'react-native';
import styles from './styles.js';
import Entypo from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';
import {useNavigation} from "@react-navigation/native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils , faFan ,faFaucet, faBath, faBed, faToilet, faWifi, faWater} from '@fortawesome/free-solid-svg-icons'
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from "react-native-vector-icons/Fontisto";

const OnboardingScreen3 = (props) => {
    const navigation = useNavigation();
    const [selectedItem, setSelectedItem] = useState(null);
    const [isSelected, setisSelected] = useState(false);
    const increment = a => !a ;
    const onPressHandler = (id, isSelect) => {
        
        setSelectedItem(id);
        setisSelected(!isSelect);
        console.log(id, isSelect, isSelected);
        
  
    }

    const items = [
        {
            icon: faFan,
            title: 'Air Conditioner',
            id: '1',
            isSelected: isSelected,
            
        },
        {
            icon: faWifi,
            title: 'WiFi',
            id: '2',
            isSelected: isSelected,
            

        },
        {
            icon: faUtensils,
            title: 'Kitchen',
            id: '3',
            isSelected: isSelected,
            
        },
        {
            icon: faFaucet,
            title: 'Water',
            id: '4',
            isSelected: isSelected,
            
        },
        {
            icon: faToilet,
            title: 'Toilet',
            id: '5',
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
 
        <Text style={styles.text_header}> Choose amenities in  {'\n'} your home </Text>
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
                onPress={ () => onPressHandler(item.id, item.isSelected)}
                 style={{

                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    paddingVertical: 20,
                    borderWidth: item.isSelected === true && item.id === selectedItem ? 3 : 1,
                    borderColor: item.isSelected === true && item.id === selectedItem ? 'black' : 'darkgray',
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
 
                    <FontAwesomeIcon icon={item.icon}  size={25} color={'blue'}/>
                            
                        
                    </View>





                </TouchableOpacity>
            )
        }}
        />
            
            <Pressable onPress={() => navigation.navigate('OnboardingScreen4')} style={{left:250,width:100,backgroundColor:'deeppink',
             borderRadius:20, alignItems:'center', paddingHorizontal:20, paddingVertical:20}}>
                <Text style={{color:'white', fontFamily:'Montserrat-Bold', fontSize:18}}>Next</Text>
            </Pressable>
               
            </ScrollView>
        </Animatable.View>
        
        

        </LinearGradient>
       
      
            
            
            
            
            
            
    );
};

export default OnboardingScreen3;