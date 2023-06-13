import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, ScrollView, FlatList, Image, Pressable, SafeAreaView} from 'react-native';
import Typography from '../../componentsV2/DataDisplay/Typography';
import {styles} from './styles';
import Divider from '../../componentsV2/DataDisplay/Divider';

import rightAngle from '../../../assets/data/images/icons/right-angle.png';
import Icon4 from '../../../assets/data/images/icons/rules/icon4.png';
import BottomSpace from '../../componentsV2/DataDisplay/BottomSpace/BottomSpace';
import useWishlist from '../../hooks/useWishlist';
import {fetchPost_req, fetchSimilarPosts_req} from '../../api/posts.api';
import Carousel from '../../componentsV2/DataDisplay/Carousel';
import {offsets} from '../../styles/globalStyles';
import RoomItem from '../../componentsV2/DataDisplay/RoomItem';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const params = route.params || {};

  const postId = params.id;
  const navigation = useNavigation();
  const isMounted = useRef(true);

  const [isLoading, setIsLoading] = useState(true);
  const [similarPostsLoading, setSimilarPostsLoading] = useState(false);

  const [post, setPost] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [similarPosts, setSimilarPosts] = useState(null);

  const {checkIsFav, handleChangeFavorite} = useWishlist();
  const dataHost = [
    {
      img: Icon4,
      text: 'Message Host',
      angle: rightAngle,
      border: true,
    },
    {
      img: Icon4,
      text: 'Show Listing',
      angle: rightAngle,
      border: false,
    },
  ];
  const reservationItem = [
    {
      id: 1,
      img: Icon4,
      text: 'Cancel reservation',
      angle: rightAngle,
      border: true,
    },
    {
      img: Icon4,
      text: 'Get a PDF for visa purposes',
      angle: rightAngle,
      border: true,
    },
    {
      img: Icon4,
      text: 'Add to wallet',
      angle: rightAngle,
      border: true,
    },
    {
      img: Icon4,
      text: 'Get receipt',
      angle: rightAngle,
      border: false,
    },
  ];
  const stayData = [
    {
      img: Icon4,
      text: 'Add details for expensing your trip',
      angle: rightAngle,
      border: true,
    },
    {
      img: Icon4,
      text: 'Get receipt',
      angle: rightAngle,
      border: false,
    },
  ];
  const supportData = [
    {
      img: Icon4,
      text: 'Contact Rentit Support',
      angle: rightAngle,
      border: true,
    },
    {
      img: Icon4,
      text: 'Visit the Help Center',
      angle: rightAngle,
      border: false,
    },
  ];
  const fetchPost = useCallback(async id => {
    if (!isMounted.current) {
      return;
    }
    setIsLoading(true);

    try {
      setPost(await fetchPost_req(id));
    } catch (e) {
      console.error('PostScreen -> fetchPost Error:', e);
      setErrorMsg('PostScreen -> fetchPost Error:');
    }
    setIsLoading(false);
  }, []);

  const fetchSimilarPosts = useCallback(async () => {
    if (!post) {
      return;
    }
    setSimilarPostsLoading(true);

    try {
      setSimilarPosts(await fetchSimilarPosts_req(post));
    } catch (e) {
      console.error('PostScreen -> fetchSimilarPosts Error:', e);
      setErrorMsg('PostScreen -> fetchSimilarPosts Error:');
    }
    setSimilarPostsLoading(false);
  }, [post]);

  useEffect(() => {
    fetchPost(postId);
  }, [postId]);

  useEffect(() => {
    fetchSimilarPosts();
  }, [post]);

  useEffect(
    () => () => {
      isMounted.current = false;
    },
    [],
  );
  const goReasonScreen = item => {
    if (item.id === 1) {
      navigation.navigate('Reason');
    }
  };
  const keyExtractor = useCallback(item => item.id, []);
  const dataHostData = useCallback(({item}) => {
    return (
      <>
        <Pressable style={styles.hostData} onPress={() => goReasonScreen(item)}>
          <View style={styles.leftHostData}>
            <Image source={item.img} />
            <Typography style={{marginLeft: 20}}>{item.text}</Typography>
          </View>

          <Image source={item.angle} />
        </Pressable>
        {item.border && <Divider />}
      </>
    );
  }, []);

  const renderRoomItem = useCallback(({item}) => {
    return (
      <RoomItem
        image={item.image}
        currency={item?.currency?.[0]}
        newPrice={item.newPrice}
        title={item.title}
        locality={item.locality}
        subLocality={item.sublocality}
        // onPress={() => {}}
      />
    );
  }, []);

  return (
    // <View style={styles.mainContent}>
    //   <Typography variant="xlarge" bold style={{marginTop: 50}}>
    //     Homes
    //   </Typography>
    //   <Divider />
    //   <Typography variant="large" bold>
    //     No homes booked ... yet!
    //   </Typography>

    //   <View style={styles.imgBlock}></View>
    //   <Typography style={{marginBottom: 20}}>
    //     Time to dust off your bags and start planning your next adventure
    //   </Typography>
    //   <Button text={'Start searching'} style={{width: 200}} />
    //   <Divider />
    //   <View>
    //     <Typography variant="small">Can’t find your reservation here?</Typography>
    //     <Pressable>
    //       <Text style={styles.helpCenter}>Visit The Help Center</Text>
    //     </Pressable>
    //   </View>
    // </View>
    <SafeAreaView>
      <ScrollView>
        <Carousel
          postId={post?.id}
          images={post?.images}
          isFav={checkIsFav(post?.id)}
          // onFavorite={onFavorite}
        />
        <View style={styles.mainContent}>
          <View style={styles.checkBlock}>
            <View style={styles.checkIn}>
              <Typography bold style={{paddingBottom: 10}}>
                Check-in
              </Typography>
              <Typography>Mon, Feb 13, 2023</Typography>
              <Typography>1:00 PM</Typography>
            </View>
            <View style={styles.border}></View>
            <View style={styles.checkout}>
              <Typography bold style={{paddingBottom: 10}}>
                Checkout
              </Typography>
              <Typography>Mon, Feb 13, 2023</Typography>
              <Typography>1:00 PM</Typography>
            </View>
          </View>
          <Divider />
          <FlatList data={dataHost} renderItem={dataHostData} keyExtractor={keyExtractor} />
        </View>
        <BottomSpace />
        <View style={styles.mainContent}>
          <Typography variant="large" bold>
            Reservation details
          </Typography>
          <View style={styles.detailsItem}>
            <View>
              <Typography bold>Who’s coming</Typography>
              <Typography>1 guest</Typography>
            </View>

            <Image source={Icon4} />
          </View>
          <Divider />
          <View style={styles.confirmationCode}>
            <Typography bold style={{paddingBottom: 10}}>
              Confirmation Code
            </Typography>
            <Typography>HBACDEFQAZKC</Typography>
          </View>
          <Divider />
          <FlatList data={reservationItem} renderItem={dataHostData} keyExtractor={keyExtractor} />
        </View>
        <BottomSpace />
        <View style={styles.mainContent}>
          <View style={styles.wifi}>
            <Typography bold>Wifi</Typography>
            <Typography style={{marginTop: 20}}>
              You’ll find wifi login details here 24 hours before check in.
            </Typography>
          </View>
        </View>
        <BottomSpace />
        <View style={styles.mainContent}>
          <View style={styles.wifi}>
            <Typography bold>Where you’re staying</Typography>
            <Typography variant="small" bold style={{paddingTop: 34}}>
              House Rules
            </Typography>
            <Typography style={{paddingTop: 8}}>
              Always be respectful to myself and my home.
            </Typography>

            <Typography>
              Parking is available on the street of on the driveway at the front of the house. No
              smoking please...
            </Typography>
            <Pressable>
              <Typography variant="small" bold style={{textDecorationLine: 'underline'}}>
                Read more
              </Typography>
            </Pressable>

            <Divider />
            <View style={styles.hostData}>
              <View style={styles.leftHostData}>
                <Image source={Icon4} />
                <Typography style={{marginLeft: 20}}>Show listing</Typography>
              </View>
              <Image source={rightAngle} />
            </View>
          </View>
        </View>
        <BottomSpace />
        <View style={styles.mainContent}>
          {similarPosts?.length ? (
            <>
              <Typography variant="xlarge" bold>
                Find things to do near your stay
              </Typography>
              <Typography bold style={{marginTop: 34}}>
                Popular in Manchester
              </Typography>
              <FlatList
                style={{marginTop: offsets.offsetB}}
                data={similarPosts}
                renderItem={renderRoomItem}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
              <Divider />
            </>
          ) : (
            <></>
          )}
        </View>

        <View style={styles.mainContent}>
          <Typography variant="large" bold style={{marginTop: 10, marginBottom: 16}}>
            Hosted by Darkoco.
          </Typography>
          <Typography bold style={{marginBottom: 6}}>
            About your host
          </Typography>
          <Typography style={{marginBottom: 14}}>
            Hey! We are Matt and Ben - owners of Darkoco. - the best resource for editable user
            interfaces of the worlds best a...
          </Typography>
          <Typography bold style={{textDecorationLine: 'underline'}}>
            Show more
          </Typography>
        </View>
        <BottomSpace />
        <View style={styles.mainContent}>
          <Typography variant="large" bold style={{marginBottom: 34, marginTop: 10}}>
            Where you’re staying
          </Typography>
          <Typography bold style={{marginBottom: 8}}>
            Total cost
          </Typography>
          <Typography variant="small">$123.45 USD</Typography>
          <Divider />
          <FlatList data={stayData} renderItem={dataHostData} keyExtractor={keyExtractor} />
        </View>
        <BottomSpace />
        <View style={styles.mainContent}>
          <Typography variant="large" bold style={{marginBottom: 10, marginTop: 10}}>
            Get support anytime
          </Typography>
          <Typography style={{marginBottom: 30}}>
            If you need help, we’re available 24/7 from anywhere in the world.
          </Typography>

          <FlatList data={supportData} renderItem={dataHostData} keyExtractor={keyExtractor} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
