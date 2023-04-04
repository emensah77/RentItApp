/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useContext, useState, useRef} from 'react';
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
  RefreshControl,
} from 'react-native';
import styles from './styles.js';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { FlatListSlider } from 'react-native-flatlist-slider';
import { withAuthenticator } from 'aws-amplify-react-native';
import Amplify from '@aws-amplify/core';
import Feather from 'react-native-vector-icons/Feather';
import { FontAwesomeIcon, Icon } from '@fortawesome/react-native-fontawesome';
import {
  faUtensils,
  faFan,
  faPencilAlt,
  faFaucet,
  faBath,
  faBed,
  faToilet,
  faBackward,
  faTimes,
  faChair, 
  faIdBadge, 
  faCalendar, 
  faHandshake,
  faStar,
  faCheckCircle,
  faCouch,
  faShieldAlt

} from '@fortawesome/free-solid-svg-icons';
import firebase from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';
import { useNavigation, useRoute } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import ImageCarousel from '../../components/ImageCarousel';
import { SharedElement } from 'react-navigation-shared-element';
import FastImage from 'react-native-fast-image';
import { AuthContext } from '../../navigation/AuthProvider';
//const uploadusers = ["17Kx04gVyJXkO8kZsIxUxRu4uJw1","Ye7iz2KN5Fbk5Y0Z91IEmzywNPh1","UWHvpJ1XoObsFYTFR48zYe6jscJ2","7WGODlIhvkXGhjpngLXxAnQihTK2", "lvtDmH13IRW1njCJKZyKsO2okKr1", "JleriGZuTqXkAyO3xCiDsey1CCb2"]
import firestore from '@react-native-firebase/firestore';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import mixpanel from '../../MixpanelConfig.js';

import { API, graphqlOperation } from 'aws-amplify';
import { deletePost, updatePost } from '../../graphql/mutations';
import useWishlist from '../../hooks/useWishlist.js';
import StarRating from '../StarRating/index.js';
import CardCommentPhoto from '../../screens/Reviews/ReviewCard/CardCommentPhoto.js';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment/moment.js';
import Video from 'react-native-video';
import DateTimePickerModal from 'react-native-modal-datetime-picker';



