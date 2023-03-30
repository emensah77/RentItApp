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
import { PERMISSIONS, request as requestPermission } from 'react-native-permissions';




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
      const granted = await requestPermission(permission);
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
    const hasPermission = await requestCameraPermission(); // Add this line to request camera permission

    if (!hasPermission) {
      return;
    }
    const options = {
      mediaType: 'video',
      videoQuality: 'low', // Set to low quality
      durationLimit: 60, // Limit to 60 seconds
      noData: true,
    };
  
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        console.log('Setting videoPath to:', response); // Add this line

        if (response.assets && response.assets.length > 0) {
          setVideoPath(response.assets[0].uri);
        } else {
          console.log('No video assets found in the response object:', response);
        }
        
      }
    });
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

      const file = {
        uri: videoPath,
        type: 'video/mp4',
        name: 'video.mp4',
      };

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        'https://byagcgy5qbw4mfwgej3n7rr4ty0xvteq.lambda-url.us-east-2.on.aws/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      setUploading(false);

      if (response.status === 200) {
        const videoUrl = response.data.videoUrl;
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

  const handleNext = () => {
    navigation.navigate('OnboardingScreen7', {
      ...route.params,
      videoUrl: videoUrl,
    });
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