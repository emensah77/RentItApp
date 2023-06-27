import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  Alert,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  TextInput,
  FlatList,
  Pressable,
  Dimensions,
  Button,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';
import {useNavigation, useRoute} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faPlus,
  faFaucet,
  faBath,
  faBed,
  faToilet,
  faWifi,
  faWater,
  faCamera,
  faUpload,
  faCameraRetro,
  faFileUpload,
  faCloudUploadAlt,
  faArrowAltCircleUp,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {API, graphqlOperation} from 'aws-amplify';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import {createPost} from '../../graphql/mutations';
import {AuthContext} from '../../navigation/AuthProvider';
import {HOME_STATUS} from '../../variables.js';
import styles from './styles.js';

const OnboardingScreen7 = props => {
  const navigation = useNavigation();
  const [images, setImages] = useState([]);
  const route = useRoute();
  const title = route.params?.title || progressData?.title;
  const bed = route.params?.bed || progressData?.bed;
  const bedroom = route.params?.bedroom || progressData?.bedroom;
  const bathroom = route.params?.bathroom || progressData?.bathroom;
  const imageUrls = route.params?.imageUrls || progressData?.imageUrls;
  const homeprice = route.params?.homeprice || progressData?.homeprice;
  const latitude = route.params?.latitude || progressData?.latitude;
  const longitude = route.params?.longitude || progressData?.longitude;
  const type = route.params?.type || progressData?.type;
  const description = route.params?.description || progressData?.description;
  const mode = route.params?.mode || progressData?.mode;
  const amenities = route.params?.amenities || progressData?.amenities;
  const phoneNumber = route.params?.phoneNumber || progressData?.phoneNumber;
  const locality = route.params?.locality || progressData?.locality;
  const sublocality = route.params?.sublocality || progressData?.sublocality;
  const address = route.params?.address || progressData?.address;
  const marketerNumber = route.params?.marketerNumber || progressData?.marketerNumber;
  const currency = route.params?.currency || progressData?.currency;
  const loyaltyProgram = route.params?.loyaltyProgram || progressData?.loyaltyProgram;
  const negotiable = route.params?.negotiable || progressData?.negotiable;
  const furnished = route.params?.furnished || progressData?.furnished;
  const videoUrl = route.params?.videoUrl || progressData?.videoUrl;
  const {user, logout} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [mergedData, setMergedData] = useState({});

  const uploadusers = [
    'UWHvpJ1XoObsFYTFR48zYe6jscJ2',
    '7WGODlIhvkXGhjpngLXxAnQihTK2',
    'lvtDmH13IRW1njCJKZyKsO2okKr1',
  ];

  const loadProgress = async userId => {
    try {
      const response = await fetch(
        `https://a27ujyjjaf7mak3yl2n3xhddwu0dydsb.lambda-url.us-east-2.on.aws/?userId=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const progressData = await response.json();

      if (progressData) {
        return progressData;
      }
      throw new Error('No progress data found');
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  };
  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  const fetchProgressData = async () => {
    const data = await loadProgress(user.uid);
    if (data) {
      console.log('Progress data found:', data);
      setProgressData(data);
    }
  };

  useEffect(() => {
    getUser();
    console.log('userData', userData);
    fetchProgressData();
  }, []);

  useEffect(() => {
    if (progressData) {
      const sanitizedRouteParams = Object.fromEntries(
        Object.entries(route.params).filter(([key, value]) => value !== undefined),
      );

      const merged = {
        ...progressData,
        ...sanitizedRouteParams,
        ...progressData.progressData,
      };

      const unwantedKeys = ['progressData', 'screenName'];

      const sanitizedMergedData = Object.keys(merged).reduce((acc, key) => {
        if (!unwantedKeys.includes(key)) {
          acc[key] = merged[key];
        }
        return acc;
      }, {});

      setMergedData(sanitizedMergedData);
    }
    console.log('mergedData', mergedData);
  }, [progressData]);

  useEffect(() => {}, []);

  const searchApi = async data => {
    const {search, postId, title, description, image} = data;
    await axios
      .get(
        `https://rentit.herokuapp.com/api/v1/emojis?search=${search}&homeId=${postId}&title=${title}&description=${description}&image=${image}`,
      )
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(error => console.log(error));
  };

  async function clearProgressData(userId) {
    try {
      const response = await fetch(
        'https://a27ujyjjaf7mak3yl2n3xhddwu0dydsb.lambda-url.us-east-2.on.aws/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            action: 'clear',
          }),
        },
      );

      const result = await response.json();

      if (response.status === 200) {
        console.log('Progress data cleared successfully:', result);
      } else {
        console.error('Error clearing progress data:', result);
      }
    } catch (error) {
      console.error('Error clearing progress data:', error);
    }
  }

  const uploadHome = async id => {
    try {
      const input = {
        image: mergedData?.imageUrls[0],
        bed: mergedData.bed,
        bedroom: mergedData.bedroom,
        maxGuests: mergedData.bedroom,
        bathroomNumber: mergedData.bathroom,
        title: mergedData.title,
        type: mergedData.type,
        mode: mergedData.mode,
        userID: user.uid,
        phoneNumbers: [mergedData.phoneNumber],
        images: mergedData.imageUrls,
        description: mergedData.description,
        locality: mergedData.locality,
        sublocality: mergedData.sublocality,
        latitude: mergedData.latitude,
        longitude: mergedData.longitude,
        oldPrice: Math.round(mergedData.homeprice * 12),
        newPrice: Math.round(mergedData.homeprice * 12),
        aircondition: mergedData.amenities.includes('Air Conditioner') ? 'Yes' : 'No',
        wifi: mergedData.amenities.includes('WiFi') ? 'Yes' : 'No',
        kitchen: mergedData.amenities.includes('Kitchen') ? 'Yes' : 'No',
        bathroom: mergedData.amenities.includes('Bathroom') ? 'Yes' : 'No',
        water: mergedData.amenities.includes('Water') ? 'Yes' : 'No',
        toilet: mergedData.amenities.includes('Toilet') ? 'Yes' : 'No',
        marketerNumber: mergedData.marketerNumber,
        currency: [mergedData.currency],
        status: HOME_STATUS.PENDING,
        loyaltyProgram: mergedData.loyaltyProgram,
        negotiable: mergedData.negotiable,
        furnished: mergedData.furnished,
        videoUrl: mergedData.videoUrl,
        homeownerName: mergedData.homeownerName,
        availabilityDate: mergedData.availabilityDate,
        available: mergedData.available,
      };
      const uploadedHome = await API.graphql(
        graphqlOperation(
          createPost,
          {
            input,
          },
          {
            id,
          },
        ),
      );

      await searchApi({
        search: mergedData.address,
        postId: uploadedHome.data.createPost.id,
        title: mergedData.title,
        description: mergedData.description,
        image: mergedData.imageUrls[0],
      });
      await clearProgressData(user.uid);
      console.log(
        'Succesfully uploaded the home',
        mergedData.address,
        uploadedHome.data.createPost.id,
      );
      // console.log("Succesfully uploaded the home", uploadHome);
      //   console.log("homeid", id)
    } catch (e) {
      console.log('Error uploading home', e);
    }
  };

  const goHome = () => {
    uploadHome();

    Alert.alert('We will review your home, if approved it will be available for lease or sale');
    navigation.replace('Home');
  };
  const openCamera = () => {
    const options = {
      storageOptions: {
        path: 'images',
        maxWidth: 1024,
        maxHeight: 683,
      },
    };
    launchCamera(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
      } else if (response.errorCode === 'camera_unavailable') {
      } else if (response.customButton) {
      } else {
        const img = {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName || 'file',
        };

        setImages(prevImages => prevImages.concat(img));
        console.log(images);
      }
    });
  };
  const openLibrary = () => {
    launchImageLibrary({maxWidth: 1024, maxHeight: 683}, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        const img = {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName || 'file',
        };

        setImages(prevImages => prevImages.concat(img));
        console.log(images);
      }
    });
  };

  return (
    <LinearGradient
      colors={['purple', 'deeppink']}
      start={{x: 0.1, y: 0.2}}
      end={{x: 1, y: 0.5}}
      style={styles.container}
    >
      <StatusBar hidden />
      <Pressable onPress={() => navigation.goBack()}>
        <Fontisto name="angle-left" size={25} style={{color: 'white', margin: 20, marginTop: 30}} />
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.text_header}> We need to verify {'\n'} your home </Text>
      </View>

      <Animatable.View
        useNativeDriver
        animation="fadeInUpBig"
        duration={1500}
        style={styles.footer}
      >
        <Text style={{fontSize: 18, fontFamily: 'Montserrat-Bold'}}>
          {' '}
          Take a picture of your ID Card {'\n'} and light bill of your home{' '}
        </Text>

        {images.length != 0 ? (
          <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => openLibrary()}
              style={{
                padding: 10,
                borderColor: 'black',
                borderWidth: 1,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{fontSize: 18, fontFamily: 'Montserrat-Bold'}}>
                Add {images.length >= 5 ? 'more' : 'at least 5'} photos
              </Text>
              <TouchableOpacity onPress={() => openLibrary()}>
                <FontAwesomeIcon icon={faPlusCircle} size={25} color="black" />
              </TouchableOpacity>
            </TouchableOpacity>

            <FlatList
              data={images}
              numColumns={2}
              renderItem={({item}) => (
                <View
                  style={{
                    width: Dimensions.get('window').width / 2,
                    height: 200,
                    flex: 1,
                    flexDirection: 'column',
                    margin: 5,
                  }}
                >
                  <Image
                    source={{uri: item.uri}}
                    style={{
                      borderRadius: 10,
                      flex: 1,
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover',
                    }}
                  />
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />

            <TouchableOpacity
              disabled={images.length < 5}
              onPress={goHome}
              style={{
                left: 250,
                width: 100,
                backgroundColor: 'deeppink',
                borderRadius: 20,
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 20,
                marginTop: 15,
                opacity: images.length < 5 ? 0.2 : 1,
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Montserrat-Bold',
                  fontSize: 14,
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView>
            <TouchableOpacity
              onPress={() => openLibrary()}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 20,
                borderWidth: 1,
                borderColor: 'darkgray',
                borderRadius: 10,
                marginVertical: 20,
                paddingHorizontal: 20,
                marginHorizontal: 20,
                flex: 1,
              }}
            >
              <View style={{justifyContent: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>Upload a picture of your ID or bill</Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesomeIcon icon={faArrowAltCircleUp} size={30} color="black" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openCamera()}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 20,
                borderWidth: 1,
                borderColor: 'darkgray',
                borderRadius: 10,
                marginVertical: 20,
                paddingHorizontal: 20,
                marginHorizontal: 20,
                flex: 1,
              }}
            >
              <View style={{justifyContent: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>Take a picture of your ID or bill</Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesomeIcon icon={faCamera} size={30} color="black" />
              </View>
            </TouchableOpacity>
            {userData?.marketer_status === 'ACCEPTED' ? (
              <TouchableOpacity
                onPress={goHome}
                style={{
                  left: 250,
                  width: 100,
                  backgroundColor: 'deeppink',
                  borderRadius: 20,
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'Montserrat-Bold',
                    fontSize: 14,
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                disabled={images.length === 0}
                onPress={goHome}
                style={{
                  left: 250,
                  width: 100,
                  backgroundColor: 'deeppink',
                  opacity: images.length === 0 ? 0.4 : 1,
                  borderRadius: 20,
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'Montserrat-Bold',
                    fontSize: 14,
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </Animatable.View>
    </LinearGradient>
  );
};

export default OnboardingScreen7;
