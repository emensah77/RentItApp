import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
  ActivityIndicator,
  PermissionsAndroid
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import axios from 'axios';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {check, request, RESULTS,PERMISSIONS} from 'react-native-permissions';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';
import base64 from 'base64-js';





const OnboardingScreen13 = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [videoPath, setVideoPath] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const chunkSize = 5 * 1024 * 1024; // 5MB
  const apiUrl = 'https://byagcgy5qbw4mfwgej3n7rr4ty0xvteq.lambda-url.us-east-2.on.aws/';

  const videoRef = useRef(null);
  const requestCameraPermission = async () => {
    try {
      const cameraPermission = Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      });
  
      const permissionStatus = await check(cameraPermission);
  
      if (permissionStatus === RESULTS.GRANTED) {
        console.log('Camera permission already granted');
        return true;
      }
  
      const result = await request(cameraPermission);
  
      if (result === RESULTS.GRANTED) {
        console.log('Camera permission granted');
        return true;
      } else {
        console.log('Camera permission denied');
        return false;
      }
    } catch (error) {
      console.warn('Error requesting camera permission:', error);
      return false;
    }
  };
  
  const openVideoPicker = async () => {
    Alert.alert(
      'Select Video',
      'Choose an action:',
      [
        {
          text: 'Record a video',
          onPress: async () => {
            const permissionGranted = await requestCameraPermission();
            if (permissionGranted) {
              launchCameraWithOptions();
            }
          },
        },
        {
          text: 'Select from library',
          onPress: async () => {
            const permissionGranted = await requestCameraPermission();
            if (permissionGranted) {
              launchImageLibraryWithOptions();
            }
          },
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
      durationLimit: 30,
      noData: true,
    };
  
    launchCamera(options, handleVideoResponse);
  };
  
  const launchImageLibraryWithOptions = () => {
    const options = {
      mediaType: 'video',
      videoQuality: 'low',
      durationLimit: 30,
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
  
      // Initialize the multipart upload
      const initResponse = await axios.get(apiUrl, {
        params: { method: 'initiate' },
      });
  
      if (initResponse.status !== 200) {
        throw new Error('Error initiating multipart upload');
      }
  
      const { fileName, uploadId } = initResponse.data;
      const fileUri = videoPath;
      const fileBase64 = await RNFS.readFile(fileUri, 'base64');
      const fileArrayBuffer = base64.toByteArray(fileBase64).buffer;
      const fileSize = fileArrayBuffer.byteLength;
      const chunkCount = Math.ceil(fileSize / chunkSize);
      const parts = [];
  
      for (let i = 0; i < chunkCount; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, fileSize);
        const chunk = fileArrayBuffer.slice(start, end);
        const partNumber = i + 1;
  
        // Get pre-signed URL for the current part
        const partResponse = await axios.get(apiUrl, {
          params: { method: 'part', fileName, uploadId, partNumber },
        });
  
        if (partResponse.status !== 200) {
          throw new Error('Error fetching pre-signed URL for part');
        }
  
        const preSignedUrl = partResponse.data.preSignedUrl;
  
        // Upload the current part using the pre-signed URL
        const uploadResponse = await fetch(preSignedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'video/mp4' },
          body: chunk,
        });
  
        if (uploadResponse.status !== 200) {
          throw new Error('Error uploading part');
        }
  
        parts.push({ PartNumber: partNumber, ETag: uploadResponse.headers.get('etag') });
      }
  
      // Complete the multipart upload
      const completeResponse = await axios.post(apiUrl, { parts, uploadId }, { // Include uploadId here
        params: { method: 'complete', fileName, uploadId },
      });
  
      if (completeResponse.status !== 200) {
        throw new Error('Error completing multipart upload');
      }
  
      const videoUrl = completeResponse.data.videoUrl;
  
      setUploading(false);
      setVideoUrl(videoUrl);
      setVideoUploaded(true);
  
      Alert.alert(
        'Video uploaded',
        `Your video has been uploaded successfully. Video URL: ${videoUrl}`,
      );
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