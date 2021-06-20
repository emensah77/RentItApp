import React from 'react';
import {View, Text, Pressable, ImageBackground, StyleSheet, TextInput, ScrollView} from 'react-native';
import {Auth} from 'aws-amplify';

const ProfileScreen = (props) => {
    const logout = () => {
        Auth.signOut();
    }
    return (
        <ScrollView style={{backgroundColor:'#fff', marginBottom:10}}>
            <View>
            <View> 
            <ImageBackground
            source={{uri:"https://images.contentstack.io/v3/assets/bltfa2cefdbe7482368/blt6b74dc9eac1dca00/5f7391b94c3b684e759d32c6/GoNear_LA_2580w.jpg"}}
            style={{width: '100%', height: 270}}
            imageStyle={{borderBottomRightRadius:25, borderBottomLeftRadius:25}}>

                <View style={styles.DarkOverlay}></View>
                <View style={styles.searchContainer}>
                    <Text style={styles.UserGreetings}>Hey, Welcome</Text>
                    <Text style={styles.userText}>Explore, Go Near and Far</Text>
                </View>
                
            </ImageBackground>
            </View>

            
                <View style={{margin: 20, padding:5,}}>
                    <Text style={{fontSize:20, fontWeight:'bold', fontFamily: 'Heletivica'}}>How It Works?</Text>
                    
                    <Text style={{fontSize:16, padding:10}}>Start by exploring the locations you are interested in renting from. 
                        Apply filters like number of rooms, number of adults, or children to narrow your options.</Text>
                    <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                    
                </View>


                <View style={{margin: 20, padding:5}}>
                    <Text style={{fontSize:20, fontWeight:'bold', fontFamily: 'Heletivica'}}>How It Works?</Text>

                    <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                    <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                    
                </View>


                <View style={{margin: 20, padding:5}}>
                    <Text style={{fontSize:20, fontWeight:'bold', fontFamily: 'Heletivica'}}>How It Works?</Text>

                    <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                    <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                    
                </View>

                <View style={{margin: 20, padding:5}}>
                    <Text style={{fontSize:20, fontWeight:'bold', fontFamily: 'Heletivica'}}>How It Works?</Text>

                    <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                    <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                    
                </View>
                

            
            
        </View>
        </ScrollView>
        
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    DarkOverlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        height: 270,
        backgroundColor: '#000',
        opacity: 0.3,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25
    },
    searchContainer: {
        paddingTop: 100,
        paddingLeft: 16,
    },
    UserGreetings: {
        fontSize: 58,
        fontWeight: 'bold',
        color: 'white',
    },
    userText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    }
})

export default ProfileScreen;