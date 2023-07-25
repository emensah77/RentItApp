import React, {useState, useCallback, useEffect} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import Amplify, {Storage} from 'aws-amplify';

import Base from './Base';

import {Typography, CardDisplay, Whitespace, Container, Page} from '../../components';
import add from '../../assets/images/add.png';
import camera from '../../assets/images/camera.png';
import {randomInt} from '../../utils';

import awsConfig from '../../aws-exports';

const OnboardingScreen10 = props => {
  const {
    route: {params: {imageUrls: iU} = {imageUrls: []}},
  } = props;

  const [imageUrls, setImageUrls] = useState(iU);
  const [data, setData] = useState({imageUrls: iU});
  const [progressText, setProgressText] = useState('');

  const upload = useCallback(
    async image => {
      if (progressText) return;

      const response = await fetch(image.path);
      const rawFile = await response.blob();

      const name = `home-${randomInt(999999999999)}`;

      Amplify.configure(awsConfig);
      Storage.configure({level: 'public', region: 'us-east-2'});

      return Storage.put(name, rawFile, {
        level: 'public',
        contentType: 'image/jpeg',
        progressCallback(uploadProgress) {
          setProgressText((uploadProgress.loaded / uploadProgress.total) * 100);
        },
      })
        .then(res => {
          setProgressText('');

          Storage.get(res.key, {
            level: 'public',
            contentType: 'image/jpeg',
          })
            .then(uploadRes => {
              console.debug('Uploaded Successfully', uploadRes);

              setImageUrls(prevImages =>
                prevImages.concat(`https://d1mgzi0ytcdaf9.cloudfront.net/public/${name}`),
              );
            })
            .catch(err => {
              setProgressText('Upload Error');
              console.error(err);
            });
        })
        .catch(e => {
          console.error('An error occurred with the upload.', e);
        });
    },
    [progressText],
  );

  const openCamera = useCallback(() => {
    ImagePicker.openCamera({
      width: 1024,
      height: 683,
      mediaType: 'photo',
    })
      .then(upload)
      .catch(console.error);
  }, [upload]);

  const openPicker = useCallback(() => {
    ImagePicker.openPicker({
      width: 1024,
      height: 683,
      multiple: true,
      maxFiles: 10,
      mediaType: 'photo',
    })
      .then(async image => {
        setImageUrls([]);
        image.forEach(upload);
      })
      .catch(console.error);
  }, [upload]);

  useEffect(() => {
    setData({imageUrls});
  }, [imageUrls]);

  // console.log('progressText', progressText);

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
      // isComplete={data.imageUrls.length !== 0}
      isComplete
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
    </Base>
  );
};

export default OnboardingScreen10;
