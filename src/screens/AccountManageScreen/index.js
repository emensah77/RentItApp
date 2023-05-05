import React, {useCallback} from 'react';
import {Alert, Pressable, Text, View, StyleSheet, Platform} from 'react-native';

import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';

const AccountManageScreen = () => {
  const navigation = useNavigation();

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onDelete = useCallback(() => {
    Alert.alert(
      'Delete Account!',
      'Are you sure you want to delete your account? Doing so will prevent you from using RentIt',
      [
        {text: 'Yes', onPress: () => auth().signOut()},
        {
          text: 'No',
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  }, []);

  return (
    <View style={styles.container}>
      <Pressable style={styles.goBackButton} onPress={goBack}>
        <Fontisto name="angle-left" size={15} style={styles.angleLeftIcon} />
      </Pressable>

      <View style={styles.main}>
        <Text style={styles.title}>Manage your data here!</Text>
        <Text style={styles.subTitle}>Why do we store your data?</Text>
        <Text>
          We store your data to ensure we deliver you a personalized and relevant experience
          everytime you use this app. We never sell or distribute your data with third parties. In
          light of this commitment we are giving you the opportunity to be able to delete your data.
          Note that doing this will also delete your account with us and will require you to create
          a new account to be able to enjoy our services.
        </Text>

        <Pressable onPress={onDelete} style={styles.trashIconContainer}>
          <Fontisto name="trash" size={15} style={styles.trashIcon} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  goBackButton: {
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
  },
  angleLeftIcon: {
    color: 'black',
  },
  main: {
    marginTop: 120,
    padding: 20,
    margin: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingBottom: 15,
  },
  trashIconContainer: {padding: 15},
  trashIcon: {color: 'black'},
});

export default AccountManageScreen;
