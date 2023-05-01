import React, {createContext, useEffect, useState, useMemo} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import firestore from '@react-native-firebase/firestore';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import mixpanel from '../MixpanelConfig';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    const authListener = auth().onAuthStateChanged(newUser => {
      if (newUser) {
        setUser(newUser);

        // Identify the user with a unique ID (e.g., user.uid)
        mixpanel.identify(newUser.uid);

        // Set user properties (e.g., email, name, etc.)
        mixpanel.people.set({
          $email: newUser.email,
          $name: newUser.displayName,
          $contact: newUser.phoneNumber,

          // Add any other user properties you want to track
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      // Unsubscribe the listener when the component is unmounted
      authListener();
    };
  }, []);

  // const addUser = async () => {
  //   const input = {
  //     email: auth().currentUser.email,
  //     id: '',
  //     imageuri: auth().currentUser.photoURL,
  //     username: auth().currentUser.displayName,
  //   };
  //   try {
  //     const createdUser = await API.graphql(
  //       graphqlOperation(
  //         createUser,
  //         {
  //           input,
  //         },
  //         {
  //           id,
  //         },
  //       ),
  //     );
  //     console.log('Succesfully uploaded the home');
  //   } catch (e) {
  //     console.log('Error uploading home', e);
  //   }
  // };

  const value = useMemo(
    () => ({
      user,
      setUser,
      login: async (email, password) => {
        try {
          await auth().signInWithEmailAndPassword(email, password);
        } catch (e) {
          console.error(e);
        }
      },
      googleLogin: async () => {
        try {
          // Get the users ID token
          // const fcmToken = await AsyncStorage.getItem('fcmToken');

          const {idToken} = await GoogleSignin.signIn();

          // Create a Google credential with the token
          const googleCredential = auth.GoogleAuthProvider.credential(idToken);

          // Sign-in the user with the credential
          setLoading(true);
          await auth().signInWithCredential(googleCredential);

          // Identify the user with a unique ID (e.g., user.uid)
          const {currentUser} = auth();
          mixpanel.identify(currentUser.uid);

          // Set user properties (e.g., email, name, etc.)
          mixpanel.people.set({
            $email: currentUser.email,
            $name: currentUser.displayName,
            // $contact: user.phoneNumber,
            // Add any other user properties you want to track
          });

          // const trendRef = firestore()
          //   .collection('users')
          //   .doc(auth().currentUser.uid);

          // const getDoc = trendRef.get().then(doc => {
          //   if (!doc.exists) {
          //     firestore()
          //       .collection('users')
          //       .doc(auth().currentUser.uid)
          //       .set({
          //         fname: auth().currentUser.displayName,
          //         lname: auth().currentUser.displayName,
          //         email: auth().currentUser.email,
          //         createdAt: firestore.Timestamp.fromDate(new Date()),
          //         userImg: auth().currentUser.photoURL,
          //         phoneNumber: auth().currentUser.phoneNumber,
          //         role: 'USER',
          //       });
          //     console.log('User successfully added');
          //   } else {
          //     console.log('User already exists');
          //   }
          //   firestore()
          //     .collection('deviceFcms')
          //     .doc(auth().currentUser.uid)
          //     .set({
          //       deviceToken: fcmToken,
          //       userId: auth().currentUser.uid,
          //     });
          // });
          setLoading(false);

          // Once the user creation has happened successfully, we can add the currentUser into firestore
          // with the appropriate details.
          // console.log('current User', auth().currentUser)

          // ensure we catch any errors at this stage to advise us if something does go wrong

          // Use it only when user Sign's up,
          // so create different social signup function
          // .then(() => {
          //   //Once the user creation has happened successfully, we can add the currentUser into firestore
          //   //with the appropriate details.
          //   // console.log('current User', auth().currentUser);
          //   firestore().collection('users').doc(auth().currentUser.uid)
          //   .set({
          //       fname: '',
          //       lname: '',
          //       email: auth().currentUser.email,
          //       createdAt: firestore.Timestamp.fromDate(new Date()),
          //       userImg: null,
          //   })
          //   //ensure we catch any errors at this stage to advise us if something does go wrong
          //   .catch(error => {
          //       console.log('Something went wrong with added user to firestore: ', error);
          //   })
          // })
          // we need to catch the whole sign up process if it fails too.
        } catch (error) {
          console.error({error});
        }
      },
      appleLogin: async () => {
        try {
          const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
          });

          // Ensure Apple returned a user identityToken
          if (!appleAuthRequestResponse.identityToken) {
            throw new Error(
              'Apple Sign-In failed - no identify token returned',
            );
          }

          // Create a Firebase credential from the response
          const {
            identityToken,
            nonce,
            email,
            user: newUser,
          } = appleAuthRequestResponse;
          const appleCredential = auth.AppleAuthProvider.credential(
            identityToken,
            nonce,
            email,
            newUser,
          );

          // Sign the user in with the credential
          setLoading(true);
          await auth().signInWithCredential(appleCredential);
          // console.debug('apple user name', appleAuthRequestResponse);

          // Identify the user with a unique ID (e.g., user.uid)
          const {currentUser} = auth();
          mixpanel.identify(currentUser.uid);

          // Set user properties (e.g., email, name, etc.)
          mixpanel.people.set({
            $email: currentUser.email,
            $name: currentUser.displayName,
            // $contact: user.phoneNumber,
            // Add any other user properties you want to track
          });
          // const trendRef = firestore()
          //   .collection('users')
          //   .doc(auth().currentUser.uid);

          // const getDoc = trendRef.get().then(doc => {
          //   if (!doc.exists) {
          //     firestore()
          //       .collection('users')
          //       .doc(auth().currentUser.uid)
          //       .set({
          //         fname: appleAuthRequestResponse.fullName.givenName || 'N/A',
          //         lname: appleAuthRequestResponse.fullName.familyName || 'N/A',
          //         email: auth().currentUser.email || 'N/A',
          //         createdAt: firestore.Timestamp.fromDate(new Date()),
          //         userImg: auth().currentUser.photoURL || null,
          //         phoneNumber: auth().currentUser.phoneNumber || null, // Make the phone number field optional
          //         role: 'USER',
          //       });
          //     console.error('User successfully added');
          //   } else {
          //     console.error('User already exists');
          //   }
          // });
          // await AsyncStorage.getItem('alreadyOpened').then(res => {
          //   if (res == null) {
          //     AsyncStorage.setItem('alreadyOpened', 'true'); // No need to wait for `setItem` to finish, although you might want to handle errors
          //     // setIsFirstLaunch(true);
          //   } else {
          //     // setIsFirstLaunch(false);
          //   }
          // }); // A

          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      },
      fbLogin: async () => {
        try {
          // Attempt login with permissions
          const result = await LoginManager.logInWithPermissions([
            'public_profile',
            'email',
          ]);

          if (result.isCancelled) {
            throw new Error('User cancelled the login process');
          }

          // Once signed in, get the users AccesToken
          const data = await AccessToken.getCurrentAccessToken();

          if (!data) {
            throw new Error('Something went wrong obtaining access token');
          }

          // Create a Firebase credential with the AccessToken
          const facebookCredential = auth.FacebookAuthProvider.credential(
            data.accessToken,
          );

          // Sign-in the user with the credential
          setLoading(true);
          await auth().signInWithCredential(facebookCredential);
          setLoading(false);
          // Use it only when user Sign's up,
          // so create different social signup function
          // .then(() => {
          //   //Once the user creation has happened successfully, we can add the currentUser into firestore
          //   //with the appropriate details.
          //   console.log('current User', auth().currentUser);
          //   firestore().collection('users').doc(auth().currentUser.uid)
          //   .set({
          //       fname: '',
          //       lname: '',
          //       email: auth().currentUser.email,
          //       createdAt: firestore.Timestamp.fromDate(new Date()),
          //       userImg: null,
          //   })
          //   //ensure we catch any errors at this stage to advise us if something does go wrong
          //   .catch(error => {
          //       console.log('Something went wrong with added user to firestore: ', error);
          //   })
          // })
          // we need to catch the whole sign up process if it fails too.
        } catch (error) {
          console.error({error});
        }
      },
      register: async (email, password) => {
        try {
          await auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
              // Once the user creation has happened successfully, we can add the currentUser into firestore
              // with the appropriate details.
              firestore()
                .collection('users')
                .doc(auth().currentUser.uid)
                .set({
                  fname: '',
                  lname: '',
                  email,
                  createdAt: firestore.Timestamp.fromDate(new Date()),
                  userImg: null,
                })
                // ensure we catch any errors at this stage to advise us if something does go wrong
                .catch(error => {
                  console.error(
                    'Something went wrong with adding user to firestore: ',
                    error,
                  );
                });
            })
            // we need to catch the whole sign up process if it fails too.
            .catch(error => {
              console.error('Something went wrong with sign up: ', error);
            });
        } catch (e) {
          console.error(e);
        }
      },
      logout: async () => {
        try {
          await auth().signOut();
        } catch (e) {
          console.error(e);
        }
      },
      updateProfile: async data => {
        setUser({...user, _user: {...user._user, ...data}});
        await auth().currentUser.updateProfile({...data});
        firestore()
          .collection('users')
          .doc(user?._user?.uid)
          .update({...data});
      },
    }),
    [user],
  );

  if (loading) {
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator
          animating
          size="large"
          color="blue"
          style={styles.activityOpacity}
        />
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const styles = StyleSheet.create({
  loading: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  activityOpacity: {opacity: 1},
});
