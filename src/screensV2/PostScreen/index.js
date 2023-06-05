import React, {useEffect, useState, useRef, useCallback} from 'react';
import {ScrollView, View, Image, FlatList, Text, SafeAreaView, Share} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import LoadingDots from 'react-native-loading-dots';

import {fetchSimilarPosts_req} from '../../api/posts.api';
import {getPost, postSelectors} from '../../redux/post.slice';

import {styles} from './styles';
import {offsets} from '../../styles/globalStyles';

import useWishlist from '../../hooks/useWishlist';

import Typography from '../../componentsV2/DataDisplay/Typography';
import Carousel from '../../componentsV2/DataDisplay/Carousel';
import Divider from '../../componentsV2/DataDisplay/Divider';

import PostAchievements from '../../componentsV2/Inputs/PostAchievements';
import ListItemText from '../../componentsV2/DataDisplay/ListItemText';

import Flag from '../../../assets/data/images/flag.svg';

import ShareIcon from '../../../assets/data/images/icons/share.svg';
import DoorIcon from '../../../assets/data/images/icons/door-icon.svg';
import MedalIcon from '../../../assets/data/images/icons/medal-icon.svg';
import IconCalendar from '../../../assets/data/images/icons/calendar-icon.svg';
import RentitGuaranteeImg from '../../../assets/data/images/additional/rentitGuarantee.png';
import Icon4 from '../../../assets/data/images/icons/rules/icon4.png';
import KitchenIcon from '../../../assets/data/images/icons/kitchen-icon.svg';
import WifiIcon from '../../../assets/data/images/icons/wifi-icon.svg';
import Dedicated from '../../../assets/data/images/icons/dedicated.svg';
import CarIcon from '../../../assets/data/images/icons/car-icon.svg';
import TvIcon from '../../../assets/data/images/icons/tv-icon.svg';
import Star from '../../../assets/data/images/icons/star.svg';

import RoomItem from '../../componentsV2/DataDisplay/RoomItem';
import CommentItem from '../../componentsV2/DataDisplay/CommentItem';
import PostMoreInfo from '../../componentsV2/DataDisplay/PostMoreInfo';
import Button from '../../componentsV2/Inputs/Button';
import RulesRow from '../../componentsV2/DataDisplay/RulesRow';
import Reserve from '../../componentsV2/Inputs/Reserve';
import {navigate} from '../../navigation/Router';

