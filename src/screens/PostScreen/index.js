import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
  Pressable,
  Text,
  Linking,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {API, graphqlOperation} from 'aws-amplify';
import AnimatedEllipsis from 'react-native-animated-ellipsis';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {URL} from 'url';
import {listPosts, getPost} from '../../graphql/queries';
import DetailedPost from '../../components/DetailedPost';

const PostScreen = ({route}) => {
  const isMounted = useRef(true);

  const navigation = useNavigation();
  const params = route.params || {};
  const {postId, id} = params;
  const [post, setPosts] = useState([]);
  const [newPost, setNewPost] = useState(null);
  const [modalvisible, setmodalvisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextToken, setNextToken] = useState(null);
  const [deepLinkUrl, setDeepLinkUrl] = useState();
  const handleDeepLink = async event => {
    const {url} = event;
    if (url) {
      const path = url.replace(/.*?:\/\//g, '');
      const postIdParam = path.split('/')[2];
      if (postIdParam !== postId) {
        fetchPosts(postIdParam);
      }
    }
  };

  const fetchPosts = async postId => {
    try {
      const postsResult = await API.graphql(
        graphqlOperation(getPost, {
          id: postId,
        }),
      );
      if (isMounted.current) {
        setNewPost(postsResult.data.getPost);
      }
    } catch (e) {
      console.log(e);
    }
  };

  async function getDeepLinkUrl() {
    if (!postId) {
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          const regex = /\/room\/([^/]+)\/?$/;
          const match = url.match(regex);
          if (match && match[1]) {
            setDeepLinkUrl(match[1]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setDeepLinkUrl(null);
    }
  }

  const handleForegroundDeepLink = url => {
    if (url) {
      const path = url.replace(/.*?:\/\//g, '');
      const postIdParam = path.split('/')[2];
      if (postIdParam !== postId) {
        setDeepLinkUrl(postIdParam);
      }
    }
  };

  useEffect(() => {
    console.log('Checking deep link');
    getDeepLinkUrl();

    const handleUrl = event => {
      handleDeepLink(event);
    };

    const subscription = Linking.addEventListener('url', handleUrl);

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (deepLinkUrl) {
      handleForegroundDeepLink(deepLinkUrl);
    }
  }, [deepLinkUrl]);
  useEffect(
    () => () => {
      isMounted.current = false;
    },
    [],
  );

  useEffect(() => {
    if (postId || deepLinkUrl) {
      console.log('Fetching post:', postId || deepLinkUrl);
      setLoading(true);
      fetchPosts(postId || deepLinkUrl);
      setLoading(false);
    }
  }, [postId, deepLinkUrl]);

  if (newPost === undefined) {
    return null;
  }

  const createTwoButtonAlert = () => {
    setmodalvisible(true);
  };
  const makeCall1 = () => {
    const phoneNumbers = ['0256744112'];

    let phoneNumber =
      phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phoneNumber}`;
    } else {
      phoneNumber = `telprompt:${phoneNumber}`;
    }
    try {
      Linking.openURL(phoneNumber);
    } catch (e) {
      console.log(e);
    }
  };

  if (!newPost) {
    return (
      //     <View style={{alignItems: 'center', justifyContent:"center"}}>
      //      <AnimatedEllipsis animationDelay={100} style={{
      //     color: 'blue',
      //    fontSize: 100,

      //   letterSpacing: -15,

      //    }}/>

      //    </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <SkeletonContent
          containerStyle={{paddingBottom: 0, width: '100%'}}
          animationDirection="horizontalLeft"
          layout={[
            // long line
            {
              width: '100%',
              height: 300,
              marginBottom: 10,
              borderRadius: 10,
            },
            {width: 220, height: 20, marginBottom: 10},
            // short line
            {width: 90, height: 20, marginBottom: 10},
            {width: 40, height: 20, marginBottom: 80},

            {width: '100%', height: 150, marginBottom: 100},

            {
              width: '100%',
              height: 20,
              marginBottom: 12,
              paddingHorizontal: 40,
            },
            {width: '100%', height: 20, marginBottom: 12},
            {width: '100%', height: 20, marginBottom: 12},
            {width: '100%', height: 20, marginBottom: 12},
            {width: '100%', height: 20, marginBottom: 12},
            {width: '100%', height: 20, marginBottom: 12},
            {width: '100%', height: 20, marginBottom: 12},

            // ...
          ]}
        />
      </View>
    );
  }

  return (
    <View style={{backgroundColor: 'white'}}>
      <DetailedPost post={newPost} />
    </View>
  );
};

export default PostScreen;