const DetailedPost = props => {
  const [post, setPost] = useState(props.post)
  const navigation = useNavigation();
  const route = useRoute();
  const { user, logout } = useContext(AuthContext);
  const { checkIsFav, handleChangeFavorite } = useWishlist();
  const [modalvisible, setmodalvisible] = useState(false);
  const randString = route.params.randString;
  const [phoneNumbers, setphones] = useState([]);
  const [usersWithPrivileges, setUsersWithPrivileges] = useState([]);
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [homeprice, sethomeprice] = useState(1);
  const [similarHomes, setSimilarHomes] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [numHomes, setNumHomes] = useState(10);
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
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [videoLoading, setVideoLoading] = useState(true);


  

  const showDetailsModal = () => {
    setIsDetailsModalVisible(true);
  };

  const hideDetailsModal = () => {
    setIsDetailsModalVisible(false);
  };

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleConfirm = async (date) => {
    setIsDatePickerVisible(false);
    setSelectedDateTime(date);
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
      const response = await fetch('https://mhxbfh6thc6jz4pdoitevz4vhq0abvsf.lambda-url.us-east-2.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Success
        console.log(result.message);
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
        //console.error(result.message);
      }
    } catch (error) {
      
      //console.error('Error scheduling viewing:', error);
    } finally {
      setIsScheduling(false);
    }
    
   
  
  };
  

  const handleSubmit = () => {
    // Handle submit and show date picker
    hideDetailsModal();
    showDatePicker();
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  }


  const loadMore = () => {
    setNumHomes((prevNumHomes) =>
      prevNumHomes + 10 > totalItems
        ? totalItems
        : prevNumHomes + 10
    );
  };
  const handleProgress = (progress) => {
    setPlaybackTime(progress.currentTime);
  };

  const handleLoad = (meta) => {
    setVideoDuration(meta.duration);
    setVideoLoading(false);

  };
  const handlePlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.isPlaying) {
      // Track the video view event
      mixpanel.track('Video Viewed', {
        'Home ID': post.id,
        'Home VideoURL': post.videoURL,
      });
      playStartPosition.current = playbackStatus.positionMillis;
    } else if (playbackStatus.didJustFinish) {
      const playDurationSeconds = (playbackStatus.positionMillis - playStartPosition.current) / 1000;
      mixpanel.track('Video Played Duration', {
        'Home ID': post.id,
        'Home VideoURL': post.videoURL,
        'Video PlayDuration': playDurationSeconds,
      });
    }
  };
  
  
  const loadMoreButton =  (
    <TouchableOpacity onPress={loadMore} style={styles.loadMoreButton}>
      <Text style={styles.loadMoreText}>Load More</Text>
    </TouchableOpacity>
  );

  const logAnalyticsEvent = async () => {
    await analytics().logEvent('calltorent', {
      id: user.displayName,
      item: user.phoneNumber,
      description: 'Clicked on the call to rent button',
    });
  };
  const getPhoneNumbers = async () => {
    const callers = await firebase.firestore().collection('callers');
    callers.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        setphones(prev => [...prev, doc.data().number]);
      });

      //console.log('phoneNumbers',phoneNumbers)
    });
  };
  const hellod1 = text => {
    setValue(parseInt(text));

    sethomeprice(value);
    console.log(value);
  };
  const helloTitle = text => {
    setTitle(text);
    console.log(title);
  };
  const helloDescrip = text => {
    setDescription(text);
    console.log(description);
  };

  const getUsersWithPrivileges = async () => {
    const callers = await firebase
      .firestore()
      .collection('usersWithPrivileges');
    callers.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        setUsersWithPrivileges(prev => [...prev, doc.data().userId]);
      });

      //console.log('phoneNumbers',phoneNumbers)
    });
  };
  useEffect(() => {
    mixpanel.track('Video Play Time',

    { homeID: post.id,
      videoUrl: post.videoUrl,
      playbackTime: playbackTime,
       videoDuration: videoDuration });
  }, [playbackTime]);

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
        const response = await fetch('https://fwftielmqvccpnbbna45skokwe0fgeyk.lambda-url.us-east-2.on.aws/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
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
          })
        });
        const data = await response.json();
        setSimilarHomes(data);
        setTotalItems(data.totalItems);

      } catch (error) {
        console.error(error);
      }
      finally {
        setIsLoading(false); // Set loading state to false
      }
    }
    getRecommendedHomes();
    getPhoneNumbers();
    getUsersWithPrivileges();
    console.log('similar homes', totalItems);
  }, []);
  const payRent = () => {
    navigation.navigate('Address', {
      post: post,
      price: Math.round(post.newPrice * 1.07),
      homeimage: post.image,
      hometitle: post.title,
      homebed: post.bed,
      homelatitude: post.latitude,
      homelongitude: post.longitude,
      postid: post.id,
    });
  };
  const makeCall = number => {
    let phoneNumber = number;
    //console.log('rand',phoneNumber, phoneNumbers)
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phoneNumber}`;
    } else {
      phoneNumber = `telprompt:${phoneNumber}`;
    }
    try {
      Linking.openURL(phoneNumber);
    } catch (e) {
      //console.log(e)
    }
  };
  const updateHome = async id => {
    try {
      let input = {
        id: id,
        title: title,
        description: description,
        newPrice: value,
      };
      const deletedTodo = await API.graphql(
        graphqlOperation(updatePost, {
          input,
        }),
      );
      console.log('Succesfully updated the home');
      setmodalvisible(false);
    } catch (e) {
      console.log('Error updating home', e);
    }
  };


  const deleteFromFavorites = async id => {
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
              console.log('Deleted from favorite posts!');
            });
          //console.log(doc.id);
          //console.log(doc.id, "=>", doc.data());
        });
      });
  };
  const deleteFromTrends = async id => {
    await firestore().collection('trends').doc(id).delete();
  };
  const deleteHome = async id => {
    try {
      let input = {
        id,
      };
      const deletedTodo = await API.graphql(
        graphqlOperation(deletePost, {
          input,
        }),
      );
      console.log('Succesfully deleted the post');
    } catch (e) {
      console.log('Error deleting post', e);
    }
  };

  const deleteListing = async id => {
    deleteHome(id);
    deleteFromTrends(id);
    deleteFromFavorites(id);
  };
  const sendWhatsApp = () => {
    mixpanel.track('User Home Interest', {
      propertyId: post.id,
      propertyTitle: post.title,
      propertyType: post.type,
      price: post.newPrice,
      locality: post.locality,
      url: `https://rentit.homes/rooms/room/${post.id}`,

    });
    let msg =
      'I am interested in this home ' +
      `https://rentit.homes/rooms/room/${post.id}` +
      ' ' +
      `${post.title}` +
      ' which is located in ' +
      `${post.locality}` +
      ' , ' +
      `${post.sublocality}` +
      ' and the price is ' +
      `${Math.round((post.newPrice / 12) * 1.07)}` +
      ' per month';
    let phoneWithCountryCode =
      '+233' + phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
    let mobile =
      Platform.OS == 'ios' ? phoneWithCountryCode : '+' + phoneWithCountryCode;
    if (mobile) {
      if (msg) {
        let url = 'whatsapp://send?text=' + msg + '&phone=' + mobile;
        Linking.openURL(url)
          .then(data => {
            console.log('WhatsApp Opened');
          })
          .catch(() => {
            alert('Make sure WhatsApp installed on your device');
          });
      } else {
        alert('Please insert message to send');
      }
    } else {
      alert('Please insert mobile no');
    }
  };
  const renderItem = ({ item }) => {
    const monthlyPrice = item.newPrice ? Math.floor((item.newPrice * 1.07) / 12) : 0;
    const currency = item.currency
      ? item.currency[0] === 'usd'
        ? '$'
        : item.currency[0] === 'ghs'
          ? 'GH₵'
          : 'GH₵'
      : 'GH₵';

    return (
      <Pressable
        onPress={() => {
          //console.log('pressed', item.id);
          navigation.navigate('Home');
          setTimeout(() => {
            navigation.navigate('Post', { postId: item.id });
          }, 1); // Wait for 1 second before navigating to Post screen

        }}
        style={styles.itemContainer}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.location}>{item.locality}, {item.sublocality}</Text>
          <Text style={styles.price}>{currency} {monthlyPrice} / month</Text>
        </View>
      </Pressable>
    );
  };

  
  
  return (
    
    <View style={{backgroundColor: 'white'}}>
      {isScheduling && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="blue" />
          <Text style={styles.loadingText}>Scheduling viewing...</Text>
        </View>
      )}
      

      <ScrollView
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}>
        {/* Image */}
        <StatusBar hidden={true} />

        <ImageCarousel
          postId={post.id}
          images={post.images}
          isFav={checkIsFav(post.id)}
          handleChangeFavorite={() => handleChangeFavorite(post)}
        />

        <View style={styles.container}>
       
        

          {/* Bed and Bedroom */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.description} numberOfLines={2}>
              {post.title}
            </Text>
            {usersWithPrivileges.includes(user.uid) ? (
              <TouchableOpacity
                onPress={() => {
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
                      { text: 'Cancel', style: 'cancel' },
                    ],
                    { cancelable: true },
                  );
                }}>
                <Fontisto name="trash" size={25} color={'blue'} />
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
  {post.type} | {post.bedroom} bedrooms | {post.bathroomNumber} bathrooms |
