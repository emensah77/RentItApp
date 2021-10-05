import React , {useState} from 'react';
import {View, Text, StatusBar,TextInput, FlatList, Pressable} from 'react-native';
import styles from './styles.js';
import Entypo from 'react-native-vector-icons/Entypo';
import searchResults from '../../../assets/data/search';
import {useNavigation} from "@react-navigation/native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import SuggestionRow from './SuggestionRow';
import * as Animatable from 'react-native-animatable';
import { faFacebook, faApple, faGoogle} from '@fortawesome/free-brands-svg-icons';
const DestinationSearch = (props) => {
    const navigation = useNavigation();
    
    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <View style={styles.header}>
        
          <Text style={styles.text_header}> Where do you {'\n'} want to rent? </Text>
        </View>
        <Animatable.View
        animation="fadeInUpBig"
        duration={1500} 
          style={styles.footer}
        >
            <GooglePlacesAutocomplete
                placeholderTextColor='#ffffff'
                placeholder='Type where you want to rent'
                autoFocus={true}
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log(data, details);
                    navigation.navigate('Number of Guests', {viewport: details.geometry.viewport});
                }}
                fetchDetails
                styles={{
                    textInput: styles.textInput,
                    textInputContainer: {
                        backgroundColor: 'yellow',
                        borderRadius:15,
                        borderWidth:.4,
                        height:40,
                        
                        
                      },
                }}
                query={{
                    key: 'AIzaSyBbnGmg020XRNU_EKOTXpmeqbCUCsEK8Ys',
                    language: 'en',
                    types: '(regions)',
                    components: 'country:gh',
                }}
                
                suppressDefaultStyles
                renderRow={(item) => <SuggestionRow item={item}/>}
                />
          
          
        </Animatable.View>

        
         
      
            {/* Input Component */}
            
            
            
            
            
        </View>
    );
};

export default DestinationSearch;