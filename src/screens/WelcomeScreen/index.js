import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  Share,
  FlatList,
  StatusBar,
  View,
  SafeAreaView,
  Dimensions,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../navigation/AuthProvider';

const WelcomeScreen = ({props}) => {
  const [value, setValue] = useState('');
  const {user, setUser} = useContext(AuthContext);
  const [formattedValue, setFormattedValue] = useState('');
  const [name, setName] = useState(user?._user?.displayName);
  const phoneInput = useRef(null);
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={{flexGrow: 1}}>
        <View
          style={{
            flex: 1,
            padding: 10,
            marginTop: 100,
            backgroundColor: 'white',
            paddingBottom: 20,
          }}>
          <Text style={{fontSize: 22, fontWeight: 'bold', padding: 10}}>
            Welcome {user?._user?.displayName}
          </Text>
          <Text style={{fontWeight: '400', fontSize: 14, padding: 10}}>
            We are glad you are here. We began RentIt to make it easier for people like you to find
            homes they love!
          </Text>
          <Text style={{fontWeight: '400', fontSize: 14, padding: 10}}>
            We really hope you find the home you love, because we truly believe everyone deserves a
            home!
          </Text>
          <View style={{paddingHorizontal: 20, marginTop: 5}}>
            <Text
              style={{
                marginBottom: 8,
                fontSize: 13,
                fontWeight: '600',
                color: 'black',
              }}>
              Name
            </Text>
            <TextInput
              value={name}
              style={{
                height: 40,
                marginBottom: 3,
                backgroundColor: '#DAE3F0',
                borderRadius: 8,
                paddingHorizontal: 12,
                color: 'black',
              }}
              editable
              onChangeText={text => setName(text)}
            />
            <Text
              style={{
                alignSelf: 'flex-end',
                fontSize: 10,
                marginBottom: 13,
                color: 'blue',
              }}>
              Make sure it matches the name on your government ID.
            </Text>
            <Text
              style={{
                marginBottom: 8,
                fontSize: 13,
                fontWeight: '600',
                color: 'black',
              }}>
              Email
            </Text>
            <TextInput
              value={user?._user?.email}
              style={{
                height: 40,
                marginBottom: 3,
                backgroundColor: '#DAE3F0',
                borderRadius: 8,
                paddingHorizontal: 12,
                color: 'grey',
              }}
              editable={false}
            />
            <Text
              style={{
                alignSelf: 'flex-end',
                fontSize: 10,
                marginBottom: 13,
                color: 'blue',
              }}>
              We'll email you home confirmations and receipts.
            </Text>
          </View>
          <View style={{alignItems: 'center', padding: 20}}>
            <PhoneInput
              ref={phoneInput}
              defaultValue={value}
              defaultCode="GH"
              layout="first"
              onChangeText={text => {
                setValue(text);
              }}
              onChangeFormattedText={text => {
                setFormattedValue(text);
              }}
              countryPickerProps={{withAlphaFilter: true}}
              withShadow
              autoFocus
              containerStyle={{borderRadius: 5}}
              textContainerStyle={{backgroundColor: 'lightgrey'}}
            />
          </View>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginBottom: 10,
              marginHorizontal: 20,
            }}
          />

          <View>
            <Text style={{fontWeight: '400', fontSize: 14, paddingHorizontal: 20}}>
              By selecting Agree and Continue, I agree to Rentit
              <Text style={{textDecorationLine: 'underline', color: 'blue'}}>
                {' '}
                Terms of Service
              </Text>{' '}
              ,
              <Text style={{textDecorationLine: 'underline', color: 'blue'}}>
                {' '}
                Payment Terms of Service
              </Text>{' '}
              and acknowledge the
              <Text style={{textDecorationLine: 'underline', color: 'blue'}}> Privacy Policy</Text>.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              const checkValid = phoneInput.current?.isValidNumber(value);
              const trendRef = firestore().collection('users').doc(auth().currentUser.uid);
              if (name) {
                if (checkValid) {
                  Alert.alert('Your phone number is valid', formattedValue);

                  const getDoc = trendRef.get().then(doc => {
                    if (doc.exists) {
                      firestore().collection('users').doc(auth().currentUser.uid).update({
                        displayName: name,
                        phoneNumber: formattedValue,
                        email: user?._user?.email,
                      });
                      setUser({
                        ...user,
                        _user: {
                          ...user._user,
                          displayName: name,
                          phoneNumber: formattedValue,
                          email: user?._user?.email,
                        },
                      });
                      navigation.navigate('Home');
                      console.log('User phonenumber successfully added');
                    } else {
                      console.log('User does not already exists');
                    }
                  });
                } else {
                  Alert.alert('Your phone number is not correct', formattedValue);
                }
              } else {
                Alert.alert('Please Enter Name');
              }
            }}
            style={{
              borderRadius: 15,
              backgroundColor: 'deeppink',
              width: 200,
              height: 50,
              marginLeft: 10,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 25,
              alignSelf: 'flex-end',
              marginHorizontal: 25,
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 18, color: 'white'}}>
              Agree and Continue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default WelcomeScreen;
