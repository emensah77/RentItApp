import React, {useState, useEffect, useContext} from 'react';
import {View, Image, Pressable, SafeAreaView, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';
import {API, graphqlOperation} from 'aws-amplify';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';
import {createPost} from '../../graphql/mutations';
import {HOME_STATUS} from '../../variables.js';
import {AuthContext} from '../../navigation/AuthProvider';
import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import PlusIcon from '../../../assets/data/images/icons/plus-icon.svg';
import CameraIcon from '../../../assets/data/images/icons/camera-icon.svg';
import {offsets} from '../../styles/globalStyles';
import DividedProgress from '../../componentsV2/DataDisplay/DividedProgress';
import BottomActionsBar from '../../componentsV2/Inputs/BottomActionsBar';

const OnboardingScreen15 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [images, setImages] = useState([]);

  const [progressData, setProgressData] = useState(null);
  const [mergedData, setMergedData] = useState({});
  const [userData, setUserData] = useState(null);
  const {user, logout} = useContext(AuthContext);
  const saveProgress = async progressData => {
    try {
      const user = auth().currentUser;
      const screenName = route.name;
      const userId = user.uid;
      await fetch('https://a27ujyjjaf7mak3yl2n3xhddwu0dydsb.lambda-url.us-east-2.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          progress: {
            screenName,
            progressData,
          },
        }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };
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
  const fetchProgressData = async () => {
    const data = await loadProgress(user.uid);
    if (data) {
      setProgressData(data);
    }
  };
  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  };
  useEffect(() => {
    getUser();

    fetchProgressData();
  }, []);
  useEffect(() => {
    if (progressData) {
      const sanitizedRouteParams = Object.fromEntries(
        Object.entries(route?.params).filter(([key, value]) => value !== undefined),
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
  }, [progressData]);
  const goFaqs = () => {
    navigation.navigate('OnboardingScreen9');
  };
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
    } catch (e) {}
  };
  const searchApi = async data => {
    const {search, postId, title, description, image} = data;
    await axios
      .get(
        `https://rentit.herokuapp.com/api/v1/emojis?search=${search}&homeId=${postId}&title=${title}&description=${description}&image=${image}`,
      )
      .then(data => {
        return data;
      });
  };
  const goHome = () => {
    uploadHome();

    Alert.alert('We will review your home, if approved it will be available for lease or sale');
    navigation.replace('Home');
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
      } else {
      }
    } catch (error) {}
  }
  const openLibrary = () => {
    launchImageLibrary({maxWidth: 1024, maxHeight: 683}, response => {
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
      }
    });
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
      }
    });
  };

  return (
    <SafeAreaView>
      <View style={styles.mainContent}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton}>
            <Image source={BackArrow} />
          </Pressable>
          <View style={styles.topButtons}>
            <Pressable style={styles.topButton} onPress={goHome}>
              <Typography style={styles.topButtonText}>Save & exit</Typography>
            </Pressable>
            {/* //OnboardingScreen13 */}
            <Pressable style={styles.topButton} onPress={goFaqs}>
              <Typography style={styles.topButtonText}>FAQs</Typography>
            </Pressable>
          </View>
        </View>

        <Typography bold style={styles.title}>
          We need to verify your home
        </Typography>
        <Typography>Take a picture of your ID Card and Electricty bill of your home.</Typography>
        <View style={styles.placesList}>
          <Pressable style={styles.upload}>
            <PlusIcon width={20} height={20} onPress={() => openLibrary()} />
            <Typography style={{color: '#717171', paddingLeft: 10}}>
              Upload photos of your ID or bill
            </Typography>
          </Pressable>
          <Pressable style={styles.upload} onPress={() => openCamera()}>
            <CameraIcon width={20} height={20} />
            <Typography style={{color: '#717171', paddingLeft: 10}}>
              Take photos of your ID or bill
            </Typography>
          </Pressable>
        </View>
        <View
          style={{
            width: wp(100),
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}>
          <View style={{paddingHorizontal: offsets.offsetB}}>
            <DividedProgress total={4} progress={2} style={{marginBottom: offsets.offsetB}} />
          </View>
          <BottomActionsBar leftText="Back" rightText="Next" rightAction={goHome} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen15;
