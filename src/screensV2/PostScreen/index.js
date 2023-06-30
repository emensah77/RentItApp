import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
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
import MedalIcon from '../../../assets/data/images/icons/medal-icon.svg';
import IconCalendar from '../../../assets/data/images/icons/calendar-icon.svg';
import RentitGuaranteeImg from '../../../assets/data/images/additional/rentitGuarantee.png';
import Furnished from '../../../assets/data/images/icons/furnished.svg';
import Negotiable from '../../../assets/data/images/icons/negotiable.svg';
import Verified from '../../../assets/data/images/icons/verified.svg';
import Star from '../../../assets/data/images/icons/star.svg';
import Check from '../../../assets/data/images/icons/listing-small.svg';
import Cell from '../../../assets/data/images/icons/cell-icon.svg';
import HostIcon from '../../../assets/data/images/icons/host-icon.svg';

import RoomItem from '../../componentsV2/DataDisplay/RoomItem';
import CommentItem from '../../componentsV2/DataDisplay/CommentItem';
import PostMoreInfo from '../../componentsV2/DataDisplay/PostMoreInfo';
import Button from '../../componentsV2/Inputs/Button';
import RulesRow from '../../componentsV2/DataDisplay/RulesRow';
import Reserve from '../../componentsV2/Inputs/Reserve';
import {navigate} from '../../navigation/Router';
import CalendarOverlay from '../../componentsV2/Inputs/CalendarOverlay';
import {extractDate} from '../../utils/formatter';

