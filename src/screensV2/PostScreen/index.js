import React, {useEffect, useState, useRef, useCallback} from 'react';
import {ScrollView, View, Image, FlatList} from 'react-native';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {useNavigation} from '@react-navigation/native';

import rightAngle from '../../../assets/data/images/icons/right-angle.png';

import {fetchPost_req, fetchSimilarPosts_req} from '../../api/posts.api';

import {mainSkeletonLayout, styles} from './styles';
import globalStyles, {offsets} from '../../styles/globalStyles';

import useWishlist from '../../hooks/useWishlist';

import Typography from '../../componentsV2/DataDisplay/Typography';
import Carousel from '../../componentsV2/DataDisplay/Carousel';
import Divider from '../../componentsV2/DataDisplay/Divider';

import PostAchievements from '../../componentsV2/Inputs/PostAchievements';
import ListItemText from '../../componentsV2/DataDisplay/ListItemText';

import DoorIcon from '../../../assets/data/images/icons/door.png';
import MedalIcon from '../../../assets/data/images/icons/medal.png';
import CalendarIcon from '../../../assets/data/images/icons/calendar.png';
import RentitGuaranteeImg from '../../../assets/data/images/additional/rentitGuarantee.png';
import RoomItem from '../../componentsV2/DataDisplay/RoomItem';
import CommentItem from '../../componentsV2/DataDisplay/CommentItem';

import PostMoreInfo from '../../componentsV2/DataDisplay/PostMoreInfo';
import Button from '../../componentsV2/Inputs/Button';

const PostScreen = ({route}) => {
  const params = route.params || {};
  const navigation = useNavigation();

  const {postId} = params;

  const isMounted = useRef(true);

  const [isLoading, setIsLoading] = useState(true);
  const [similarPostsLoading, setSimilarPostsLoading] = useState(false);

  const [post, setPost] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [similarPosts, setSimilarPosts] = useState(null);

  const {checkIsFav, handleChangeFavorite} = useWishlist();

  const postMoreInfoData = [
    {id: 1, moreInfoTitle: 'Availability', moreInfoText: '30 Oct -- 4 Nov', image: rightAngle},
    {id: 2, moreInfoTitle: 'House rules', moreInfoText: 'Check-in: After 15:00', image: rightAngle},
    {
      id: 3,
      moreInfoTitle: 'Health & safety',
      moreInfoText: 'Rentit’s COVID-19 safety practices apply carbon monoxide alarm',
      image: rightAngle,
    },
    {
      id: 4,
      moreInfoTitle: 'Cancellation policy',
      moreInfoText:
        'Free cancellation before 25 Oct.Review the Host’s full cancellation policy which applies even if you cancel for illness or disruptions caused by COVID-19',
      image: rightAngle,
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
      navigation.navigate('Policy');
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

  const moreInfoKeyExtractor = useCallback(item => item.id, []);

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

  if (isLoading || !post) {
    return (
      <View style={[globalStyles]}>
        <SkeletonContent
          containerStyle={styles.skeleton}
          animationDirection="horizontalLeft"
          layout={mainSkeletonLayout}
          isLoading
        />
      </View>
    );
  }

  return (
    <ScrollView>
      <Carousel
        postId={post.id}
        images={post.images}
        isFav={checkIsFav(post.id)}
        onFavorite={onFavorite}
      />
      <View style={[styles.mainContent]}>
        <Typography variant="xlarge" bold>
          {post.title}
        </Typography>
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
          icon={<Image source={DoorIcon} width={24} height={26} />}
        />
        <ListItemText
          primary="City Superhost is a Superhost"
          secondary="Superhosts are experienced, highly rated hosts who are committed to providing great stays for their guests"
          reverse
          icon={<Image source={MedalIcon} width={30} height={30} />}
        />
        <ListItemText
          primary="Free cancellation before 25 Oct"
          reverse
          icon={<Image source={CalendarIcon} width={30} height={30} />}
        />
        <Divider />
        <Typography>
          Every booking includes free protection from Host cancellations, listing inaccuracies, and
          other issues like trouble checking in.
        </Typography>
        <Typography
          // onPress={() => {}}
          style={{textDecorationLine: 'underline', marginTop: offsets.offsetA}}>
          Learn more
        </Typography>
        <Divider />
        <Typography>
          You’ll love this home for your visit to Manchester whether you’re here for a long time,
          short time, business or pleasure
        </Typography>
        <Typography
          // onPress={() => {}}
          style={{textDecorationLine: 'underline', marginTop: offsets.offsetA}}>
          Learn more
        </Typography>
        <Divider />
        <Image source={RentitGuaranteeImg} width={239} height={24} />
        <Typography style={{marginTop: offsets.offsetA}}>
          Every booking includes free protection from Host cancellations, listing inaccuracies, and
          other issues like trouble checking in.
        </Typography>
        <Typography
          // onPress={() => {}}
          style={{textDecorationLine: 'underline', marginTop: offsets.offsetA}}>
          Learn more
        </Typography>
        <Divider />
        <Typography style={{marginTop: offsets.offsetA}}>{post.description}</Typography>
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
          primary="What this place offers"
          reverse
          center
          icon={<Image source={CalendarIcon} width={30} height={30} />}
        />
        <ListItemText
          primary="What this place offers"
          reverse
          center
          icon={<Image source={CalendarIcon} width={30} height={30} />}
        />
        <ListItemText
          primary="What this place offers"
          reverse
          center
          icon={<Image source={CalendarIcon} width={30} height={30} />}
        />
        <ListItemText
          primary="What this place offers"
          reverse
          center
          icon={<Image source={CalendarIcon} width={30} height={30} />}
        />
        <ListItemText
          primary="What this place offers"
          reverse
          center
          icon={<Image source={CalendarIcon} width={30} height={30} />}
        />
        <Divider />
        {similarPosts?.length ? (
          <>
            <Typography variant="xlarge" bold>
              4.76 - 28 Reviews
            </Typography>
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
        <Button text="Show All 28 reviews" onPress={goReviewScreen} />
        <Divider />
        <FlatList
          data={postMoreInfoData}
          renderItem={moreInfoItem}
          keyExtractor={moreInfoKeyExtractor}
        />
      </View>
    </ScrollView>
  );
};

export default PostScreen;
