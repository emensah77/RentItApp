import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, Modal, TouchableOpacity, Pressable, Text, Linking, useEffect as useEffectRN } from 'react-native';
import DetailedPost from '../../components/DetailedPost';
import { listPosts, getPost } from '../../graphql/queries';
import { useRoute, useNavigation } from '@react-navigation/native';
import { API, graphqlOperation } from 'aws-amplify';
import AnimatedEllipsis from 'react-native-animated-ellipsis';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fontisto from "react-native-vector-icons/Fontisto";
import { URL } from 'url'

const PostScreen = ({ route }) => {


    const navigation = useNavigation();
    const params = route.params || {};
    const { postId, id } = params;
    const [post, setPosts] = useState([]);
    const [newPost, setNewPost] = useState(null);
    const [modalvisible, setmodalvisible] = useState(false)
    const [loading, setLoading] = useState(false);
    const [nextToken, setNextToken] = useState(null);
    const [deepLinkUrl, setDeepLinkUrl] = useState();
    const handleDeepLink = async (event) => {
        const url = event.url;
        if (url) {
          const path = url.replace(/.*?:\/\//g, '');
          const postIdParam = path.split('/')[2];
          if (postIdParam !== postId) {
            fetchPosts(postIdParam);
          }
        }
      };
      
      const fetchPosts = async (postId) => {
        try {
          const postsResult = await API.graphql(
            graphqlOperation(getPost, {
              id: postId,
            })
          )
          setNewPost(postsResult.data.getPost);
        } catch (e) {
          console.log(e);
        }
      }
    
      async function getDeepLinkUrl() {
        if (!postId) {
          try {
            const url = await Linking.getInitialURL();
            if (url) {
              const regex = /\/room\/([^/]+)\/?$/;
              const match = url.match(regex);
              if (match && match[1]) {
                setDeepLinkUrl(match[1]);
              }
            }
          } catch (error) {
            console.error(error);
          }
        } else {
          setDeepLinkUrl(null);
        }
      }
    
      const handleForegroundDeepLink = (url) => {
        if (url) {
          const path = url.replace(/.*?:\/\//g, '');
          const postIdParam = path.split('/')[2];
          if (postIdParam !== postId) {
            setDeepLinkUrl(postIdParam);
          }
        }
      };
    
      useEffect(() => {
        console.log('Checking deep link');
        getDeepLinkUrl();
    
        const handleUrl = (event) => {
          handleDeepLink(event);
        };
    
        const subscription = Linking.addEventListener('url', handleUrl);
    
        return () => {
          subscription.remove();
        };
      }, []);
    
      useEffect(() => {
        if (deepLinkUrl) {
          handleForegroundDeepLink(deepLinkUrl);
        }
      }, [deepLinkUrl]);
    
      useEffect(() => {
        if (postId || deepLinkUrl) {
          console.log('Fetching post:', postId || deepLinkUrl);
          setLoading(true);
          fetchPosts(postId || deepLinkUrl);
          setLoading(false);
        }
      }, [postId, deepLinkUrl]);

      if (newPost === undefined) {
      return null;
      }


    const createTwoButtonAlert = () => {

        setmodalvisible(true);

    }
    const makeCall1 = () => {
        const phoneNumbers = ["0256744112"]

        let phoneNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];

        if (Platform.OS === 'android') {
            phoneNumber = `tel:${phoneNumber}`;
        } else {
            phoneNumber = `telprompt:${phoneNumber}`;
        }
        try {
            Linking.openURL(phoneNumber);
        }
        catch (e) {
            console.log(e)
        }

    };





    


    






    if (!newPost) {
        return (
            //     <View style={{alignItems: 'center', justifyContent:"center"}}>
            //      <AnimatedEllipsis animationDelay={100} style={{
            //     color: 'blue',
            //    fontSize: 100,

            //   letterSpacing: -15,

            //    }}/>

            //    </View>
            <View


                style={{
                    flex: 1, justifyContent: 'center', alignContent: "center"
                }} >

                <SkeletonContent
                    containerStyle={{ paddingBottom: 0, width: '100%' }}
                    animationDirection="horizontalLeft"
                    layout={[
                        // long line
                        { width: '100%', height: 300, marginBottom: 10, borderRadius: 10 },
                        { width: 220, height: 20, marginBottom: 10 },
                        // short line
                        { width: 90, height: 20, marginBottom: 10 },
                        { width: 40, height: 20, marginBottom: 80 },


                        { width: '100%', height: 150, marginBottom: 100 },

                        { width: '100%', height: 20, marginBottom: 12, paddingHorizontal: 40 },
                        { width: '100%', height: 20, marginBottom: 12 },
                        { width: '100%', height: 20, marginBottom: 12 },
                        { width: '100%', height: 20, marginBottom: 12 },
                        { width: '100%', height: 20, marginBottom: 12 },
                        { width: '100%', height: 20, marginBottom: 12 },
                        { width: '100%', height: 20, marginBottom: 12 },



                        // ...
                    ]}
                >


                </SkeletonContent>


            </View>


        )
    }







    return (
        <ScrollView style={{ backgroundColor: 'white', }}>
            <View style={{ alignItems: "center" }}>
                <Modal
                    animationType={"slide"} transparent={false}
                    visible={modalvisible}
                    onRequestClose={() => {

                        console.log("Modal has been closed.")
                    }}
                >

                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        backgroundColor: 'white',
                        padding: 10
                    }}>
                        <Text style={{
                            color: 'black',
                            marginTop: 10, fontWeight: 'bold', fontSize: 22
                        }}>Service Charge!</Text>
                        <Text style={{ marginBottom: 20 }}>We began RentIt to help people like you.
                            In order to continue doing that, we are now charging a GHS 20 service fee. This payment is one-time. You will not pay
                            anything again for using RentIt. You can browse thousands of homes and speak to homeowners directly. No agents and walking and moving fees</Text>
                        <View style={{ paddingBottom: 10 }}>
                            <Pressable
                                style={{
                                    width: 300, backgroundColor: 'black',
                                    justifyContent: 'center', flexDirection: 'row',
                                    alignItems: 'center', borderRadius: 50,
                                    zIndex: 1, alignSelf: "center",

                                }}
                                onPress={makeCall1}>
                                <Fontisto name="phone" size={15} style={{ color: 'white', margin: 10, transform: [{ rotate: '90deg' }] }} />

                                <Text adjustsFontSizeToFit={true} style={{
                                    justifyContent: 'center', alignItems: 'center', fontSize: 10,
                                    fontFamily: 'Montserrat-SemiBold', color: "white"
                                }}>Call if you have any problems or you need help</Text>

                            </Pressable>

                        </View>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => {



                                    navigation.navigate('Payment', {
                                        channel: ["mobile_money"],
                                        totalAmount: 20,
                                        homeimage: null,
                                        homelatitude: null,
                                        homelongitude: null,
                                        hometitle: null,
                                        homebed: null,
                                        homeid: null,
                                        homeyears: null,
                                        homemonths: null,

                                    })


                                }}
                                style={{ marginHorizontal: 10, alignItems: "center", padding: 10, borderRadius: 10, backgroundColor: "deeppink", height: 40 }}
                            >


                                <Text style={{ color: 'white', fontSize: 14, fontWeight: "bold" }}>
                                    Pay with Mobile Money
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {

                                    navigation.navigate('Payment', {
                                        channel: ["card"],
                                        totalAmount: 20,
                                        homeimage: null,
                                        homelatitude: null,
                                        homelongitude: null,
                                        hometitle: null,
                                        homebed: null,
                                        homeid: null,
                                        homeyears: null,
                                        homemonths: null,

                                    })


                                }}

                                style={{ marginHorizontal: 10, alignItems: "center", borderRadius: 10, backgroundColor: "blue", padding: 10, height: 40 }}>
                                <Text style={{ color: 'white', fontSize: 14, fontWeight: "bold" }}>
                                    Pay with Debit Card
                                </Text>
                            </TouchableOpacity>


                        </View>

                    </View>

                </Modal>
            </View>
            <DetailedPost post={newPost} />
        </ScrollView>
    );


};

export default PostScreen;