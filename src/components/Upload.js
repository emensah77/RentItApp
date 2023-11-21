import React, {useCallback, useState, useEffect} from 'react';
import {Platform, FlatList} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import uuid from 'react-native-uuid';
import AWS from 'aws-sdk';

import Container from './Container';
import CardDisplay from './CardDisplay';
import Typography from './Typography';
import Whitespace from './Whitespace';
import Image from './Image';

import deleteIcon from '../assets/images/delete.png';
import cameraIcon from '../assets/images/camera.png';
import add from '../assets/images/add.png';

import * as Utils from '../utils';

const flatListStyle = {height: 200, flexGrow: 0};

const Upload = props => {
  const {
    picker = true,
    camera = true,
    imageNamePrefix,
    getImages,
    noFlatlist,
    initialImages = [],
  } = props;

  if (!imageNamePrefix) {
    throw new Error('<Upload /> cannot be used without the `imageNamePrefix` prop.');
  }

  const [urls, setUrls] = useState(initialImages);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);

  const deleteImage = useCallback(
    url => () => {
      __DEV__ && console.debug('Deleting Image:', url);

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
            const validUrls = urls.filter(u => u !== url);
            setUrls(validUrls);
            getImages(validUrls);
          }
        },
      );
    },
    [getImages, urls],
  );

  const getURL = useCallback(uri => ({uri}), []);

  const keyExtractor = useCallback(uri => uri, []);

  const renderItem = useCallback(
    ({item: uri}) => {
      return (
        <Container key={uri} color="#194CC3" width="50%" height={100}>
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

  const upload = useCallback(
    async images => {
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
          const rawFile = await Utils.getBlob(path);

          const name = `${imageNamePrefix}-${uuid.v4()}`;
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

      const validUrls = [...urls, ...newUrls.filter(url => !!url)];
      setUrls(validUrls);
      getImages(validUrls);
      setTimeout(() => setProgress(0), 3000);
    },
    [imageNamePrefix, getImages, urls],
  );

  const openPicker = useCallback(() => {
    setProgress(0);
    ImagePicker.openPicker({
      width: 1024,
      height: 683,
      multiple: true,
      maxFiles: 5,
      mediaType: 'photo',
    })
      .then(selectedImages => {
        upload(selectedImages);
      })
      .catch(e =>
        console.error(
          'An error occurred within the open picker function while attempting to upload',
          e,
        ),
      );
  }, [upload]);

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

  useEffect(() => {
    if (initialImages.length > 0) {
      setUrls(initialImages);
    }
  }, [initialImages]);

  return (
    <>
      {picker && (
        <Container center type="chipSmall" color="#FFF" height={50} onPress={openPicker}>
          <CardDisplay
            leftImageWidth={20}
            leftImageHeight={20}
            leftImageSrc={add}
            name={
              <Typography type="notice" left width="100%">
                Add more photos
              </Typography>
            }
            center
            bold
            onPress={openPicker}
          />
        </Container>
      )}

      <Whitespace marginTop={22} />

      {camera && (
        <Container center type="chipSmall" color="#FFF" height={50} onPress={openCamera}>
          <CardDisplay
            leftImageWidth={20}
            leftImageHeight={20}
            leftImageSrc={cameraIcon}
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
      )}

      <Whitespace marginTop={22} />

      {urls.length > 0 &&
        (noFlatlist ? (
          <Container type="rowWrap" width="100%">
            {urls.map(item => renderItem({item}))}
          </Container>
        ) : (
          <FlatList
            persistentScrollbar
            data={urls}
            style={flatListStyle}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={2}
          />
        ))}

      {progress > 0 && (
        <>
          <Whitespace marginTop={20} />

          <Typography center height={30} width="100%" color="#1F2D3D" size={22} weight="700">
            Uploading photos
          </Typography>

          <Whitespace marginTop={27} />

          <Typography center width="90%" color="#727272" size={14} weight="700">
            {progress} of {total} uploaded
          </Typography>
        </>
      )}
    </>
  );
};
export default Upload;
