import React, {useRef, useState, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import axios from 'axios';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';
import base64 from 'base64-js';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';

const OnboardingScreen13 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [videoPath, setVideoPath] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const chunkSize = 5 * 1024 * 1024; // 5MB
  const apiUrl = 'https://byagcgy5qbw4mfwgej3n7rr4ty0xvteq.lambda-url.us-east-2.on.aws/';

  const videoRef = useRef(null);
  const compressVideo = async inputVideoPath => {
    setCompressing(true);

    // Create an output path for the compressed video
    const timestamp = new Date().getTime();
    const outputVideoPath = `${RNFS.CachesDirectoryPath}/compressed_video_${timestamp}.mp4`;

    // Use FFmpegKit to compress the video
    try {
      const command = `-i ${inputVideoPath} -c:v libx264 -preset ultrafast -b:v 1000k -vf "scale=-2:480" -acodec aac -b:a 128k -ar 44100 -metadata:s:v rotate=0 ${outputVideoPath}`;
      const session = await FFmpegKit.execute(command);
      const returnCode = await session.getReturnCode();

      if (ReturnCode.isSuccess(returnCode)) {
        setCompressing(false);

        return outputVideoPath;
      } else if (ReturnCode.isCancel(returnCode)) {
        console.error('Compression canceled');
        throw new Error('Compression canceled');
      } else {
        setCompressing(false);

        console.error('Error compressing video');
        console.error('Return Code:', returnCode);
        console.error('FFmpegKit Session:', session);
        console.error('FFmpegKit Session Output:', await session.getAllLogsAsString());
        throw new Error('Error compressing video');
      }
    } catch (error) {
      console.error('Error compressing video:', error);
      throw error;
    }
  };

  const openVideoPicker = useCallback(async () => {
    Alert.alert(
      'Select Video',
      'Choose an action:',
      [
        {
          text: 'Record a video',
          onPress: async () => {
            launchCameraWithOptions();
          },
        },
        {
          text: 'Select from library',
          onPress: async () => {
            launchImageLibraryWithOptions();
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  }, [launchCameraWithOptions, launchImageLibraryWithOptions]);

  const contentUriToFileUri = async contentUri => {
    try {
      const fileName = `temp_video_${new Date().getTime()}.mp4`;
      const tempFilePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      await RNFS.copyFile(contentUri, tempFilePath);
      return `file://${tempFilePath}`;
    } catch (error) {
      console.error('Error converting content URI to file URI:', error);
      return null;
    }
  };

  const handleVideoResponse = useCallback(async response => {
    if (response.didCancel) {
    } else if (response.error) {
    } else {
      if (response.assets && response.assets.length > 0) {
        const fileUri = await contentUriToFileUri(response.assets[0].uri);
        if (fileUri) {
          setVideoPath(fileUri);
        } else {
        }
      } else {
      }
    }
  }, []);

  const launchCameraWithOptions = useCallback(() => {
    const options = {
      mediaType: 'video',
      videoQuality: 'high',
      durationLimit: 30,
      noData: true,
    };

    launchCamera(options, handleVideoResponse);
  }, [handleVideoResponse]);

  const launchImageLibraryWithOptions = useCallback(() => {
    const options = {
      mediaType: 'video',
      videoQuality: 'low',
      durationLimit: 30,
      noData: true,
    };

    launchImageLibrary(options, handleVideoResponse);
  }, [handleVideoResponse]);

  const handleVideoLoad = useCallback(data => {
    if (data.duration > 65) {
      Alert.alert('Video too long', 'Please select a video that is no longer than 60 seconds.', [
        {text: 'OK'},
      ]);
      setVideoPath(null);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    try {
      // Compress the video before uploading
      const compressedVideoPath = await compressVideo(videoPath);

      // Calculate the reduction percentage

      setUploading(true);

      // Initialize the multipart upload
      const initResponse = await axios.get(apiUrl, {
        params: {method: 'initiate'},
      });

      if (initResponse.status !== 200) {
        throw new Error('Error initiating multipart upload');
      }

      const {fileName, uploadId} = initResponse.data;
      // Use compressedVideoPath instead of videoPath when uploading
      const fileUri = compressedVideoPath;
      const fileBase64 = await RNFS.readFile(fileUri, 'base64');
      const fileArrayBuffer = base64.toByteArray(fileBase64).buffer;
      const fileSize = fileArrayBuffer.byteLength;
      const chunkCount = Math.ceil(fileSize / chunkSize);
      const parts = [];

      const uploadPart = async i => {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, fileSize);
        const chunk = fileArrayBuffer.slice(start, end);
        const partNumber = i + 1;

        // Get pre-signed URL for the current part
        const partResponse = await axios.get(apiUrl, {
          params: {
            method: 'part',
            fileName,
            uploadId,
            partNumber,
          },
        });

        if (partResponse.status !== 200) {
          throw new Error('Error fetching pre-signed URL for part');
        }

        const {preSignedUrl} = partResponse.data;

        // Upload the current part using the pre-signed URL
        const uploadResponse = await fetch(preSignedUrl, {
          method: 'PUT',
          headers: {'Content-Type': 'video/mp4'},
          body: chunk,
        });

        if (uploadResponse.status !== 200) {
          throw new Error('Error uploading part');
        }

        setUploadProgress(((i + 1) / chunkCount) * 100);

        return {
          PartNumber: partNumber,
          ETag: uploadResponse.headers.get('etag'),
        };
      };

      const concurrencyLimit = 5; // Adjust this value based on the desired level of concurrency

      for (let i = 0; i < chunkCount; i += concurrencyLimit) {
        const uploadPromises = [];

        for (let j = i; j < i + concurrencyLimit && j < chunkCount; j++) {
          uploadPromises.push(uploadPart(j));
        }

        // Wait for the current batch of uploads to complete
        // eslint-disable-next-line no-await-in-loop
        const batchResults = await Promise.all(uploadPromises);
        parts.push(...batchResults);
      }

      // Complete the multipart upload
      const completeResponse = await axios.post(
        apiUrl,
        {parts, uploadId},
        {
          // Include uploadId here
          params: {method: 'complete', fileName, uploadId},
        },
      );

      if (completeResponse.status !== 200) {
        throw new Error('Error completing multipart upload');
      }

      const {videoUrl} = completeResponse.data;

      setUploading(false);
      setVideoUrl(videoUrl);
      setVideoUploaded(true);

      Alert.alert(
        'Video uploaded',
        `Your video has been uploaded successfully. Video URL: ${videoUrl}`,
      );
    } catch (error) {
      setUploading(false);
      Alert.alert('Upload failed', 'Failed to upload the video. Please try again.');
    }
  }, [chunkSize, videoPath]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleNext = useCallback(async () => {
    await saveProgress({...route.params, videoUrl});
    navigation.navigate('OnboardingScreen7', {
      ...route.params,
      videoUrl,
    });
  }, [navigation, route.params, saveProgress, videoUrl]);

  const saveProgress = useCallback(
    async progressData => {
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
    },
    [route.name],
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {videoPath && (
        <Video
          ref={videoRef}
          source={{uri: videoPath}}
          style={styles.video}
          resizeMode="cover"
          repeat
          onLoad={handleVideoLoad}
        />
      )}
      {!videoPath && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructions}>
            Click on the plus icon to start recording a 60-second video about your home. Record
            important places in your house a tenant will be interested in.
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
        <TouchableOpacity style={styles.plusButton} onPress={openVideoPicker}>
          <FontAwesome name="plus" size={25} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.muteButtonContainer}>
        <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
          <FontAwesome name={isMuted ? 'volume-off' : 'volume-up'} size={25} color="white" />
        </TouchableOpacity>
      </View>
      {compressing && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="black" />
            <Text style={styles.loadingText}>Compressing and Enhancing video...</Text>
          </View>
        </View>
      )}
      {uploading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="black" />
            <Text style={styles.loadingText}>Uploading...{uploadProgress.toFixed(0)}%</Text>
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
  compressingOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compressingText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default OnboardingScreen13;
