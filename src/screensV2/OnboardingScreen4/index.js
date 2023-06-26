import React, {useState, Platform, useEffect} from 'react';
import {View, Image, Pressable, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {Storage} from 'aws-amplify';
import uuid from 'react-native-uuid';

import {useNavigation, useRoute} from '@react-navigation/native';

import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import PlusIcon from '../../../assets/data/images/icons/plus-icon.svg';
import CameraIcon from '../../../assets/data/images/icons/camera-icon.svg';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {offsets} from '../../styles/globalStyles';
import DividedProgress from '../../componentsV2/DataDisplay/DividedProgress';
import BottomActionsBar from '../../componentsV2/Inputs/BottomActionsBar';

const OnboardingScreen3 = () => {
  const navigation = useNavigation();
  const [images, setImages] = useState([]);
  const [progressText, setProgressText] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState('');
  const [urls, setUrls] = useState([]);
  const route = useRoute();
  const title = route.params?.title;
  const bed = route.params?.bed;
  const bedroom = route.params?.bedroom;
  const bathroom = route.params?.bathroom;
  const type = route.params?.type;
  const description = route.params?.description;
  const mode = route.params?.mode;
  const amenities = route.params?.amenities;

  async function getFileSize(uri) {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob.size;
  }
  async function pathToImageFile(uri) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      await Storage.put(uuid.v4(), blob, {
        level: 'public',
        contentType: 'image/jpeg', // contentType is optional
      });
    } catch (err) {
      console.log('Error uploading file:', err);
    }
  }
  const convertPathToFileURL = path => {
    // if (Platform.OS === 'ios') {
    //   return `file://${path}`;
    // }
    return `file://${path}`;
    // return path;
  };

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

  const resizeImage = async (uri, width, height, format, quality) => {
    console.log('Original URI:', uri); // Add this line to log the original URI

    const originalSize = await getFileSize(uri);

    try {
      const resizedImage = await ImageResizer.createResizedImage(
        uri,
        width,
        height,
        format,
        quality,
      );
      const resizedSize = await getFileSize(resizedImage.uri);

      const reductionPercentage = ((originalSize - resizedSize) / originalSize) * 100;

      return resizedImage;
    } catch (err) {
      console.log('Error resizing the image:', err);
      return null;
    }
  };

  const fetchResourceFromURI = async uri => {
    const response = await fetch(uri);

    const blob = await response.blob();

    return blob;
  };

  const handleDeleteImage = imageToDelete => {
    setImages(prevImages => prevImages.filter(image => image.name !== imageToDelete.name));
  };

  useEffect(() => {
    if (imageUrls != '') {
      setUrls(prevImages => prevImages.concat(imageUrls));
    }
  }, [imageUrls]);
  const uploadResource = async image => {
    if (isLoading) return;
    setisLoading(true);
    const img = await fetchResourceFromURI(image.uri);
    setImageUrls(`https://d1mgzi0ytcdaf9.cloudfront.net/public/${image.name}`);

    return Storage.put(image.name, img, {
      level: 'public',
      contentType: 'image/jpeg',
      progressCallback(uploadProgress) {
        setProgressText((uploadProgress.loaded / uploadProgress.total) * 100);
      },
    })
      .then(res => {
        setisLoading(false);
        Storage.get(res.key, {
          level: 'public',
          contentType: 'image/jpeg',
        })
          .then(result => {
            console.log(result);
          })
          .catch(err => {
            setProgressText('Upload Error');
            console.log(err);
          });
      })
      .catch(err => {
        setisLoading(false);
        setProgressText('Upload Error');
        console.log(err);
      });
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 1024,
      height: 683,
      mediaType: 'photo',
    }).then(image => {
      console.log(image);
      const fileURL = convertPathToFileURL(image.path);

      (async () => {
        resizeImage(fileURL, 1024, 683, 'JPEG', 80)
          .then(resizedImage => {
            if (resizedImage) {
              const img = {
                uri: resizedImage.uri,
                type: image.mime,
                name: uuid.v4(),
              };
              uploadResource(img);
              setImages(prevImages => prevImages.concat(img));
            }
          })
          .catch(err => console.error('Error obtaining resized image:', err));
      })();
    });
  };
  const openPicker = () => {
    ImagePicker.openPicker({
      width: 1024,
      height: 683,
      multiple: true,
      maxFiles: 10,
      mediaType: 'photo',
    }).then(async image => {
      image.map(item => {
        const fileURL = convertPathToFileURL(item.path);
        (async () => {
          resizeImage(fileURL, 1024, 683, 'JPEG', 80)
            .then(resizedImage => {
              if (resizedImage) {
                const img = {
                  uri: resizedImage.uri,
                  type: item.mime,
                  name: uuid.v4(),
                };

                uploadResource(img);
                setImages(prevImages => prevImages.concat(img));
              }
            })
            .catch(err => console.error('Error obtaining resized image:', err));
        })();
      });
    });
  };

  useEffect(() => {
    if (isLoading) {
      async () => {
        await saveProgress({
          title,
          type,
          description,
          bed,
          bedroom,
          bathroom,
          imageUrls: urls,
          mode,
          amenities,
        });
        navigation.navigate('OnboardingScreen5', {
          title,
          type,
          description,
          bed,
          bedroom,
          bathroom,
          imageUrls: urls,
          mode,
          amenities,
        });
      };
    }
  }, [isLoading]);
  const goFaqs = () => {};
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView>
      <View style={styles.mainContent}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={goBack}>
            <Image source={BackArrow} />
          </Pressable>
          <View style={styles.topButtons}>
            <Pressable
              style={styles.topButton}
              onPress={async () => {
                await saveProgress({
                  type,
                  title,
                  description,
                  bed,
                  bedroom,
                  bathroom,
                  mode,
                  amenities,
                });
                navigation.navigate('OnboardingScreen16', {
                  type,
                  title,
                  description,
                  bed,
                  bedroom,
                  bathroom,
                  mode,
                  amenities,
                });
              }}>
              <Typography style={styles.topButtonText}>Save & exit</Typography>
            </Pressable>
            <Pressable style={styles.topButton} onPress={goFaqs}>
              <Typography style={styles.topButtonText}>FAQs</Typography>
            </Pressable>
          </View>
        </View>

        <Typography bold style={styles.title}>
          Let’s add pictures of your home.
        </Typography>

        <View style={styles.placesList}>
          <Pressable style={styles.upload} onPress={openPicker}>
            <PlusIcon width={20} height={20} />
            <Typography style={{color: '#717171', paddingLeft: 10, paddingTop: 3}}>
              Upload photos
            </Typography>
          </Pressable>
          <Pressable style={styles.upload} onPress={openCamera}>
            <CameraIcon width={20} height={20} />
            <Typography style={{color: '#717171', paddingLeft: 10, paddingTop: 3}}>
              Upload photos
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
          <BottomActionsBar
            leftText="Back"
            rightText="Next"
            rightAction={async () => {
              await saveProgress({
                type,
                title,
                description,
                bed,
                bedroom,
                bathroom,
                mode,
                amenities,
              });
              navigation.navigate('OnboardingScreen16', {
                type,
                title,
                description,
                bed,
                bedroom,
                bathroom,
                mode,
                amenities,
              });
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen3;
