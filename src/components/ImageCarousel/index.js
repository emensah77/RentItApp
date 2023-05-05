import {faShare} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Fontisto from 'react-native-vector-icons/Fontisto';

const ImageCarousel = ({images, postId, isFav, handleChangeFavorite}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();

  const onFlatlistUpdate = useCallback(({viewableItems}) => {
    if (viewableItems?.length > 0) {
      setActiveIndex(viewableItems?.[0]?.index || 0);
    }
  }, []);

  const onShare = useCallback(async () => {
    try {
      const result = await Share.share({
        title: 'Check this home on RentIt',
        message: `https://rentit.homes/rooms/room/${postId}`,
        // message: `rentit://post/${postId}`
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }, [postId]);

  const renderItem = useCallback(
    ({item}) => (
      <FastImage
        style={styles.image}
        source={{
          uri: item,
          headers: {Authorization: 'token'},
          priority: FastImage.priority.high,
        }}
      />
    ),
    [],
  );

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.root}>
      <FlatList
        data={images}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={Dimensions.get('screen').width}
        snapToAlignment="center"
        decelerationRate="fast"
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 50,
        }}
        onViewableItemsChanged={onFlatlistUpdate}
      />
      <Pressable style={styles.leftArrowButton} onPress={goBack}>
        <Fontisto name="angle-left" size={15} style={styles.leftArrowIcon} />
      </Pressable>
      <Pressable style={styles.heartButton} onPress={handleChangeFavorite}>
        <Fontisto name="heart" size={15} color={isFav ? 'deeppink' : 'black'} />
      </Pressable>
      <Pressable style={styles.shareButton} onPress={onShare}>
        <FontAwesomeIcon icon={faShare} size={15} />
      </Pressable>
      <View style={styles.countContainer}>
        <Text style={styles.count}>
          {activeIndex + 1}/{images.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {},
  image: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height / 2.5,
    resizeMode: 'cover',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    backgroundColor: 'transparent',
    opacity: 1,
    elevation: 3,
  },
  dot: {
    borderWidth: 1,
    backgroundColor: 'yellow',
    borderColor: 'black',
    margin: 5,
  },
  leftArrowIcon: {
    color: 'black',
  },
  leftArrowButton: {
    margin: 20,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 30 : 0,
    left: 0,
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartButton: {
    margin: 20,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 30 : 0,
    right: 0,
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    margin: 20,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 30 : 0,
    right: 50,
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countContainer: {
    opacity: 0.7,
    marginHorizontal: 20,
    position: 'absolute',
    right: 0,
    bottom: Platform.OS === 'android' ? 25 : 40,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
    width: 60,
  },
  count: {
    margin: 5,
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ImageCarousel;