</Text>

<View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
  <View style={{ flexDirection: "column" }}>
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
    
    <View style={styles.container1}>
    <Pressable onPress={showDetailsModal} style={styles.scheduleButton}>
        <FontAwesomeIcon icon={faCalendar} size={20} color={"white"} />
        <Text style={{fontWeight:"bold", color:"white"}}>Schedule Viewing</Text>
      </Pressable>
      
      
      <Modal
        visible={isDetailsModalVisible}
        transparent={true}
        onRequestClose={hideDetailsModal}
      >
        <Pressable onPress={hideDetailsModal} style={styles.modalOverlay}>
          <View onStartShouldSetResponder={() => true} style={styles.modal}>
          
            <Text style={styles.modalTitle}>Enter your details. </Text>
            <Text style={{fontSize:14}}> Click next and choose date and time to confirm Viewing</Text>
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
            <Pressable opacity={!name || !phoneNumber || !location ? .5 : 1} disabled={!name || !phoneNumber || !location} onPress={handleSubmit} style={styles.submitButton}>
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




    {usersWithPrivileges.includes(user.uid) && (
      <>
        <Pressable
          onPress={() => makeCall(post.phoneNumbers)}
          style={{
            marginVertical: 5,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-evenly",
            backgroundColor: "blue",
            borderRadius: 5,
            paddingHorizontal: 5,
            paddingVertical: 5,
            marginVertical: 5,
          }}
        >
          <Fontisto
            name="phone"
            size={15}
            style={{
              color: "white",
              marginHorizontal: 5,
              transform: [{ rotate: "90deg" }],
            }}
          />
          <Text style={{ color: "white" }}>Call Homeowner</Text>
        </Pressable>

        <Pressable
          onPress={() => makeCall(post.marketerNumber)}
          style={{
            borderColor: "black",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-evenly",
            backgroundColor: "yellow",
            borderRadius: 5,
            paddingHorizontal: 5,
            paddingVertical: 5,
            marginVertical:5
          }}
        >
          <Fontisto
            name="phone"
            size={15}
            style={{
              color: "black",
              marginHorizontal: 5,
              transform: [{ rotate: "90deg" }],
            }}
          />
          <Text style={{ color: "black" }}>Call Marketer</Text>
        </Pressable>
      </>
    )}
  </View>
  <View style={{ marginLeft: 10 }}>
  {post.videoUrl && (
    <>
      {!fullscreen && (
        <TouchableOpacity onPress={() => setFullscreen(true)}>
          <View style={styles.videoWrapper}>
            <Video
              ref={videoRef}
              source={{ uri: post.videoUrl }}
              style={styles.video}
              resizeMode="contain"
              repeat={true}
              onProgress={handleProgress}
              onLoad={handleLoad}
              onError={(error) => console.log("Error playing video:", error)}
            />
            {videoLoading && (
              <ActivityIndicator size="large" color="white" style={styles.loadingIndicator} />
            )}
          </View>
        </TouchableOpacity>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={fullscreen}
        onRequestClose={() => setFullscreen(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setFullscreen(false)}>
            <Video
              ref={videoRef}
              source={{ uri: post.videoUrl }}
              style={styles.fullscreenVideo}
              resizeMode="cover"
              repeat={true}
              onProgress={handleProgress}
              onLoad={handleLoad}
              onError={(error) => console.log("Error playing video:", error)}
            />
            {videoLoading && (
              <ActivityIndicator size="large" color="white" style={styles.loadingIndicator} />
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
          <View style={{ paddingBottom: 20 }}>

            <SkeletonContent
              containerStyle={{ flex: 1, flexDirection: 'row' }}
              isLoading={isLoading}
              layout={[
                { key: 'item1', width: 150, height: 150, borderRadius: 10, marginRight: 10 },
                { key: 'item2', width: 150, height: 150, borderRadius: 10, marginRight: 10 },
                { key: 'item3', width: 150, height: 150, borderRadius: 10, marginRight: 10 },
                { key: 'item4', width: 150, height: 150, borderRadius: 10, marginRight: 10 },
                { key: 'item5', width: 150, height: 150, borderRadius: 10, marginRight: 10 },
              ]}
            >
              {similarHomes.length > 0 ? (
                <View>
                  <View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginBottom: 16,
                      }}>
                      Homes you may like
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 1,
                      overflow: 'scroll',
                    }}
                  >


                    <FlatList
                      data={similarHomes}
                      renderItem={renderItem}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item) => item.id}

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
          <TouchableOpacity style={{
            fontWeight: 'bold',

          }} onPress={toggleDescription}>
            <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>{showFullDescription ? 'Show Less' : 'Show More'}</Text>
          </TouchableOpacity>
          <View style={styles.hairline} />

          <View style={{ flexDirection: 'column', marginTop: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <FontAwesomeIcon icon={faShieldAlt} size={30} color="blue" />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  <Text style={{ color: 'blue' }}>RentIt</Text>
                  <Text style={{ color: 'deeppink' }}>Guarantee</Text>
                </Text>
                <Text style={{ marginTop: 4, fontSize: 12, color: '#555', maxWidth: "90%" }}>
                  Every booking on RentIt comes with RentItGuarantee, if you don't like the property you get your money back.
                  {showMore ? (
                    <>
                      {'\n\n'}
                      <Text style={{ fontWeight: 'bold' }}>What's included?</Text>
                      {'\n\n'}

                      Book with confidence: Our guarantee program gives you the option of getting a refund if you're not satisfied with the property you booked, or if the property doesn't meet your expectations.



                      {'\n'}

                      {'\n\n'}



                      Protection against scams: You can trust that the properties listed on our platform are legitimate and not fraudulent listings.

                      {'\n'}


                    </>
                  ) : null}
                </Text>
                <TouchableOpacity onPress={toggleShowMore} style={{ marginTop: 8 }}>
                  <Text style={{ color: 'blue', fontSize: 12 }}>
                    {showMore ? 'Show less' : 'Show more'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>


            {post.furnished ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <FontAwesomeIcon icon={faCouch} size={30} color="blue" />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Furnished</Text>
                  <Text style={{ marginTop: 4, fontSize: 12, color: '#555', maxWidth: "90%" }}>This property comes with furniture included.</Text>
                </View>
              </View>
            ) : null}
            {post.negotiable ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <FontAwesomeIcon icon={faHandshake} size={30} color="blue" />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Negotiable</Text>
                  <Text style={{ marginTop: 4, fontSize: 12, color: '#555', maxWidth: "90%" }}>The price of this property is open to negotiation with the owner.</Text>
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faCheckCircle} size={30} color="blue" />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Verified</Text>
                  <Text style={{ marginTop: 4, fontSize: 12, color: '#555', maxWidth: "90%" }}>This property has been verified by our team to ensure its authenticity and quality.</Text>
                </View>
              </View>
            ) : null}
          </View>





          <View style={styles.hairline} />
          <Text
            style={{ margin: 10, fontSize: 20, fontFamily: 'Montserrat-Bold' }}>
            Amenities available
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {post.aircondition === 'Yes' ? (
              <View style={styles.card}>
                <View style={styles.cardItem}>
                  <FontAwesomeIcon icon={faFan} size={25} color={'blue'} />
                  <Text style={styles.cardText}>Air Conditioner</Text>
                </View>
              </View>
            ) : null}
            {post.wifi === 'Yes' ? (
              <View style={styles.card}>
                <View style={styles.cardItem}>
                  <Feather name="wifi" size={25} color={'blue'} />
                  <Text style={styles.cardText}>Wifi</Text>
                </View>
              </View>
            ) : null}
            {post.kitchen === 'Yes' ? (
              <View style={styles.card}>
                <View style={styles.cardItem}>
                  <FontAwesomeIcon icon={faUtensils} color={'blue'} />
                  <Text style={styles.cardText}>Kitchen</Text>
                </View>
              </View>
            ) : null}
            {post.bathroom === 'Yes' ? (
              <View style={styles.card}>
                <View style={styles.cardItem}>
                  <FontAwesomeIcon icon={faBath} size={25} color={'blue'} />
                  <Text style={styles.cardText}>Bathroom</Text>
                </View>
              </View>
            ) : null}
            {post.bed === 'Yes' ? (
              <View style={styles.card}>
                <View style={styles.cardItem}>
                  <FontAwesomeIcon icon={faBed} size={25} color={'blue'} />
                  <Text style={styles.cardText}>Bedroom</Text>
                </View>
              </View>
            ) : null}
            {post.water === 'Yes' ? (
              <View style={styles.card}>
                <View style={styles.cardItem}>
                  <FontAwesomeIcon icon={faFaucet} size={25} color={'blue'} />
                  <Text style={styles.cardText}>Water</Text>
                </View>
              </View>
            ) : null}
            {post.toilet === 'Yes' ? (
              <View style={styles.card}>
                <View style={styles.cardItem}>
                  <FontAwesomeIcon icon={faToilet} size={25} color={'blue'} />
                  <Text style={styles.cardText}>Toilet</Text>
                </View>
              </View>
            ) : null}
          </View>





        </View>
        <View style={styles.hairline} />
        {/* here i made changes */}

        <View style={{ paddingHorizontal: 20 }}>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
            <View>
              <TouchableOpacity
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              // onPress={() => navigation.navigate('Reviews')}
              >
                <StarRating
                  disabled={true}
                  starSize={13}
                  maxStars={5}
                  rating={post?.reviews?.items?.reduce((acc, val) => acc + val.rating, 0) /
                    post?.reviews?.items?.length || 0}
                  fullStarColor={'orange'}
                />
                <Text footnote grayColor style={{ marginLeft: 5 }}>
                  ({post?.reviews?.items?.length}) reviews
                </Text>
              </TouchableOpacity>

            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  paddingTop: 20,
                }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => navigation.navigate('Feedback', { postID: post?.id, user })}>
                  <FontAwesomeIcon icon={faPlusCircle} size={18} color="blue" />
                  <Text
                    style={{
                      paddingHorizontal: 4,
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: 'blue',
                    }}>
                    Write a review
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{ flex: 1 }}>

            {post?.reviews?.items?.length !== 0 ? post?.reviews?.items?.sort((a, b) => a.createdAt - b.createdAt)?.map((review) => (
              <View key={review.id}>
                {!review?.parentReviewId && (
                  <CardCommentPhoto
                    style={{
                      borderTopWidth: 0.5,
                      marginTop: 5,
                      borderColor: 'deeppink',
                    }}
                    rate={review.rating}
                    date={moment(review.createdAt).format("D MMM YYYY")}
                    comment={review.review}
                    userID={review.userID}
                  />
                )}
                {post?.reviews?.items?.map(
                  (rep) =>
                    rep.parentReviewId === review.id && (
                      <>
                        <CardCommentPhoto
                          style={{
                            marginLeft: 40,
                            borderTopWidth: 0.2,
                            borderColor: 'gray'
                          }}
                          rate={rep.rating}
                          date={moment(rep.createdAt).format("D MMM YYYY")}
                          comment={rep.review}
                          userID={rep.userID}
                          hasReply
                        />
                      </>
                    )
                )}

              </View>
            )) : <Text style={{ color: 'gray' }}>No Review yet</Text>
            }
          </View>

        </View>

      </ScrollView>

      <View
        style={{
          flex: 1,
          borderTopColor: 'lightgrey',
          borderTopWidth: 1,
          flexDirection: 'row',
          backgroundColor: 'white',
          position: 'absolute',
          height: 80,
          width: '100%',
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View>
          {post.mode === 'For Sale' ? (
            <Text
              style={{ fontSize: 22, fontWeight: 'bold', marginHorizontal: 20 }}>
              {post.currency === null
                ? 'GH₵'
                : post.currency[0] === 'usd'
                  ? '$'
                  : 'GH₵'}
              {Math.round(post.newPrice * 1.07)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              {'\n'}
            </Text>
          ) : (
            <Text
              style={{ fontSize: 22, fontWeight: 'bold', marginHorizontal: 20 }}>
              {post.currency === null
                ? 'GH₵'
                : post.currency[0] === 'usd'
                  ? '$'
                  : 'GH₵'}
              {Math.round((post.newPrice * 1.07) / 12)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              {'\n'} / month
            </Text>
          )}
        </View>
        <View style={{marginTop: 10, marginHorizontal: 40,}}>
          <Pressable
            style={{
              marginBottom: 10,
              backgroundColor: 'deeppink',
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
              width: '100%',
              marginHorizontal: 20,
              borderRadius: 5,
            }}
            onPress={() => {
              payRent();
              logAnalyticsEvent();
            }}>
            {/* <Fontisto name="credit-card" size={25} style={{color: 'white' , margin: 10 ,}} /> */}
            <Text
              style={{
                fontSize: 20,
                color: 'white',
                fontWeight: 'bold',
              }}>
              Pay to Rent
            </Text>
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
