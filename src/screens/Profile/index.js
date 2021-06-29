import React from 'react';
import {View, Dimensions, Text, Pressable, ImageBackground, StyleSheet, TextInput, ScrollView} from 'react-native';
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
            source={{uri:"https://i.postimg.cc/QdkCDW7C/wallpaper1.jpg"}}
            style={{width: Dimensions.get('screen').width, height: Dimensions.get('screen').height/4}}
            imageStyle={{borderBottomRightRadius:25, borderBottomLeftRadius:25}}>

                <View style={styles.DarkOverlay}></View>
                <View style={styles.searchContainer}>
                    <Text style={styles.UserGreetings}>Hey, Welcome</Text>
                    <Text style={styles.userText}>Go Near and Far</Text>
                </View>
                
            </ImageBackground>
            </View>

            <View style={{margin:10, padding:5,}}>
                <Text style={{fontWeight:'bold', fontSize:25}}>For Tenants</Text>
                <View style={{margin: 20, padding:5,}}>
                        <Text style={{fontSize:20, fontWeight:'bold', fontFamily: 'Heletivica'}}>How It Works?</Text>
                        
                        <Text style={{fontSize:16, padding:10}}>Start by exploring the locations you are interested in renting from. 
                            Apply filters like number of rooms, number of adults, or children to narrow your options.</Text>
                        <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                        
                    </View>


                    <View style={{margin: 20, padding:5}}>
                        <Text style={{fontSize:20, fontWeight:'bold', fontFamily: 'Heletivica'}}>Trust and Safety</Text>

                        <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                        <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                        
                    </View>

                    <View style={{margin: 20, padding:5,}}>
                        <Text style={{fontSize:20, fontWeight:'bold', fontFamily: 'Heletivica'}}>Cancellation Options</Text>
                        
                        <Text style={{fontSize:16, padding:10}}>Start by exploring the locations you are interested in renting from. 
                            Apply filters like number of rooms, number of adults, or children to narrow your options.</Text>
                        <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                        
                    </View>


                    <View style={{margin: 20, padding:5}}>
                        <Text style={{fontSize:20, fontWeight:'bold', fontFamily: 'Heletivica'}}>Help and Support</Text>

                        <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                        <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                        
                    </View>
            </View>
                
            <View style={{margin:10, padding:5}}>
                <Text style={{fontWeight:'bold', fontSize:25}}>For LandLords</Text>
                <View style={{margin: 20, padding:5,}}>
                        <Text style={{fontSize:20, fontWeight:'bold', fontFamily: 'Heletivica'}}>How It Works?</Text>
                        
                        <Text style={{fontSize:16, padding:10}}>Start by exploring the locations you are interested in renting from. 
                            Apply filters like number of rooms, number of adults, or children to narrow your options.</Text>
                        <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                        
                    </View>


                    <View style={{margin: 20, padding:5}}>
                        <Text style={{fontSize:20, fontWeight:'bold', fontFamily: 'Heletivica'}}>Trust and Safety</Text>

                        <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                        <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                        
                    </View>

                    <View style={{margin: 20, padding:5}}>
                        <Text style={{fontSize:20, fontWeight:'bold', fontFamily: 'Heletivica'}}>Cancellation Options</Text>

                        <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                        <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                        
                    </View>

                    <View style={{margin: 20, padding:5}}>
                        <Text style={{fontSize:20, fontWeight:'bold', fontFamily: 'Heletivica'}}>Help and Support</Text>

                        <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                        <Text style={{fontSize:16, padding:10}}>Start by exploring Stays or Experiences. Apply filters like entire homes, self check-in, or pets allowed to narrow your options.</Text>
                        
                    </View>
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
        width: Dimensions.get('screen').width, 
        height: Dimensions.get('screen').height/4,
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
        fontSize: 32,
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