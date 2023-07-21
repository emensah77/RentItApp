import React, {useState, useCallback, useEffect} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {Storage} from 'aws-amplify';

import Base from './Base';

import {Typography, CardDisplay, Whitespace, Container, Page, Image} from '../../components';
import add from '../../assets/images/add.png';
import camera from '../../assets/images/camera.png';
import confetti from '../../assets/images/confetti.png';
import {randomInt} from '../../utils';

const OnboardingScreen16 = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [data, setData] = useState({});
  const [progressText, setProgressText] = useState('aaa');

  const upload = useCallback(
    async image => {
      if (progressText) return;

      const response = await fetch(image.path);
      const rawFile = await response.blob();

      const name = `ID-${randomInt(999999999999)}`;
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
            .then(() => {
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

  if (progressText) {
    return (
      <Page inline>
        <Whitespace marginTop="-10%" />

        <Image src={confetti} width="100%" height={290} />

        <Whitespace marginTop={20} />

        <Typography center height={30} width="100%" color="#1F2D3D" size={22} weight="700">
          Listing your home
        </Typography>

        <Whitespace marginTop={27} />

        <Typography center width="90%" color="#727272" size={14} weight="700">
          We will review your home, if approved it will be available for lease or sale
        </Typography>
      </Page>
    );
  }

  return (
    <Base
      index={16}
      total={17}
      isComplete={data.imageUrls && data.imageUrls.length !== 0}
      isFinal
      data={data}
      title="We need to verify your home"
      label="Take a picture of your ID Card and Electricty bill of your home.">
      <Container center type="chipSmall" color="#FFF" height={50} onPress={openPicker}>
        <CardDisplay
          leftImageWidth={20}
          leftImageHeight={20}
          leftImageSrc={add}
          name={
            <Typography type="notice" left width="100%">
              Upload photos of your ID or bill
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
              Take a photo of your ID or bill
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

export default OnboardingScreen16;
