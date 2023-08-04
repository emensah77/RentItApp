import React, {useState, useCallback, useEffect} from 'react';
import {View, Platform, FlatList} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import uuid from 'react-native-uuid';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import AWS from 'aws-sdk';

import Base from './Base';

import {Typography, CardDisplay, Whitespace, Container, Image} from '../../components';
import {global} from '../../assets/styles';
import add from '../../assets/images/add.png';
import camera from '../../assets/images/camera.png';
import deleteIcon from '../../assets/images/delete.png';

const containerStyle = [
  global.flex,
  {backgroundColor: '#FFF', minHeight: '100%'},
  global.pageContent,
];

const flatListStyle = {height: 200, flexGrow: 0};

const OnboardingScreen10 = props => {
  const {
    route: {params: {imageUrls: iU} = {imageUrls: []}},
  } = props;

  const [imageUrls, setImageUrls] = useState(iU);
  const [data, setData] = useState({imageUrls: iU});
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);

  const deleteImage = useCallback(
    url => () => {
      __DEV__ && console.debug('Deleting', url);

      const key = url.split('/public/').pop();

      const s3 = new AWS.S3();
      s3.deleteObject(
        {
          Bucket: 'pics175634-dev',
          Key: `public/${key}`,
        },
        e => {
          if (e) {
            console.error('An error occurred with the delete operation.', e);
          } else {
            setImageUrls(prevUrls => prevUrls.filter(u => u !== url));
          }
        },
      );
    },
    [],
  );

  const getURL = useCallback(uri => ({uri}), []);

  const keyExtractor = useCallback(uri => uri, []);

  const renderItem = useCallback(
    ({item: uri}) => {
      return (
        <Container color="#194CC3" width="50%" height={100}>
          <Container top="top-5" zIndex={500} onPress={deleteImage(uri)}>
            <Image src={deleteIcon} width={20} height={20} />
          </Container>

          <Whitespace marginTop={-20} />

          <Image src={getURL(uri)} width="100%" height="100%" mode="cover" />
        </Container>
      );
    },
    [deleteImage, getURL],
  );

  const upload = useCallback(async images => {
    setImageUrls([]);
    setTotal(images.length);

    const s3 = new AWS.S3();
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
        return new Promise(resolve => {
          s3.upload(
            {
              Bucket: 'pics175634-dev',
              Key: `public/${name}`,
              Body: rawFile,
              ContentType: 'image/jpeg',
            },
            (e, _data) => {
              if (e) {
                console.error('An error occurred with the upload.', e);
                return resolve('');
              }

              setProgress(prev => prev + 1);
              resolve(_data.Location || '');
            },
          );
        });
      }),
    );

    setImageUrls(newUrls.filter(url => !!url).map(url => url));
    setTimeout(() => setProgress(0), 3000);
  }, []);

  const openCamera = useCallback(() => {
    setProgress(0);

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
    setProgress(0);

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

  return (
    <Base
      index={10}
      total={12}
      isComplete={data.imageUrls && data.imageUrls.length > 0}
      data={data}
      inline>
      <View style={containerStyle}>
        <Typography height={30} type="heading" size={26} color="#1F2D3D" width="100%">
          Let&apos;s add pictures of your home.
        </Typography>

        <Whitespace marginTop={69} />

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

        {imageUrls.length > 0 ? (
          <FlatList
            persistentScrollbar
            data={imageUrls}
            style={flatListStyle}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={2}
          />
        ) : progress ? (
          <>
            <Whitespace marginTop={20} />

            <Typography center height={30} width="100%" color="#1F2D3D" size={22} weight="700">
              Uploading your photos of your home
            </Typography>

            <Whitespace marginTop={27} />

            <Typography center width="90%" color="#727272" size={14} weight="700">
              {progress} of {total} uploaded
            </Typography>
          </>
        ) : null}
      </View>
    </Base>
  );
};

export default OnboardingScreen10;
