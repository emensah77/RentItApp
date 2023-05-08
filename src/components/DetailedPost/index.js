import React, {useEffect, useContext, useState, useRef, useCallback, useMemo} from 'react';
import {
  View,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Text,
  ScrollView,
  Platform,
  Linking,
  Pressable,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faUtensils,
  faFan,
  faFaucet,
  faBath,
  faBed,
  faToilet,
  faCalendar,
  faHandshake,
  faCheckCircle,
  faCouch,
  faShieldAlt,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import firebase from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {API, graphqlOperation} from 'aws-amplify';
import moment from 'moment/moment';
import Video from 'react-native-video';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import styles from './styles';

import StarRating from '../StarRating/index';
import ImageCarousel from '../ImageCarousel';

import {AuthContext} from '../../navigation/AuthProvider';
import mixpanel from '../../MixpanelConfig';
import {deletePost} from '../../graphql/mutations';
import useWishlist from '../../hooks/useWishlist';
import CardCommentPhoto from '../../screens/Reviews/ReviewCard/CardCommentPhoto';

const DetailedPost = props => {
  const {post} = props;
  // const [post, setPost] = useState(props.post);
  const navigation = useNavigation();
  const {user} = useContext(AuthContext);
  const {checkIsFav, handleChangeFavorite} = useWishlist();
  // const [phoneNumbers, setphones] = useState([]);
  const [usersWithPrivileges, setUsersWithPrivileges] = useState([]);
  // const [value, setValue] = useState('');
  // const [title, setTitle] = useState('');
  // const [description, setDescription] = useState('');
  const [similarHomes, setSimilarHomes] = useState([]);
  // const [totalItems, setTotalItems] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [videoLoading, setVideoLoading] = useState(true);

  const showDetailsModal = useCallback(() => {
    setIsDetailsModalVisible(true);
  }, []);

  const hideDetailsModal = useCallback(() => {
    setIsDetailsModalVisible(false);
  }, []);

  const showDatePicker = useCallback(() => {
    setIsDatePickerVisible(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setIsDatePickerVisible(false);
  }, []);

  const handleConfirm = useCallback(
    async date => {
      setIsDatePickerVisible(false);
      setIsScheduling(true);

      const data = {
        postId: `https://rentit.homes/rooms/room/${post.id}`, // replace with the actual post ID
        userName: name,
        userContact: phoneNumber,
        userLocation: location,
        viewingDate: date.toISOString().slice(0, 10),
        viewingTime: date.toISOString().slice(11, 19),
        userId: user.uid,
      };

      try {
        const response = await fetch(
          'https://mhxbfh6thc6jz4pdoitevz4vhq0abvsf.lambda-url.us-east-2.on.aws/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          },
        );

        await response.json();

        if (response.ok) {
          // Success
          setIsDetailsModalVisible(false);
          const formattedDate = new Date(date).toLocaleDateString();
          const formattedTime = new Date(date).toLocaleTimeString();
          Alert.alert(
            'Viewing Scheduled',
            `Your viewing is confirmed for ${formattedDate} at ${formattedTime}.`,
          );
        } else {
          // Error
          const formattedDate = new Date(date).toLocaleDateString();
          const formattedTime = new Date(date).toLocaleTimeString();
          Alert.alert(
            'The home is currently unavailable for viewing',
            `for the selected date ${formattedDate} and ${formattedTime}.`,
          );
          // console.error(result.message);
        }
      } catch (error) {
        // console.error('Error scheduling viewing:', error);
      } finally {
        setIsScheduling(false);
      }
    },
    [location, name, phoneNumber, post.id, user.uid],
  );

  const handleSubmit = useCallback(() => {
    // Handle submit and show date picker
    hideDetailsModal();
    showDatePicker();
  }, [hideDetailsModal, showDatePicker]);

  const toggleShowMore = useCallback(() => {
    setShowMore(!showMore);
  }, [showMore]);

  const toggleDescription = useCallback(() => {
    setShowFullDescription(!showFullDescription);
  }, [showFullDescription]);

  const handleProgress = useCallback(progress => {
    setPlaybackTime(progress.currentTime);
  }, []);

  const handleLoad = useCallback(meta => {
    setVideoDuration(meta.duration);
    setVideoLoading(false);
  }, []);

  // const handlePlaybackStatusUpdate = playbackStatus => {
  //   if (playbackStatus.isPlaying) {
  //     // Track the video view event
  //     mixpanel.track('Video Viewed', {
  //       'Home ID': post.id,
  //       'Home VideoURL': post.videoURL,
  //     });
  //     playStartPosition.current = playbackStatus.positionMillis;
  //   } else if (playbackStatus.didJustFinish) {
  //     const playDurationSeconds =
  //       (playbackStatus.positionMillis - playStartPosition.current) / 1000;
  //     mixpanel.track('Video Played Duration', {
  //       'Home ID': post.id,
  //       'Home VideoURL': post.videoURL,
  //       'Video PlayDuration': playDurationSeconds,
  //     });
  //   }
  // };
  const onError = useCallback(error => console.error('Error playing video:', error), []);

  const closeFullScreen = useCallback(() => setFullscreen(false), []);

  const openFullScreen = useCallback(() => setFullscreen(true), []);

  const logAnalyticsEvent = useCallback(async () => {
    await analytics().logEvent('calltorent', {
      id: user.displayName,
      item: user.phoneNumber,
      description: 'Clicked on the call to rent button',
    });
  }, [user.displayName, user.phoneNumber]);

  const getPhoneNumbers = useCallback(async () => {
    const callers = await firebase.firestore().collection('callers');
    callers.get().then(querySnapshot => {
      querySnapshot.forEach((/* doc */) => {
        // setphones(prev => [...prev, doc.data().number]);
      });

      // console.log('phoneNumbers',phoneNumbers)
    });
  }, []);

  const getUsersWithPrivileges = useCallback(async () => {
    const callers = await firebase.firestore().collection('usersWithPrivileges');
    callers.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        setUsersWithPrivileges(prev => [...prev, doc.data().userId]);
      });

      // console.log('phoneNumbers',phoneNumbers)
    });
  }, []);

  useEffect(() => {
    mixpanel.track(
      'Video Play Time',

      {
        homeID: post.id,
        videoUrl: post.videoUrl,
        playbackTime,
        videoDuration,
      },
    );
  }, [playbackTime, post.id, post.videoUrl, videoDuration]);

  useEffect(() => {
    mixpanel.track('Property Viewed', {
      propertyId: post.id,
      propertyTitle: post.title,
      propertyType: post.type,
      price: post.newPrice,
      locality: post.locality,
    });

    async function getRecommendedHomes() {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://fwftielmqvccpnbbna45skokwe0fgeyk.lambda-url.us-east-2.on.aws/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              newPrice: post.newPrice,
              bed: post.bedroom,
              locality: post.locality,
              kitchen: post.kitchen,
              aircondition: post.aircondition,
              water: post.water,
              wifi: post.wifi,
              latitude: post.latitude,
              longitude: post.longitude,
              bathroom: post.bathroom,
              mode: post.mode,
              type: post.type,
              id: post.id,
            }),
          },
        );
        const data = await response.json();
        setSimilarHomes(data);
        // setTotalItems(data.totalItems);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    }
    getRecommendedHomes();
    getPhoneNumbers();
    getUsersWithPrivileges();
  }, [getPhoneNumbers, getUsersWithPrivileges, post]);

  const payRent = useCallback(() => {
    navigation.navigate('Address', {
      post,
      price: Math.round(post.newPrice * 1.07),
      homeimage: post.image,
      hometitle: post.title,
      homebed: post.bed,
      homelatitude: post.latitude,
      homelongitude: post.longitude,
      postid: post.id,
    });
  }, [navigation, post]);

  const makeCall = useCallback(
    number => () => {
      let _phoneNumber = number;
      // console.log('rand',phoneNumber, phoneNumbers)
      if (Platform.OS === 'android') {
        _phoneNumber = `tel:${_phoneNumber}`;
      } else {
        _phoneNumber = `telprompt:${_phoneNumber}`;
      }
      try {
        Linking.openURL(_phoneNumber);
      } catch (e) {
        // console.log(e)
      }
    },
    [],
  );

  // const updateHome = async id => {
  //   try {
  //     const input = {
  //       id,
  //       title,
  //       description,
  //       newPrice: value,
  //     };
  //     const deletedTodo = await API.graphql(
  //       graphqlOperation(updatePost, {
  //         input,
  //       }),
  //     );
  //     console.log('Succesfully updated the home');
  //     setmodalvisible(false);
  //   } catch (e) {
  //     console.log('Error updating home', e);
  //   }
  // };

  const deleteFromFavorites = useCallback(async id => {
    const ref = firestore().collection('posts');
    ref
      .where('id', '==', id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          firestore()
            .collection('posts')
            .doc(doc.id)
            .delete()
            .then(() => {
              console.debug('Deleted from favorite posts!');
            });
        });
      });
  }, []);

  const deleteFromTrends = useCallback(async id => {
    await firestore().collection('trends').doc(id).delete();
  }, []);

  const payToRent = useCallback(() => {
    payRent();
    logAnalyticsEvent();
  }, [logAnalyticsEvent, payRent]);

  const deleteHome = useCallback(async id => {
    try {
      const input = {
        id,
      };
      const deletedTodo = await API.graphql(
        graphqlOperation(deletePost, {
          input,
        }),
      );
      console.debug('Succesfully deleted the post', deletedTodo);
    } catch (e) {
      console.error('Error deleting post', e);
    }
  }, []);

  const deleteListing = useCallback(
    async id => {
      deleteHome(id);
      deleteFromTrends(id);
      deleteFromFavorites(id);
    },
    [deleteFromFavorites, deleteFromTrends, deleteHome],
  );

  // const sendWhatsApp = () => {
  //   mixpanel.track('User Home Interest', {
  //     propertyId: post.id,
  //     propertyTitle: post.title,
  //     propertyType: post.type,
  //     price: post.newPrice,
  //     locality: post.locality,
  //     url: `https://rentit.homes/rooms/room/${post.id}`,
  //   });

  //   const msg =
  //     'I am interested in this home ' +
  //     `https://rentit.homes/rooms/room/${post.id}` +
  //     ' ' +
  //     `${post.title}` +
  //     ' which is located in ' +
  //     `${post.locality}` +
  //     ' , ' +
  //     `${post.sublocality}` +
  //     ' and the price is ' +
  //     `${Math.round((post.newPrice / 12) * 1.07)}` +
  //     ' per month';

  //   const phoneWithCountryCode = `+233${
  //     phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)]
  //   }`;

  //   const mobile = Platform.OS == 'ios' ? phoneWithCountryCode : `+${phoneWithCountryCode}`;
  //   if (mobile) {
  //     if (msg) {
  //       const url = `whatsapp://send?text=${msg}&phone=${mobile}`;
  //       Linking.openURL(url)
  //         .then(data => {
  //           console.debug('WhatsApp Opened', data);
  //         })
  //         .catch(() => {
  //           alert('Make sure WhatsApp installed on your device');
  //         });
  //     } else {
  //       alert('Please insert message to send');
  //     }
  //   } else {
  //     alert('Please insert mobile no');
  //   }
  // };
  const onPress = useCallback(
    item => {
      // console.log('pressed', item.id);
      navigation.navigate('Home');
      setTimeout(() => {
        navigation.navigate('Post', {postId: item.id});
      }, 1); // Wait for 1 second before navigating to Post screen
    },
    [navigation],
  );

  const onChangeFavorite = useCallback(
    _post => handleChangeFavorite(_post),
    [handleChangeFavorite],
  );

  const trash = useCallback(() => {
    Alert.alert(
      'Are you sure you want to delete?',
      'This is irreversible and cannot be undone',
      [
        {
          text: 'OK',
          onPress: () => {
            deleteListing(post.id);
            navigation.goBack();
          },
        },
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
    );
  }, [deleteListing, navigation, post.id]);

  const goToFeedback = useCallback(
    () => navigation.navigate('Feedback', {postID: post?.id, user}),
    [navigation, post?.id, user],
  );

  const onStartShouldSetResponder = useCallback(() => true, []);

  const renderItem = useCallback(
    ({item}) => {
      const monthlyPrice = item.newPrice ? Math.floor((item.newPrice * 1.07) / 12) : 0;
      let currency;
      if (item.currency) {
        if (item.currency[0] === 'usd') {
          currency = '$';
        } else if (item.currency[0] === 'ghs') {
          currency = 'GH₵';
        } else {
          currency = 'GH₵';
        }
      } else {
        currency = 'GH₵';
      }

      return (
        <Pressable onPress={onPress} style={styles.itemContainer}>
          <View style={styles.imageContainer}>
            <Image source={{uri: item.image}} style={styles.image} />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.location}>
              {item.locality},{item.sublocality}
            </Text>
            <Text style={styles.price}>
              {currency} {monthlyPrice} / month
            </Text>
          </View>
        </Pressable>
      );
    },
    [onPress],
  );

  const keyExtractor = useCallback(item => item.id, []);

  const userWithPrivilegeExists = useMemo(
    () => usersWithPrivileges.includes(user.uid),
    [user.uid, usersWithPrivileges],
  );

  return (
    <View style={styles.parentContainer}>
      {isScheduling && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="blue" />
          <Text style={styles.loadingText}>Scheduling viewing...</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image */}
        <StatusBar hidden />

        <ImageCarousel
          postId={post.id}
          images={post.images}
          isFav={checkIsFav(post.id)}
          handleChangeFavorite={onChangeFavorite}
        />

        <View style={styles.container}>
          {/* Bed and Bedroom */}
          <View style={styles.viewContainer}>
            <Text style={styles.description} numberOfLines={2}>
              {post.title}
            </Text>
            {userWithPrivilegeExists ? (
              <TouchableOpacity onPress={trash}>
                <Fontisto name="trash" size={25} color="blue" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View>
              <TouchableOpacity
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => navigation.navigate('Reviews')}>
                <StarRating
                  disabled={true}
                  starSize={13}
                  maxStars={5}
                  rating={4}
                  fullStarColor={'orange'}
                  on
                />
                <Text footnote grayColor style={{marginLeft: 5}}>
                  (2) reviews
                </Text>
              </TouchableOpacity>
            </View>
          </View> */}

          <View style={styles.hairline} />
          <Text style={styles.bedrooms}>
            {post.type} |{post.bedroom} bedrooms |{post.bathroomNumber} bathrooms |
          </Text>

          <View style={styles.viewingContainer}>
            <View style={styles.flexColumn}>
              {/*
              <Pressable
                onPress={sendWhatsApp}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 5,
                  padding: 10,
                  backgroundColor: "limegreen",
                  marginVertical: 5,
                  justifyContent: "space-evenly",
                }}
              >
                <Fontisto name="whatsapp" size={20} />
                <Text>Chat to Rent</Text>
              </Pressable>
              */}

              <View style={styles.container1}>
                <Pressable onPress={showDetailsModal} style={styles.scheduleButton}>
                  <FontAwesomeIcon icon={faCalendar} size={20} color="white" />
                  <Text style={styles.viewingText}>Schedule Viewing</Text>
                </Pressable>

                <Modal
                  visible={isDetailsModalVisible}
                  transparent
                  onRequestClose={hideDetailsModal}>
                  <Pressable onPress={hideDetailsModal} style={styles.modalOverlay}>
                    <View
                      onStartShouldSetResponder={onStartShouldSetResponder}
                      style={styles.modal}>
                      <Text style={styles.modalTitle}>Enter your details. </Text>
                      <Text style={styles.font14}>
                        {' '}
                        Click next and choose date and time to confirm Viewing
                      </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={setName}
                        value={name}
                        placeholder="Name"
                      />
                      <TextInput
                        style={styles.input}
                        onChangeText={setPhoneNumber}
                        value={phoneNumber}
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                      />
                      <TextInput
                        style={styles.input}
                        onChangeText={setLocation}
                        value={location}
                        placeholder="Location"
                      />
                      <Pressable
                        opacity={!name || !phoneNumber || !location ? 0.5 : 1}
                        disabled={!name || !phoneNumber || !location}
                        onPress={handleSubmit}
                        style={styles.submitButton}>
                        <Text style={styles.submitText}>Next</Text>
                      </Pressable>
                    </View>
                  </Pressable>
                </Modal>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="datetime"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                  minimumDate={new Date(Date.now())}
                  maximumDate={new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)} // Six months from now
                />
              </View>

              {userWithPrivilegeExists && (
                <>
                  <Pressable onPress={makeCall(post.phoneNumbers)} style={styles.callOwner}>
                    <Fontisto name="phone" size={15} style={styles.phoneIcon} />
                    <Text style={styles.white}>Call Homeowner</Text>
                  </Pressable>

                  <Pressable onPress={makeCall(post.marketerNumber)} style={styles.callMarketer}>
                    <Fontisto name="phone" size={15} style={styles.phoneIcon} />
                    <Text style={styles.black}>Call Marketer</Text>
                  </Pressable>
                </>
              )}
            </View>
            <View style={styles.marginLeft10}>
              {post.videoUrl && (
                <>
                  {!fullscreen && (
                    <TouchableOpacity onPress={openFullScreen}>
                      <View style={styles.videoWrapper}>
                        <Video
                          ref={videoRef}
                          source={{uri: post.videoUrl}}
                          style={styles.video}
                          resizeMode="contain"
                          repeat
                          onProgress={handleProgress}
                          onLoad={handleLoad}
                          onError={onError}
                        />
                        {videoLoading && (
                          <ActivityIndicator
                            size="large"
                            color="white"
                            style={styles.loadingIndicator}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  )}

                  <Modal
                    animationType="fade"
                    transparent
                    visible={fullscreen}
                    onRequestClose={closeFullScreen}>
                    <View style={styles.modalContainer}>
                      <TouchableOpacity onPress={closeFullScreen}>
                        <Video
                          ref={videoRef}
                          source={{uri: post.videoUrl}}
                          style={styles.fullscreenVideo}
                          resizeMode="cover"
                          repeat
                          onProgress={handleProgress}
                          onLoad={handleLoad}
                          onError={onError}
                        />
                        {videoLoading && (
                          <ActivityIndicator
                            size="large"
                            color="white"
                            style={styles.loadingIndicator}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  </Modal>
                </>
              )}
            </View>
          </View>

          {/* Type and Description */}

          {/* Old and new Price */}
          <View style={styles.hairline} />

          {/* Total price */}
          {/* <Text style={styles.totalPrice}>
                GH₵{post.totalPrice}
                </Text> */}
          <View style={styles.paddingBottom20}>
            <SkeletonContent
              containerStyle={styles.flexRow}
              isLoading={isLoading}
              layout={[
                {
                  key: 'item1',
                  width: 150,
                  height: 150,
                  borderRadius: 10,
                  marginRight: 10,
                },
                {
                  key: 'item2',
                  width: 150,
                  height: 150,
                  borderRadius: 10,
                  marginRight: 10,
                },
                {
                  key: 'item3',
                  width: 150,
                  height: 150,
                  borderRadius: 10,
                  marginRight: 10,
                },
                {
                  key: 'item4',
                  width: 150,
                  height: 150,
                  borderRadius: 10,
                  marginRight: 10,
                },
                {
                  key: 'item5',
                  width: 150,
                  height: 150,
                  borderRadius: 10,
                  marginRight: 10,
                },
              ]}>
              {similarHomes.length > 0 ? (
                <View>
                  <View>
                    <Text style={styles.homesYouMayLike}>Homes you may like</Text>
                  </View>
                  <View style={styles.similarHomes}>
                    <FlatList
                      data={similarHomes}
                      renderItem={renderItem}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={keyExtractor}
                    />
                  </View>
                </View>
              ) : null}
            </SkeletonContent>
            <View style={styles.hairline} />
          </View>

          <Text style={styles.longDescription}>
            {showFullDescription ? post.description : `${post.description.slice(0, 60)}...`}
          </Text>
          <TouchableOpacity style={styles.showToggle} onPress={toggleDescription}>
            <Text style={styles.showText}>{showFullDescription ? 'Show Less' : 'Show More'}</Text>
          </TouchableOpacity>
          <View style={styles.hairline} />

          <View style={styles.innerContainer}>
            <View style={styles.heading}>
              <FontAwesomeIcon icon={faShieldAlt} size={30} color="blue" />
              <View style={styles.marginLeft}>
                <Text style={styles.labelText}>
                  <Text style={styles.rentItText}>RentIt</Text>
                  <Text style={styles.guaranteeText}>Guarantee</Text>
                </Text>
                <Text style={styles.bookingText}>
                  Every booking on RentIt comes with RentItGuarantee, if you don&apos;t like the
                  property you get your money back.
                  {showMore ? (
                    <>
                      {'\n\n'}
                      <Text style={styles.boldFont}>What&pos;s included?</Text>
                      {'\n\n'}
                      Book with confidence: Our guarantee program gives you the option of getting a
                      refund if you&pos;re not satisfied with the property you booked, or if the
                      property doesn&pos;t meet your expectations.
                      {'\n'}
                      {'\n\n'}
                      Protection against scams: You can trust that the properties listed on our
                      platform are legitimate and not fraudulent listings.
                      {'\n'}
                    </>
                  ) : null}
                </Text>
                <TouchableOpacity onPress={toggleShowMore} style={styles.marginTop8}>
                  <Text style={styles.showTextLabel}>{showMore ? 'Show less' : 'Show more'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {post.furnished ? (
              <View style={styles.furnished}>
                <FontAwesomeIcon icon={faCouch} size={30} color="blue" />
                <View style={styles.marginLeft12}>
                  <Text style={styles.furnishedText}>Furnished</Text>
                  <Text style={styles.furnishedTextDesc}>
                    This property comes with furniture included.
                  </Text>
                </View>
              </View>
            ) : null}
            {post.negotiable ? (
              <View style={styles.negotiable}>
                <FontAwesomeIcon icon={faHandshake} size={30} color="blue" />
                <View style={styles.marginLeft12}>
                  <Text style={styles.negotiableText}>Negotiable</Text>
                  <Text style={styles.negotiableTextDesc}>
                    The price of this property is open to negotiation with the owner.
                  </Text>
                </View>
              </View>
            ) : null}
            {/* {post.loyaltyProgram ? (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
      <FontAwesomeIcon icon={faStar} size={30} color="blue" />
      <View style={{ marginLeft: 12 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Loyalty Program</Text>
        <Text style={{ marginTop: 4, fontSize: 12, color: '#555', maxWidth:"90%" }}>This property is part of a loyalty program where tenants can earn rewards and discounts.</Text>
      </View>
    </View>
  ) : null} */}
            {post.verified ? (
              <View style={styles.verified}>
                <FontAwesomeIcon icon={faCheckCircle} size={30} color="blue" />
                <View style={styles.marginLeft12}>
                  <Text style={styles.verifiedText}>Verified</Text>
                  <Text style={styles.verifiedTextLabel}>
                    This property has been verified by our team to ensure its authenticity and
                    quality.
                  </Text>
                </View>
              </View>
            ) : null}
          </View>

          <View style={styles.hairline} />
          <Text style={styles.amenitiesAvailable}>Amenities available</Text>
          <View style={styles.amenitiesTheContainer}>
            {post.aircondition === 'Yes' ? (
              <View style={styles.card}>
                <View style={styles.cardItem}>
                  <FontAwesomeIcon icon={faFan} size={25} color="blue" />
                  <Text style={styles.cardText}>Air Conditioner</Text>
                </View>
              </View>
            ) : null}
            {post.wifi === 'Yes' ? (
              <View style={styles.card}>
                <View style={styles.cardItem}>
                  <Feather name="wifi" size={25} color="blue" />
                  <Text style={styles.cardText}>Wifi</Text>
                </View>
              </View>
            ) : null}
            {post.kitchen === 'Yes' ? (
              <View style={styles.card}>
                <View style={styles.cardItem}>
                  <FontAwesomeIcon icon={faUtensils} color="blue" />
                  <Text style={styles.cardText}>Kitchen</Text>
                </View>
              </View>
            ) : null}
            {post.bathroom === 'Yes' ? (
              <View style={styles.card}>
                <View style={styles.cardItem}>
                  <FontAwesomeIcon icon={faBath} size={25} color="blue" />
                  <Text style={styles.cardText}>Bathroom</Text>
                </View>
              </View>
            ) : null}
            {post.bed === 'Yes' ? (
              <View style={styles.card}>
                <View style={styles.cardItem}>
                  <FontAwesomeIcon icon={faBed} size={25} color="blue" />
                  <Text style={styles.cardText}>Bedroom</Text>
                </View>
              </View>
            ) : null}
            {post.water === 'Yes' ? (
              <View style={styles.card}>
                <View style={styles.cardItem}>
                  <FontAwesomeIcon icon={faFaucet} size={25} color="blue" />
                  <Text style={styles.cardText}>Water</Text>
                </View>
              </View>
            ) : null}
            {post.toilet === 'Yes' ? (
              <View style={styles.card}>
                <View style={styles.cardItem}>
                  <FontAwesomeIcon icon={faToilet} size={25} color="blue" />
                  <Text style={styles.cardText}>Toilet</Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.hairline} />
        {/* here i made changes */}

        <View style={styles.paddingHorizontal20}>
          <View style={styles.flexCenter}>
            <View>
              <TouchableOpacity
                style={styles.reviewCounter}
                // onPress={() => navigation.navigate('Reviews')}
              >
                <StarRating
                  disabled
                  starSize={13}
                  maxStars={5}
                  rating={
                    post?.reviews?.items?.reduce((acc, val) => acc + val.rating, 0) /
                      post?.reviews?.items?.length || 0
                  }
                  fullStarColor="orange"
                />
                <Text footnote grayColor style={styles.marginLeft5}>
                  ({post?.reviews?.items?.length}) reviews
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <View style={styles.paddingTop20}>
                <TouchableOpacity style={styles.flexRowCenter} onPress={goToFeedback}>
                  <FontAwesomeIcon icon={faPlusCircle} size={18} color="blue" />
                  <Text style={styles.writeAReview}>Write a review</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.flex}>
            {post?.reviews?.items?.length !== 0 ? (
              post?.reviews?.items
                ?.sort((a, b) => a.createdAt - b.createdAt)
                ?.map(review => (
                  <View key={review.id}>
                    {!review?.parentReviewId && (
                      <CardCommentPhoto
                        style={styles.cardPhotoPink}
                        rate={review.rating}
                        date={moment(review.createdAt).format('D MMM YYYY')}
                        comment={review.review}
                        userID={review.userID}
                      />
                    )}
                    {post?.reviews?.items?.map(
                      rep =>
                        rep.parentReviewId === review.id && (
                          <>
                            <CardCommentPhoto
                              style={styles.cardPhotoGrey}
                              rate={rep.rating}
                              date={moment(rep.createdAt).format('D MMM YYYY')}
                              comment={rep.review}
                              userID={rep.userID}
                              hasReply
                            />
                          </>
                        ),
                    )}
                  </View>
                ))
            ) : (
              <Text style={styles.grayColor}>No Review yet</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.pricesOfHome}>
        <View>
          {post.mode === 'For Sale' ? (
            <Text style={styles.forSale}>
              {post.currency === null ? 'GH₵' : post.currency[0] === 'usd' ? '$' : 'GH₵'}
              {Math.round(post.newPrice * 1.07)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              {'\n'}
            </Text>
          ) : (
            <Text style={styles.currencyPerPeriod}>
              {post.currency === null ? 'GH₵' : post.currency[0] === 'usd' ? '$' : 'GH₵'}
              {Math.round((post.newPrice * 1.07) / 12)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              {'\n'} / month
            </Text>
          )}
        </View>
        <View style={styles.payToRentContainer}>
          <Pressable style={styles.payToRentPressable} onPress={payToRent}>
            {/* <Fontisto name="credit-card" size={25} style={{color: 'white' , margin: 10 ,}} /> */}
            <Text style={styles.payToRent}>Pay to Rent</Text>
          </Pressable>
          {/* <Pressable
                title="Call to Rent Event"

                style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginBottom: 20,
                    backgroundColor: 'blue',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '50%',
                    width:'80%',
                    marginHorizontal: 20,
                    borderRadius: 5,
                    justifyContent: 'center'
                }}  onPress={() => {
                    makeCall();
                    logAnalyticsEvent();
                }}>
                    <Fontisto name="phone" size={25} style={{color: 'white' , margin: 10 ,transform: [{ rotate: '90deg' }]}} />
                    <Text style={{
                        fontSize: 20,
                        color: 'white',
                        fontWeight: 'bold',
                    }}>Call to Rent</Text>
                </Pressable> */}
        </View>
      </View>
    </View>
  );
};

export default DetailedPost;