const PostScreen = ({route}) => {
  const params = route.params || {};
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {postId} = params;

  const isMounted = useRef(true);

  const [similarPostsLoading, setSimilarPostsLoading] = useState(false);

  // const [post, setPost] = useState(null);
  const post = useSelector(postSelectors.selectPost);

  const [similarPosts, setSimilarPosts] = useState(null);

  const {checkIsFav, handleChangeFavorite} = useWishlist();

  const postMoreInfoData = [
    {id: 1, moreInfoTitle: 'Availability', moreInfoText: '30 Oct - 4 Nov'},
    {id: 2, moreInfoTitle: 'House rules', moreInfoText: 'Check-in: After 15:00'},
    {
      id: 3,
      moreInfoTitle: 'Health & safety',
      moreInfoText: 'Rentit’s COVID-19 safety practices apply carbon monoxide alarm',
    },
    {
      id: 4,
      moreInfoTitle: 'Cancellation policy',
      moreInfoText:
        'Free cancellation before 25 Oct.Review the Host’s full cancellation policy which applies even if you cancel for illness or disruptions caused by COVID-19',
    },
  ];

  const data = [
    {
      image: 1,
      text: '1,128 Reviews',
    },
    {
      image: 2,
      text: 'Identity verified',
    },
    {
      image: 3,
      text: 'Superhost',
    },
    {
      image: 4,
      text: 'Rentit.homes supporter',
    },
  ];

  const fetchPost = useCallback(async id => {
    if (!isMounted.current) {
      return;
    }

    dispatch(getPost(id));
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
    }
    setSimilarPostsLoading(false);
  }, [post]);

  const onFavorite = useCallback(_post => handleChangeFavorite(_post), [handleChangeFavorite]);

  const gorMoreScreen = id => {
    if (id === 1) {
      navigation.navigate('Amenities');
    }
    if (id === 2) {
      navigation.navigate('Rules');
    }
    if (id === 3) {
      navigation.navigate('Health');
    }
    if (id === 4) {
      navigation.navigate('Homes');
    }
  };

  const goReviewScreen = useCallback(() => {
    navigation.navigate('ReviewsMore', {data: similarPosts});
  }, []);

  const moreInfoItem = useCallback(({item}) => {
    return (
      <>
        <PostMoreInfo
          title={item.moreInfoTitle}
          content={item.moreInfoText}
          image={item.image}
          // eslint-disable-next-line react/jsx-no-bind
          onPress={() => gorMoreScreen(item.id)}
        />
        <Divider />
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

  const renderCommentItem = useCallback(({item}) => {
    return (
      <CommentItem
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

  const hostItem = useCallback(({item}) => {
    return <RulesRow image={item.image} text={item.text} />;
  });
  const moreInfoKeyExtractor = useCallback(item => item.id, []);
  const keyExtractor = useCallback(item => item.id, []);

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
      alert(e.message);
    }
  }, [postId]);

  const onReserve = useCallback(() => {
    navigate('RequestBook', {postId: post.id});
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

  return (
    <SafeAreaView>
      <ScrollView>
        <Carousel
          postId={post?.id}
          images={post?.images}
          isFav={checkIsFav(post?.id)}
          leftAction={goBack}
          leftImage={<FontAwesome name="angle-left" size={18} color="black" />}
          rightAction={onFavorite}
          rightImage={<FontAwesome name="heart-o" size={18} color="black" />}
          rightAction2={onShare}
          rightImage2={<ShareIcon />}
        />
        <View style={[styles.mainContent]}>
          <Typography variant="xlarge" bold>
            {post?.title}
          </Typography>
          {post?.temp && (
            <View style={styles.loaderWrapper}>
              <LoadingDots
                dots={3}
                size={10}
                bounceHeight={4}
                colors={['#000000', '#000000', '#000000']}
              />
            </View>
          )}
          {!post?.temp && (
            <>
              <PostAchievements style={{width: '80%', marginTop: offsets.offsetA}} post={post} />
              <Typography style={{marginTop: offsets.offsetA}}>
                Greater Manchester, England, United Kingdom
              </Typography>
              <Divider />
              <ListItemText
                primaryVariant="large"
                primary="This is a rare find."
                secondaryVariant="large"
                secondary="City Superhost’s place on Rentit is usually fully booked"
                union={true}
              />
              <Divider />
              <ListItemText
                primaryVariant="headingLarge"
                primary="Entire home hosted by City Superhost"
                secondaryVariant="large"
                secondary="6 guests - 3 bedrooms - 3 beds - 2 bathrooms"
              />
              <Divider />
              <ListItemText
                primary="Self check-in"
                secondary="Check yourself in with the lockbox."
                reverse
                icon={<DoorIcon width={24} height={26} />}
              />
              <ListItemText
                primary="City Superhost is a Superhost"
                secondary="Superhosts are experienced, highly rated hosts who are committed to providing great stays for their guests"
                reverse
                icon={<MedalIcon width={24} height={26} />}
              />
              <ListItemText
                primary="Free cancellation before 25 Oct"
                reverse
                icon={<IconCalendar width={24} height={26} />}
              />
              <Divider />
              <Typography>
                Every booking includes free protection from Host cancellations, listing
                inaccuracies, and other issues like trouble checking in.
              </Typography>
              <Typography
                // onPress={() => {}}
                style={{textDecorationLine: 'underline', marginTop: offsets.offsetA}}>
                Learn more
              </Typography>
              <Divider />
              <Typography>
                You’ll love this home for your visit to Manchester whether you’re here for a long
                time, short time, business or pleasure
              </Typography>
              <Typography
                // onPress={() => {}}
                style={{textDecorationLine: 'underline', marginTop: offsets.offsetA}}>
                Learn more
              </Typography>
              <Divider />
              <Image source={RentitGuaranteeImg} width={239} height={24} />
              <Typography style={{marginTop: offsets.offsetA}}>
                Every booking includes free protection from Host cancellations, listing
                inaccuracies, and other issues like trouble checking in.
              </Typography>
              <Typography
                // onPress={() => {}}
                style={{textDecorationLine: 'underline', marginTop: offsets.offsetA}}>
                Learn more
              </Typography>
              <Divider />
              <Typography style={{marginTop: offsets.offsetA}}>{post?.description}</Typography>
              <Typography
                // onPress={() => {}}
                style={{textDecorationLine: 'underline', marginTop: offsets.offsetA}}>
                Learn more
              </Typography>
              <Divider />
              {similarPosts?.length ? (
                <>
                  <Typography variant="xlarge" bold>
                    Where you will sleep
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
              <ListItemText
                primary="Kitchen"
                reverse
                center
                icon={<KitchenIcon width={24} height={26} />}
              />
              <ListItemText
                primary="Wifi"
                reverse
                center
                icon={<WifiIcon width={24} height={26} />}
              />
              <ListItemText
                primary="Dedicated workspace"
                reverse
                center
                icon={<Dedicated width={24} height={26} />}
              />
              <ListItemText
                primary="Free driveway parking on premises - 1 space"
                reverse
                center
                icon={<CarIcon width={24} height={26} />}
              />
              <ListItemText
                primary="55” HDTV with Netflix"
                reverse
                center
                icon={<TvIcon width={24} height={26} />}
              />
              <Button
                variant="outlined"
                text="Show All 54 amenities"
                onPress={goReviewScreen}
                style={{marginBottom: 15, marginTop: 15}}
              />
              <Divider />
              {similarPosts?.length ? (
                <>
                  <View style={styles.starBlock}>
                    <Star width={20} height={20} />
                    <Typography variant="xlarge" bold style={{paddingLeft: 10}}>
                      4.76 - 28 Reviews
                    </Typography>
                  </View>

                  <FlatList
                    style={{marginTop: offsets.offsetB}}
                    data={similarPosts}
                    renderItem={renderCommentItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                  <Divider />
                </>
              ) : (
                <></>
              )}
              <Button
                variant="outlined"
                text="Show All 28 reviews"
                onPress={goReviewScreen}
                style={{marginBottom: 15, marginTop: 15}}
              />
              <Divider />
              <View style={styles.superHost}>
                <Typography variant="xlarge" bold style={{width: 200}}>
                  Hosted by City Superhost
                </Typography>
                <Typography variant="small" style={{color: '#717171'}}>
                  Joined in February 2015
                </Typography>
                <Text style={styles.hostText}>Profesional Host</Text>
              </View>
              <FlatList data={data} renderItem={hostItem} keyExtractor={keyExtractor} />
              <Typography style={{marginTop: 19}}>
                Hey! We are Matt and Ben - owners of UiClones - the best resource for editable user
                interfaces of the worlds best a...
              </Typography>
              <View style={styles.coHosts}>
                <Typography>Co-hosts: </Typography>
                <View style={styles.imgHosts}>
                  <Image source={Icon4} />
                </View>
              </View>
              <Typography variant="large" bold style={{marginTop: 40}}>
                City Superhost is a Superhost
              </Typography>
              <Typography style={{marginTop: 8}}>
                Superhosts are experienced, highly rated hosts who are committed to providing great
                stays for quests
              </Typography>
              <Typography style={{marginTop: 16}}>Repsonse rate: 100%</Typography>
              <Typography style={{marginTop: 8, marginBottom: 20}}>
                Response time: within an hour
              </Typography>
              <Button variant="outlined" text="Contact host" onPress={goReviewScreen} />
              <Typography style={{marginTop: 30}}>
                To protect your payment, never transfer money or communicate outside of the Rentit
                website or app.
              </Typography>

              <Divider />
              <FlatList
                data={postMoreInfoData}
                renderItem={moreInfoItem}
                keyExtractor={moreInfoKeyExtractor}
              />
              <View style={styles.reportBlock}>
                {/* <Image source={Icon4} /> */}
                <Flag width={20} height={20} />
                <Text style={styles.reportText}>Report this listing</Text>
              </View>
              <Divider />
            </>
          )}
        </View>
      </ScrollView>
      {!post?.temp && <Reserve price={post.newPrice} onPress={onReserve} />}
    </SafeAreaView>
  );
};

export default PostScreen;
