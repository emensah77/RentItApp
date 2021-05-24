import React , {useState} from 'react';
import {View, Text, TextInput, FlatList, Pressable} from 'react-native';
import styles from './styles.js';
import Entypo from 'react-native-vector-icons/Entypo';
import searchResults from '../../../assets/data/search';
import {useNavigation} from "@react-navigation/native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import SuggestionRow from './SuggestionRow';


const DestinationSearch = (props) => {
    const navigation = useNavigation();
    
    return (
        <View style={styles.container}>
            {/* Input Component */}
            <View style={{height:500}}>
            <GooglePlacesAutocomplete
                placeholder='Where do you want to rent?'
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log(data, details);
                    navigation.navigate('Number of Guests')
                }}
                fetchDetails
                styles={{
                    textInput: styles.textInput,
                }}
                query={{
                    key: 'AIzaSyBbnGmg020XRNU_EKOTXpmeqbCUCsEK8Ys',
                    language: 'en',
                    types: '(cities)',
                    components: 'country:gh',
                }}
                
                suppressDefaultStyles
                renderRow={(item) => <SuggestionRow item={item}/>}
                />
            </View>
            
            
        </View>
    );
};

export default DestinationSearch;