import React, { Component } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Pressable,
  
} from 'react-native';
import Swiper from 'react-native-swiper';
import {useNavigation} from "@react-navigation/native";

const { width, height } = Dimensions.get('window');





const Onboarding = (props) =>  {

  const navigation = useNavigation();

  const goto = () =>{
    navigation.navigate("Home");
  }
  
  
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Text style={styles.logo}>RentIt</Text>
        <Text style={styles.subtitle}>find your next home</Text>
        <Swiper autoplay={true}>
          <View style={styles.slide}>
            <Image
              source={{uri: "https://www.zillowstatic.com/s3/homepage/static/Buy_a_home.png"}}
              style={styles.image}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={{uri: "https://www.zillowstatic.com/s3/homepage/static/Rent_a_home.png"}}
              style={styles.image}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={{uri:"https://www.zillowstatic.com/s3/homepage/static/Sell_a_home.png"}}
              style={styles.image}
            />
          </View>
        </Swiper>
        <View style={styles.textContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Buy, Sell, Rent a Home.</Text>
          </View>
          
        </View>
        <View style={styles.buttonContainer}>
          
          <Pressable onPress={goto}>
            <View style={styles.loginContainer}>
              <Text style={styles.login}>Begin</Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  
};
export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"blue",
    top: 50,
    fontFamily: "Heletivica",
  },
  slide: {
    
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    flex: 1,
    width: width,
    height: height,
    resizeMode: "contain",
  },
  textContainer: {
    position: 'absolute',
    bottom: 100,
    marginLeft: 20,
    height: 120,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  titleContainer: {
    width: 300,
    height: 70,
    
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontFamily: 'Helvetica',
    fontSize: 20,
    color: 'blue',
    fontWeight: 'bold',
    position: 'absolute'
  },
  subTitleContainer: {
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  subtitle: {
    fontFamily: 'Helvetica',
    fontSize: 24,
    color: 'blue',
    top: 50,
    position: 'relative'
  },
  buttonContainer: {
    position: 'absolute',
    flex: 1,
    bottom: 40,
    width: 370,
    height: 60,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  signupContainer: {
    width: 180,
    height: 60,
    backgroundColor: 'blue',
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center'
  },
  signup: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  },
  loginContainer: {
    width: 180,
    height: 60,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
   
  },
  login: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  }
});