const PostScreen = ({route}) => {
  const params = route.params || {};
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {postId} = params;

  const isMounted = useRef(true);
  const bottomSheetRef = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);

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

  const data = useMemo(() => {
    const arr = [
      {
        image: <Star width={20} height={20} />,
        text: `${post?.reviews?.items?.length || 0} Reviews`,
      },
    ];

    if (post.verified) {
      arr.push({
        image: <HostIcon width={20} height={20} />,
        text: 'Identity verified',
      });
    }

    if (isSuperhost) {
      arr.push({
        image: <Check width={20} height={20} />,
        text: 'Superhost',
      });
    }

    arr.push({
      image: <Cell width={20} height={20} />,
      text: 'Rentit homes supporter',
    });

    return arr;
  }, [post, isSuperhost]);

  const reviewsCount = useMemo(() => {
    return (
      post?.reviews?.items?.reduce((acc, val) => acc + val.rating, 0) /
        post?.reviews?.items?.length || 0
    );
  }, [post?.reviews]);

  // callbacks
  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

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
    setShowCalendar(true);
    // navigate('RequestBook', {postId: post.id});
  }, [post]);

  const onCalendarClose = useCallback(() => {
    setTimeout(() => {
      setShowCalendar(false);
    }, 500);
  }, []);

  const onDatesSaved = useCallback(dates => {
    navigate('RequestBook', {postId: post.id, dates});
  }, []);

  const isRareFind = useMemo(() => post?.qualityScore >= 80, [post?.qualityScore]);
  const isSuperhost = useMemo(() => post?.qualityScore >= 60, [post?.qualityScore]);

  const availabilityDate = useMemo(() => {
    try {
      const now = Date.now();
      const date = new Date(post.availabilityDate);

      if (now < date.getTime()) {
        return extractDate(date);
      }

      return null;
    } catch (e) {
      return null;
    }
  }, [post?.availabilityDate]);

  const houseRules = [
    {
      image: 5,
      text: 'Check-in: After 15:00',
    },
    {
      image: 5,
      text: 'Check-out: 11:00',
    },
    {
      image: 6,
      text: 'Self check-in with lockbox',
    },
    {
      image: 7,
      text: 'No pets',
    },
    {
      image: 8,
      text: 'No parties',
    },
  ];

  console.log('post?.qualityScore', post?.qualityScore);

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

  console.log('post', post);

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
              <PostAchievements
                style={{width: '80%', marginTop: offsets.offsetA}}
                post={post}
                reviewsCount={reviewsCount}
              />
              <Typography style={{marginTop: offsets.offsetA}}>
                {post.locality}, {post.sublocality}
              </Typography>
              <Divider />
              {isRareFind && (
                <>
                  <ListItemText
                    primaryVariant="large"
                    primary="This is a rare find."
                    secondaryVariant="large"
                    secondary={`${post.homeownerName}’s place on Rentit is usually fully booked`}
                  />
                  <Divider />
                </>
              )}
              <ListItemText
                primaryVariant="headingLarge"
                primary={`${post.type} hosted by ${post.homeownerName}`}
                secondaryVariant="large"
                secondary={`${post.maxGuests} guests - ${post.bedroom} bedrooms - ${post.bed} beds - ${post.bathroomNumber} bathrooms`}
              />
              <Divider />
              {/* <ListItemText */}
              {/*  primary="Self check-in" */}
              {/*  secondary="Check yourself in with the lockbox." */}
              {/*  reverse */}
              {/*  icon={<DoorIcon width={24} height={26} />} */}
              {/* /> */}
              {isSuperhost && (
                <ListItemText
                  primary={`${post.homeownerName} is a Superhost`}
                  secondary="Superhosts are experienced, highly rated hosts who are committed to providing great stays for their guests"
                  reverse
                  icon={<MedalIcon width={24} height={26} />}
                />
              )}

              {availabilityDate && (
                <ListItemText
                  primary={`Will be available on ${availabilityDate.day} ${availabilityDate.month}${
                    availabilityDate.isNextYear ? `${availabilityDate.year}` : ''
                  }`}
                  reverse
                  center
                  icon={<IconCalendar width={24} height={26} />}
                />
              )}
              {(isSuperhost || availabilityDate) && <Divider />}

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
              {post.furnished === 'Yes' && (
                <ListItemText
                  primary="Furnished"
                  secondary="This property comes with furniture included"
                  reverse
                  center
                  icon={<Furnished width={24} height={26} />}
                />
              )}
              {post.negotiable === 'Yes' && (
                <ListItemText
                  primary="Negotiable"
                  secondary="The price of this property is open to negotiation with the owner"
                  reverse
                  center
                  icon={<Negotiable width={24} height={26} />}
                />
              )}
              {post.verified === 'Yes' && (
                <ListItemText
                  primary="Verified"
                  secondary="This property has been verified by our team to ensure its authenticity and quality."
                  reverse
                  center
                  icon={<Verified width={24} height={26} />}
                />
              )}
              {/* <Button */}
              {/*  variant="outlined" */}
              {/*  text="Show All 54 amenities" */}
              {/*  onPress={goReviewScreen} */}
              {/*  style={{marginBottom: 15, marginTop: 15}} */}
              {/* /> */}
              {(post.furnished === 'Yes' ||
                post.negotiable === 'Yes' ||
                post.verified === 'Yes') && <Divider />}
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
                  Hosted by {post.homeownerName}
                </Typography>
                {/* <Typography variant="small" style={{color: '#717171'}}> */}
                {/*  Joined in February 2015 */}
                {/* </Typography> */}
                {isSuperhost && <Text style={styles.hostText}>Profesional Host</Text>}
              </View>
              {/* <FlatList data={data} renderItem={hostItem} keyExtractor={keyExtractor} /> */}
              {/* <Typography style={{marginTop: 19}}> */}
              {/*  Hey! We are Matt and Ben - owners of UiClones - the best resource for editable user */}
              {/*  interfaces of the worlds best a... */}
              {/* </Typography> */}
              {/* <View style={styles.coHosts}> */}
              {/*  <Typography>Co-hosts: </Typography> */}
              {/*  <View style={styles.imgHosts}> */}
              {/*    <Image source={Icon4} /> */}
              {/*  </View> */}
              {/* </View> */}
              {isSuperhost && (
                <>
                  <Typography variant="large" bold style={{marginTop: 40}}>
                    {post.homeownerName} is a Superhost
                  </Typography>
                  <Typography style={{marginTop: 8}}>
                    Superhosts are experienced, highly rated hosts who are committed to providing
                    great stays for quests
                  </Typography>
                </>
              )}

              {/* <Typography style={{marginTop: 16}}>Repsonse rate: 100%</Typography> */}
              {/* <Typography style={{marginTop: 8, marginBottom: 20}}> */}
              {/*  Response time: within an hour */}
              {/* </Typography> */}
              <Button variant="outlined" text="Contact host" onPress={() => {}} />
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
      {showCalendar && (
        <CalendarOverlay
          title="5 night stay"
          handleSheetChanges={handleSheetChanges}
          bottomSheetRef={bottomSheetRef}
          onClose={onCalendarClose}
          onPositive={onDatesSaved}
        />
      )}
    </SafeAreaView>
  );
};

export default PostScreen;
