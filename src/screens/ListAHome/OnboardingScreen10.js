import React, {useState, useCallback, useEffect} from 'react';
import {Platform /* FlatList, TouchableOpacity, Image */} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {Storage} from 'aws-amplify';
import uuid from 'react-native-uuid';
import ImageResizer from '@bam.tech/react-native-image-resizer';

import Base from './Base';

import {Typography, CardDisplay, Whitespace, Container, Page} from '../../components';
import add from '../../assets/images/add.png';
import camera from '../../assets/images/camera.png';
// import deleteIcon from '../../assets/images/deleteIcon.png';
// import deleteIcon from '../../assets/images/available.png';

const OnboardingScreen10 = props => {
  const {
    route: {params: {imageUrls: iU} = {imageUrls: []}},
  } = props;

  const [imageUrls, setImageUrls] = useState(iU);
  const [data, setData] = useState({imageUrls: iU});
  const [progressText, setProgressText] = useState('');

  // const deleteImage = useCallback(
  //   url => () => {
  //     const key = url.split('/').pop();

  //     Storage.remove(key, {level: 'public'})
  //       .then(() => setImageUrls(prevUrls => prevUrls.filter(itemUrl => itemUrl !== url)))
  //       .catch(err => console.error('An error occurred while deleting the image', err));
  //   },
  //   [],
  // );

  // const getURL = useCallback(uri => ({uri}), []);

  // const renderItem = useCallback(
  //   ({item: uri}) => {
  //     return (
  //       <Container row width="50%">
  //         <Container style={{position: 'relative'}}>
  //           <Image src={getURL(uri)} width="100%" style={{aspectRatio: 1, borderRadius: 10}} />
  //           <TouchableOpacity
  //             onPress={deleteImage(uri)}
  //             style={{position: 'absolute', right: 10, top: 10, width: 20, height: 20, zIndex: 1}}>
  //             <Image src={deleteIcon} width="100%" height="100%" />
  //           </TouchableOpacity>
  //         </Container>
  //       </Container>
  //     );
  //   },
  //   [],
  // );

  // const keyExtractor = useCallback((_, index) => index.toString(), []);

  const upload = useCallback(async images => {
    setImageUrls([]);

    const newUrls = await Promise.all(
      images.map(async image => {
        let {path} = image;
        if (Platform.OS === 'ios') {
          path = `file://${path}`;
        }

        const resizeImage = await ImageResizer.createResizedImage(
          path,
          1024,
          683,
          'JPEG',
          80,
        ).catch(e => {
          console.error('An error occurred with the resize operation.', e);
        });
        if (resizeImage && resizeImage.uri) {
          path = resizeImage.uri;
        }
        const response = await fetch(path);
        const rawFile = await response.blob();

        const name = `home-${uuid.v4()}`;
        return Storage.put(name, rawFile, {
          level: 'public',
          contentType: 'image/jpeg',
          progressCallback(uploadProgress) {
            setProgressText((uploadProgress.loaded / uploadProgress.total) * 100);
          },
        })
          .then(res => {
            setProgressText('');

            return Storage.get(res.key, {
              level: 'public',
              contentType: 'image/jpeg',
            });
          })
          .catch(e => {
            console.error('An error occurred with the upload.', e);
          });
      }),
    );

    setImageUrls(
      newUrls
        .filter(url => !!url)
        .map(url => `https://d1mgzi0ytcdaf9.cloudfront.net/public/${url}`),
    );
  }, []);

  const openCamera = useCallback(() => {
    setProgressText('');

    ImagePicker.openCamera({
      width: 1024,
      height: 683,
      mediaType: 'photo',
    })
      .then(image => upload([image]))
      .catch(e =>
        console.error(
          'An error occurred within the open camera function while attempting to upload',
          e,
        ),
      );
  }, [upload]);

  const openPicker = useCallback(() => {
    setProgressText('');

    ImagePicker.openPicker({
      width: 1024,
      height: 683,
      multiple: true,
      maxFiles: 5,
      mediaType: 'photo',
    })
      .then(upload)
      .catch(e =>
        console.error(
          'An error occurred within the open picker function while attempting to upload',
          e,
        ),
      );
  }, [upload]);

  useEffect(() => {
    setData({imageUrls});
  }, [imageUrls]);

  // console.log('progressText', progressText, imageUrls, uploadedImages, data.imageUrls);

  if (progressText) {
    return (
      <Page inline>
        <Whitespace marginTop={20} />

        <Typography center height={30} width="100%" color="#1F2D3D" size={22} weight="700">
          Uploading your photos of your home
        </Typography>

        <Whitespace marginTop={27} />

        <Typography center width="90%" color="#727272" size={14} weight="700">
          {Math.floor(parseInt(progressText, 10) / 100) * 5} of 5 uploaded
        </Typography>
      </Page>
    );
  }

  return (
    <Base
      index={10}
      total={12}
      isComplete={data.imageUrls && data.imageUrls.length > 0}
      data={data}
      title="Let's add pictures of your home.">
      <Container center type="chipSmall" color="#FFF" height={50} onPress={openPicker}>
        <CardDisplay
          leftImageWidth={20}
          leftImageHeight={20}
          leftImageSrc={add}
          name={
            <Typography type="notice" left width="100%">
              Upload photos
            </Typography>
          }
          center
          bold
          onPress={openPicker}
        />
      </Container>

      <Whitespace marginTop={22} />

      <Container center type="chipSmall" color="#FFF" height={50} onPress={openCamera}>
        <CardDisplay
          leftImageWidth={20}
          leftImageHeight={20}
          leftImageSrc={camera}
          name={
            <Typography type="notice" left width="100%">
              Take a photo
            </Typography>
          }
          center
          bold
          onPress={openCamera}
        />
      </Container>

      <Whitespace marginTop={22} />

      {/* <FlatList
        data={imageUrls}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
      /> */}
    </Base>
  );
};

export default OnboardingScreen10;
