import React from 'react';
import {View, Text, Pressable, ImageBackground} from "react-native";
import styles from './styles';
import Fontisto from "react-native-vector-icons/Fontisto";
const image = {uri : "https://a0.muscache.com/im/pictures/7d82ca14-56e5-4465-8218-dcfa7d69b6ac.jpg?im_w=720"};
const HomeScreen =(props) => {
    return (
       <View>

<Pressable 
                style={styles.searchButton}
                onPress={()=> console.warn
                ('Search button Clicked.')}>
                <Fontisto name="search" size={25} color={"#f15454"}/>
                <Text style={styles.searchButtonText}>Where do you want to rent?</Text>
                    
                    </Pressable>
           {/* Search bar */}
           <ImageBackground 
           source={image} 
           style={styles.image}>
            
            <Text style={styles.title}>
                Find your Next Home

            </Text>

            <Pressable 
                style={styles.button}
                onPress={()=> console.warn
                ('Explore button clicked')}>
                <Text style={styles.buttonText}>Explore nearby stays</Text>
                    
                    </Pressable>
           </ImageBackground>
       </View>
    );
};

export default HomeScreen;
