import React, { useContext, useEffect, useState } from 'react';
import { Share, Linking, StatusBar, View, SafeAreaView, Dimensions, Text, Pressable, Image, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Auth } from 'aws-amplify';
import { AuthContext } from '../../navigation/AuthProvider';
import FormButton from '../../components/FormButton';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

const ProfileScreen = ({ route }) => {


  const onShare = async () => {

    try {
      const result = await Share.share({
        title: 'Download RentIt and find homes to rent in your area',
        message: Platform.OS === 'android' ? 'https://play.google.com/store/apps/details?id=com.rentitghana' : 'https://apps.apple.com/us/app/rentit-find-homes-rooms/id1580456122'

      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const navigation = useNavigation();
  //const user = firebase.auth().currentUser;
  const { user, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      })
  }

  useEffect(() => {
    getUser();

    navigation.addListener("focus", () => setLoading(!loading));
  }, [navigation, loading]);
  return (
    <View style={{
      backgroundColor: "#fff",
      flex: 1,

    }}>
      <StatusBar hidden={true} />
      <LinearGradient
        colors={['#ee0979', '#ff6a00']}
        start={{ x: 0.1, y: 0.2 }}
        end={{ x: 1, y: 0.5 }}
        style={[{
          backgroundColor: 'blue',
          height: "25%",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          paddingHorizontal: 20,
        }]}>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: Platform.OS === 'ios' ? 50 : 25,
          width: '100%'

        }}>
          <View
            style={{
              width: '50%'
            }}>
            <Text
              style={{
                fontSize: 24,
                color: "#fff",
                fontWeight: 'bold'
              }}>Hi {user?._user?.displayName}</Text>

          </View>
          <View style={{ width: '50%', alignItems: 'flex-end' }}>
            <Image
              source={{ uri: user ? user?._user?.photoURL || 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg' : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg' }}
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,

              }}
            />
          </View>

        </View>

      </LinearGradient>
      <ScrollView>
        <View style={styles.menuWrapper}>
          <TouchableOpacity onPress={() => navigation.navigate('ManageProfile')}>
            <View style={styles.menuItem}>
              <Icon name="account" color="blue" size={25} />
              <Text style={styles.menuItemText}>Profile</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Wishlists')}>
            <View style={styles.menuItem}>
              <Icon name="heart-outline" color="blue" size={25} />
              <Text style={styles.menuItemText}>Your Favorites</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }}>
            <View style={styles.menuItem}>
              <Icon name="credit-card" color="blue" size={25} />
              <Text style={styles.menuItemText}>Payment</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare}>
            <View style={styles.menuItem}>
              <Icon name="share-outline" color="blue" size={25} />
              <Text style={styles.menuItemText}>Tell Your Friends</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }}>
            <View style={styles.menuItem}>
              <Icon name="account-check-outline" color="blue" size={25} />
              <Text style={styles.menuItemText}>Support</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('HouseUpload')}>
            <View style={styles.menuItem}>
              <Icon name="home" color="blue" size={25} />
              <Text style={styles.menuItemText}>List your home</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('AccountManage')}>
            <View style={styles.menuItem}>
              <Icon name="account" color="blue" size={25} />
              <Text style={styles.menuItemText}>Manage your account</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <View style={styles.menuItem}>
              <Icon name="bell" color="blue" size={25} />
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <View style={styles.menuItem}>
              <Icon name="home-group" color="blue" size={25} />
              <Text style={styles.menuItemText}>Become a marketer</Text>
            </View>
          </TouchableOpacity>
          <Text></Text>




        </View>
      </ScrollView>

      <TouchableOpacity style={styles.userBtn} onPress={() => auth().signOut()}>
        <Text style={styles.userBtnTxt}>Logout</Text>
      </TouchableOpacity>

    </View>
    //     <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
    //     <ScrollView
    //       style={styles.container}
    //       contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
    //       showsVerticalScrollIndicator={false}>
    //       <Image
    //         style={styles.userImg}
    //         source={{uri: user ? user.photoURL || 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg' : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'}}
    //       />
    //       <Text style={styles.userName}>{user ? user.displayName || 'Test' : 'Test'}</Text>
    //       {/* <Text>{route.params ? route.params.userId : user.uid}</Text> */}
    //       <Text style={styles.aboutUser}>
    //       {userData ? userData.about || 'No details added.' : ''}
    //       </Text>
    //       <View style={styles.userBtnWrapper}>
    //         {route.params ? (
    //           <>
    //             <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
    //               <Text style={styles.userBtnTxt}>Message</Text>
    //             </TouchableOpacity>
    //             <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
    //               <Text style={styles.userBtnTxt}>Follow</Text>
    //             </TouchableOpacity>
    //           </>
    //         ) : (
    //           <>
    //             <TouchableOpacity
    //               style={styles.userBtn}
    //               onPress={() => {
    //                 navigation.navigate('EditProfile');
    //               }}>
    //               <Text style={styles.userBtnTxt}>Edit</Text>
    //             </TouchableOpacity>
    //             <TouchableOpacity style={styles.userBtn} onPress={() => auth()
    //             .signOut()
    //             .then(() => navigation.navigate("Login"))
    //             }>
    //               <Text style={styles.userBtnTxt}>Logout</Text>
    //             </TouchableOpacity>
    //           </>
    //         )}
    //       </View>

    //       <View style={styles.userInfoWrapper}>
    //         <View style={styles.userInfoItem}>

    //           <Text style={styles.userInfoSubTitle}>Posts</Text>
    //         </View>
    //         <View style={styles.userInfoItem}>
    //           <Text style={styles.userInfoTitle}>10,000</Text>
    //           <Text style={styles.userInfoSubTitle}>Followers</Text>
    //         </View>
    //         <View style={styles.userInfoItem}>
    //           <Text style={styles.userInfoTitle}>100</Text>
    //           <Text style={styles.userInfoSubTitle}>Following</Text>
    //         </View>
    //       </View>


    //     </ScrollView>
    //   </SafeAreaView>

  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',

  },
  DarkOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height / 4,
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
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    backgroundColor: 'blue',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 15,
    alignItems: 'center'

  },
  userBtnTxt: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold'
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
})

export default ProfileScreen;