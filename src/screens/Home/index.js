import React from 'react';
import {View, Text, Pressable, ImageBackground, ScrollView} from "react-native";
import styles from './styles';
import Fontisto from "react-native-vector-icons/Fontisto";
import {useNavigation} from "@react-navigation/native";
const image = {uri : "https://a0.muscache.com/im/pictures/7d82ca14-56e5-4465-8218-dcfa7d69b6ac.jpg?im_w=720"};
import {FlatListSlider} from 'react-native-flatlist-slider';

const images = [
    {
     image:'https://www.zillowstatic.com/s3/homepage/static/Sell_a_home.png',
     desc: 'Silent Waters in the mountains in midst of Himilayas',
    },
   {
     image:'https://i.postimg.cc/PrjcgRVZ/Are-you-a-landlord.png',
     desc:
       'Red fort in India New Delhi is a magnificient masterpeiece of humans',
   },
   ]

const HomeScreen =(props) => {

    const navigation = useNavigation();
    return (
        <ScrollView>
            <View>

                <Pressable 
                        style={styles.searchButton}
                        onPress={()=> navigation.navigate('Destination Search')}>
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
                <View style={{margin:20}}>
                    <Text style={{fontWeight:'bold', marginBottom: 20, fontSize: 32}}>Live Anywhere</Text>
                <FlatListSlider 
                
                        data={images} 
                        
                        timer={5000}
                    /> 
                </View>                
            

            </ScrollView>
    );
};

export default HomeScreen;


