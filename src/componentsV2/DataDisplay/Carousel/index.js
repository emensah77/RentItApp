import React, {useCallback, useState} from 'react';
import {Dimensions, FlatList, Share, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

import {colors, offsets} from '../../../styles/globalStyles';
import {styles} from './styles';

import CircleButton from '../../Inputs/CircleButton';
import Typography from '../Typography';

const Carousel = ({postId, images, onFavorite}) => {
  const navigation = useNavigation();

  const [activeIndex, setActiveIndex] = useState(0);

  const onFlatListUpdate = useCallback(({viewableItems}) => {
    if (viewableItems?.length > 0) {
      setActiveIndex(viewableItems?.[0]?.index || 0);
    }
  }, []);

  const renderItem = useCallback(({item}) => {
    if (!item) {
      return <></>;
    }

    return (
      <FastImage
        style={styles.image}
        source={{
          uri: item,
          headers: {Authorization: 'token'},
          priority: FastImage.priority.high,
        }}
      />
    );
  }, []);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const onShare = useCallback(async () => {
    try {
      await Share.share({
        title: 'Check this home on RentIt',
        message: `https://rentit.homes/rooms/room/${postId}`,
      });
    } catch (e) {
      alert(error.message);
    }
  }, []);

  return (
    <View>
      <FlatList
        data={images?.filter(image => !!image)}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={Dimensions.get('screen').width}
        snapToAlignment="center"
        decelerationRate="fast"
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 50,
        }}
        onViewableItemsChanged={onFlatListUpdate}
      />
      <CircleButton
        onPress={goBack}
        style={{position: 'absolute', top: offsets.offsetA, left: offsets.offsetA}}
      />
      <CircleButton
        onPress={onFavorite}
        style={{position: 'absolute', top: offsets.offsetA, right: offsets.offsetA}}
      />
      <CircleButton
        onPress={onShare}
        style={{
          top: offsets.offsetA,
          position: 'absolute',
          right: wp(10.6) + offsets.offsetA * 2,
        }}
      />
      <View style={styles.counter}>
        <Typography variant="small" style={{color: colors.secondary}} bold>
          {activeIndex + 1}/{images?.length}
        </Typography>
      </View>
    </View>
  );
};

export default Carousel;
