import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  PermissionsAndroid
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import axios from 'axios';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {check, request, PERMISSIONS} from 'react-native-permissions';
import auth from '@react-native-firebase/auth';




const OnboardingScreen13 = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [videoPath, setVideoPath] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);

  const videoRef = useRef(null);
  const requestCameraPermission = async () => {
    let permission;
    if (Platform.OS === 'android') {
      permission = PermissionsAndroid.PERMISSIONS.CAMERA;
    } else if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.CAMERA;
    }
  
    try {
      const granted = await request(permission);
      if (granted === 'granted') {
        console.log('Camera permission given');
        return true;
      } else {
        console.log('Camera permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const openVideoPicker = async () => {
  const hasPermission = await requestCameraPermission();

  if (!hasPermission) {
    return;
  }

  Alert.alert(
    'Select Video',
    'Choose an action:',
    [
      {
        text: 'Record a video',
        onPress: () => launchCameraWithOptions(),
      },
      {
        text: 'Select from library',
        onPress: () => launchImageLibraryWithOptions(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
    { cancelable: true },
  );
};

const handleVideoResponse = (response) => {
  if (response.didCancel) {
    console.log('User cancelled video picker');
  } else if (response.error) {
    console.log('ImagePicker Error: ', response.error);
  } else {
    console.log('Setting videoPath to:', response);

    if (response.assets && response.assets.length > 0) {
      setVideoPath(response.assets[0].uri);
    } else {
      console.log('No video assets found in the response object:', response);
    }
  }
};


  const launchCameraWithOptions = () => {
    const options = {
      mediaType: 'video',
      videoQuality: 'low',
      durationLimit: 60,
      noData: true,
    };
  
    launchCamera(options, handleVideoResponse);
  };
  
  const launchImageLibraryWithOptions = () => {
    const options = {
      mediaType: 'video',
      videoQuality: 'low',
      durationLimit: 60,
      noData: true,
    };
  
    launchImageLibrary(options, handleVideoResponse);
  };
  

  const handleVideoLoad = (data) => {
    if (data.duration > 65) {
      Alert.alert(
        'Video too long',
        'Please select a video that is no longer than 60 seconds.',
        [{ text: 'OK' }],
      );
      setVideoPath(null);
    }
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
  
      // Fetch pre-signed URL from the Lambda function
      const response = await axios.post(
        'https://byagcgy5qbw4mfwgej3n7rr4ty0xvteq.lambda-url.us-east-2.on.aws/',
      );
  
      if (response.status !== 200) {
        throw new Error('Error fetching pre-signed URL');
      }
  
      const preSignedUrl = response.data.preSignedUrl;
  
      // Upload video using the pre-signed URL
      const file = {
        uri: videoPath,
        type: 'video/mp4',
        name: 'video.mp4',
      };
  
      const uploadResponse = await fetch(preSignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'video/mp4',
        },
        body: file,
      });
  
      setUploading(false);
  
      if (uploadResponse.status === 200) {
        const s3Url = preSignedUrl.split('?')[0];
        const videoUrl = s3Url.replace(
          'https://videosrentit.s3.us-east-2.amazonaws.com',
          'https://d1mgzi0ytcdaf9.cloudfront.net'
        );
        
        setVideoUrl(videoUrl);
        setVideoUploaded(true);
  
        Alert.alert(
          'Video uploaded',
          `Your video has been uploaded successfully. Video URL: ${videoUrl}`,
        );
      } else {
        Alert.alert('Upload failed', 'Failed to upload the video. Please try again.');
      }
    } catch (error) {
      setUploading(false);
      console.log('Error uploading video:', error);
      Alert.alert('Upload failed', 'Failed to upload the video. Please try again.');
    }
  };
  
  

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleNext = async() => {
    await saveProgress({ ...route.params, videoUrl })
    navigation.navigate('OnboardingScreen7', {
      ...route.params,
      videoUrl: videoUrl,
    });
  };

  const saveProgress = async (progressData) => {
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
            progressData
          }
        }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      {videoPath && (
        <Video
          ref={videoRef}
          source={{ uri: videoPath }}
          style={styles.video}
          resizeMode="cover"
          repeat={true}
          onLoad={handleVideoLoad}
          onError={(error) => console.log('Error playing video:', error)}
        />
      )}
      {!videoPath && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructions}>
            Click on the plus icon to start recording a 60-second video about
            your home. Record important places in your house a
            tenant will be
interested in.
</Text>
</View>
)}
{videoPath && (
        <View style={styles.uploadButtonContainer}>
          {!videoUploaded ? (
            <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
              <Text style={styles.uploadButtonText}>Upload</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={handleNext}>
              <Text style={styles.uploadButtonText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
<View style={styles.plusButtonContainer}>
<TouchableOpacity
       style={styles.plusButton}
       onPress={openVideoPicker}
     >
<FontAwesome
         name="plus"
         size={25}
         color="white"
       />
</TouchableOpacity>
</View>
<View style={styles.muteButtonContainer}>
<TouchableOpacity
       style={styles.muteButton}
       onPress={toggleMute}
     >
<FontAwesome
name={isMuted ? 'volume-off' : 'volume-up'}
size={25}
color="white"
/>
</TouchableOpacity>
</View>
{uploading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="black" />
            <Text style={styles.loadingText}>Uploading...</Text>
          </View>
        </View>
      )}
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: 'black',
},
video: {
flex: 1,
},
instructionsContainer: {
position: 'absolute',
top: 20,
left: 0,
right: 0,
justifyContent: 'center',
alignItems: 'center',
paddingHorizontal: 20,
},
instructions: {
color: 'white',
fontSize: 18,
fontWeight: 'bold',
textAlign: 'center',
backgroundColor: 'rgba(0, 0, 0, 0.7)',
borderRadius: 10,
padding: 10,
},
uploadButtonContainer: {
position: 'absolute',
top: 20,
right: 20,
},
uploadButton: {
backgroundColor: 'deeppink',
borderRadius: 30,
paddingHorizontal: 20,
paddingVertical: 10,
},
uploadButtonText: {
color: 'white',
fontWeight: 'bold',
fontSize: 18,
textAlign: 'center',
},
plusButtonContainer: {
position: 'absolute',
bottom: 20,
alignSelf: 'center',
},
plusButton: {
backgroundColor: 'rgba(0, 0, 0, 0.5)',
borderRadius: 50,
borderColor: 'white',
borderWidth: 2,
width: 50,
height: 50,
justifyContent: 'center',
alignItems: 'center',
},
muteButtonContainer: {
position: 'absolute',
top: '50%',
right: 20,
marginTop: -25, // Half of the height of the mute button to center it vertically
},
muteButton: {
backgroundColor: 'rgba(0, 0, 0, 0.5)',
borderRadius: 50,
borderColor: 'white',
borderWidth: 2,
width: 50,
height: 50,
justifyContent: 'center',
alignItems: 'center',
},
loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingWrapper: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: 'black',
    fontSize: 18,
  },
});

export default OnboardingScreen13;