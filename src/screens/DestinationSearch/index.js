import React , {useState} from 'react';
import {View, Text, TextInput, FlatList} from 'react-native';
import styles from './styles.js';
import Entypo from 'react-native-vector-icons/Entypo';
import searchResults from '../../../assets/data/search';
const DestinationSearch = (props) => {
    const [inputText, setInputText] =  useState('');
    return (
        <View style={styles.container}>
            {/* Input Component */}

            <TextInput 
            styles={styles.TextInput}
            placeholder="Type where you want to rent"
            value= {inputText}
            onChangeText={setInputText}/>
            <FlatList 
            data={searchResults}
            renderItem={({item}) => (
                <View style={styles.row}>
                    <View style={styles.iconContainer}>
                        <Entypo name={"location-pin"} size={25}/>
                    </View>
                <Text style={styles.locationText}>{item.description}</Text>

                    </View>
                )}
            />
        </View>
    );
};

export default DestinationSearch;