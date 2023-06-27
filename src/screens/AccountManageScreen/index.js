import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Alert,
  TouchableOpacity,
  StatusBar,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from 'react-native-vector-icons/Fontisto';
import styles from './styles.js';
import {AuthContext} from '../../navigation/AuthProvider';

const AccountManageScreen = props => {
  const navigation = useNavigation();
  const {user, logout} = useContext(AuthContext);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Pressable
        style={{
          margin: 20,
          shadowColor: 'black',
          shadowOpacity: 0.5,
          shadowRadius: 20,
          position: 'absolute',
          top: Platform.OS === 'ios' ? 30 : 0,
          left: 0,
          height: 40,
          width: 40,
          backgroundColor: 'white',
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.goBack()}
      >
        <Fontisto name="angle-left" size={15} style={{color: 'black'}} />
      </Pressable>

      <View style={{marginTop: 120, padding: 20, margin: 20}}>
        <Text style={{fontSize: 24, fontWeight: 'bold', paddingBottom: 10}}>
          Manage your data here!
        </Text>
        <Text style={{fontSize: 18, fontWeight: '600', paddingBottom: 15}}>
          Why do we store your data?
        </Text>
        <Text>
          We store your data to ensure we deliver you a personalized and relevant experience
          everytime you use this app. We never sell or distribute your data with third parties. In
          light of this commitment we are giving you the opportunity to be able to delete your data.
          Note that doing this will also delete your account with us and will require you to create
          a new account to be able to enjoy our services.
        </Text>

        <Pressable
          onPress={() => {
            Alert.alert(
              'Delete Account!',
              'Are you sure you want to delete your account? Doing so will prevent you from using RentIt',
              [
                {text: 'Yes', onPress: () => auth().signOut()},
                {
                  text: 'No',
                  onPress: () => console.log('No button clicked'),
                  style: 'cancel',
                },
              ],
              {
                cancelable: true,
              },
            );
          }}
          style={{padding: 15}}
        >
          <Fontisto name="trash" size={15} style={{color: 'black'}} />
        </Pressable>
      </View>
    </View>
  );
};

export default AccountManageScreen;
