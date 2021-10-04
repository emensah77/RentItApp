import React, {useEffect, useState} from 'react';
import {View,Image, TouchableOpacity,Pressable ,ScrollView,StyleSheet, Text, Alert} from 'react-native';
import {API, graphqlOperation} from 'aws-amplify';
import {createPaymentIntent} from '../../graphql/mutations';
import {useNavigation, useRoute} from '@react-navigation/native'
import {useStripe} from '@stripe/stripe-react-native';
import FastImage from 'react-native-fast-image';
import { Dimensions} from "react-native";
import  { Paystack , paystackProps}  from 'react-native-paystack-webview';

const AddressScreen = (props) => {

    
    
    const [years, setYears] = useState(0);
    const [months, setMonths] =  useState(0);
    const navigation = useNavigation();
    const route = useRoute();
    const {initPaymentSheet, presentPaymentSheet} =  useStripe();
    const amount = (route.params?.price * 100 || 0);
    const homeimage = route.params.homeimage;
    const homebed = route.params.homebed;
    const hometitle = route.params.hometitle;
    console.log(homebed);
    console.log(homeimage);
    console.log(hometitle);
    
    console.log(amount);
    const [clientSecret, setClientSecret] = useState(null);

    
    
  
    useEffect(() => {
      fetchPaymentIntent();
    }, []);
  
    useEffect(() => {
      if (clientSecret) {
        initializePaymentSheet();
      }
    }, [clientSecret !== null]);
  
    const fetchPaymentIntent = async () => {
      const response = await API.graphql(
        graphqlOperation(createPaymentIntent, {amount}),
      );
      setClientSecret(response.data.createPaymentIntent.clientSecret);
    };
  
    const initializePaymentSheet = async () => {
      if (!clientSecret) {
        return;
      }
      const {error} = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
      });
      console.log('success');
      if (error) {
        Alert.alert(error);
      }
    };
  
    const openPaymentSheet = async () => {
      if (!clientSecret) {
        return;
      }
      const {error} = await presentPaymentSheet({clientSecret});
  
      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        
        Alert.alert('Success', 'Your payment is confirmed!');
      }
    };
    return (
        <ScrollView style={styles.container} contentContainerStyle={{justifyContent:'center', alignItems:'center'}}>
            
                <View style={styles.innerContainer}>
                    <FastImage style={styles.image}
                    source={{
                        uri: homeimage,
                        headers: { Authorization: 'token' },
                        priority: FastImage.priority.high,
                        
                    }}/>
                     
                
                <View style={{flex: 1, marginHorizontal: 10, marginBottom:10}}>
                    <Text style={{fontFamily:'Montserrat-Bold'}}>{hometitle}</Text>
                    <Text style={{fontFamily:'Montserrat-Regular'}}>{homebed} bedroom</Text>
                </View>
            </View>
            <View style={styles.hairline}/>
            <View>
            <Text style={{marginBottom: 10, fontFamily:'Montserrat-Bold'}}>Your Rent Details</Text>
            </View>
              
        
            
            
            <View style={styles.row}>
                <View style={{flex:1, justifyContent:'space-between'}}>
                    <Text style={{fontWeight: 'bold'}}>Years</Text>
                    <Text style={{color: 'darkgray'}}>How many years?</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems:'center'}}>

                    <Pressable 
                    onPress={() => setYears(Math.max(0, years - 1))}
                    style = {styles.button}
                    >
                        <Text style={{fontSize: 20, color: 'black'}}>-</Text>
                        
                    </Pressable>

                    <Text style={{marginHorizontal: 20, fontSize: 20}}>{years}</Text>

                    <Pressable onPress={() => setYears (years + 1)}
                    style = {styles.button}
                    >
                        <Text style={{fontSize: 20, color: 'black'}}>+</Text>
                        
                    </Pressable>
                </View>
    
            </View>



            <View style={styles.row}>
                <View style={{flex:1, justifyContent:'space-between'}}>
                    <Text style={{fontWeight: 'bold'}}>Months</Text>
                    <Text style={{color: 'darkgray'}}>How many months?</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems:'center'}}>

                    <Pressable 
                    onPress={() => setMonths(Math.max(0, months - 1))}
                    style = {styles.button}
                    >
                        <Text style={{fontSize: 20, color: 'black'}}>-</Text>
                        
                    </Pressable>

                    <Text style={{marginHorizontal: 20, fontSize: 20}}>{months}</Text>

                    <Pressable onPress={() => setMonths (months + 1)}
                    style = {styles.button}
                    >
                        <Text style={{fontSize: 20, color: 'black'}}>+</Text>
                        
                    </Pressable>
                </View>




                
            </View>



            <View style={styles.hairline}/>
            <View>
            <Text style={{marginBottom: 10, fontFamily:'Montserrat-Bold'}}>Choose how to pay</Text>
            </View>

            <View style={styles.hairline}/>
            <View>
            <Text style={{marginBottom: 10, fontFamily:'Montserrat-Bold'}}>Price Details</Text>
            </View>
            
            
        <View style={{margin:10, flexDirection:'row', justifyContent:'space-between'}}>
            <View style={{padding:20, flex:1}}>
            <Text style={{paddingBottom:10, fontFamily:'Montserrat-Regular'}}>Years</Text>
            <Text style={{paddingBottom:10, fontFamily:'Montserrat-Regular'}}>Months</Text>
            <Text style={{paddingBottom:10, fontFamily:'Montserrat-Regular'}}>Rent Fee</Text>
            <Text style={{paddingBottom:10, fontFamily:'Montserrat-Regular'}}>Service Fee</Text>
            <Text style={{paddingBottom:10, fontFamily:'Montserrat-Regular'}}>Rent Fee</Text>

            
            
            </View>
            <View style={{padding:20}}>
                
            <Text style={{paddingBottom:10, fontFamily:'Montserrat-Regular'}}>{years}</Text>
            <Text style={{paddingBottom:10, fontFamily:'Montserrat-Regular'}}>{months}</Text>
            <Text style={{paddingBottom:10, fontFamily:'Montserrat-Regular'}}>GH₵{amount*(years+(months/12))}</Text>
            <Text style={{paddingBottom:10, fontFamily:'Montserrat-Regular'}}>GH₵{amount*(years+(months/12))*.07}</Text>
            <Text style={{paddingBottom:10, fontFamily:'Montserrat-Regular'}}>Rent Fee</Text>
            
            </View>
            
        </View>

        <View style={styles.hairline}/>

        <View style={{flex:1}}>
        <Text style={{marginBottom: 10, fontFamily:'Montserrat-Bold'}}>Cancellation Policy</Text>
        
        </View>
        <View style={{margin:15 ,alignSelf:'flex-start'}}>
            <Text style={{
                fontFamily:'Montserrat-Regular'
            }}>Free cancellation before you move in to the house. Once you move in, cancel and get a refund 
            , minus the number of days you have already stayed in the house.</Text>
        </View>

        
        <View style={styles.hairline}/>
            <TouchableOpacity style={{
                marginBottom: 10,
                backgroundColor: 'black',
                alignItems: 'center',
                justifyContent: 'center',
                height: 45,
                width:Dimensions.get('screen').width -150,
                marginHorizontal: 20,
                borderRadius: 10,
            }} onPress={() => navigation.navigate('Payment')}>
                <Text style={{
                    fontFamily:'Montserrat-Bold',
                    color:'yellow'}}>Pay with Mobile Money</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
                marginBottom: 10,
                backgroundColor: 'deeppink',
                alignItems: 'center',
                justifyContent: 'center',
                height: 45,
                width:Dimensions.get('screen').width -150,
                marginHorizontal: 20,
                borderRadius: 10,
            }} onPress={openPaymentSheet}>
                <Text style={{
                    fontFamily:'Montserrat-Bold',
                    color:'white'}}>Pay with ATM Card</Text>
            </TouchableOpacity>
            
            
            


            
        </ScrollView>
    );
}

export default AddressScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ffffff',
        
    },
    image:{
    height : '50%',
    width: '50%',
    aspectRatio: 1,
    resizeMode:'contain',
    borderRadius:15,
    
},
innerContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    overflow:'hidden',
    margin:20,
    marginBottom:20,
    
    

},
hairline:{
    alignSelf: 'stretch',
    borderBottomWidth: 10,
    borderBottomColor: 'lightgrey',
    marginTop: 10,
    marginBottom: 10
},
row: {

    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: 'darkgray',
    marginHorizontal: 20,
  
    
},
row1: {

    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: 'darkgray',
    marginHorizontal: 20,
  
    
},
button: {
    borderWidth: 1, 
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    borderColor: 'darkgray',
    alignItems: 'center',    
},



})
