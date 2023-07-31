import React, {useEffect, useState, useRef} from 'react';
import {View, Text, Button, Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {API, graphqlOperation} from 'aws-amplify';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {getPost} from '../../graphql/queries';
import DetailedPost from '../../components/DetailedPost';

const PostScreen = ({route}) => {
  const isMounted = useRef(true);

  const navigation = useNavigation();
  const params = route.params || {};
  const {postId} = params;
  const [newPost, setNewPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deepLinkUrl, setDeepLinkUrl] = useState();

  const handleDeepLink = event => {
    const {url} = event;
    if (url) {
      const path = url.replace(/.*?:\/\//g, '');
      const postIdParam = path.split('/')[2];
      if (postIdParam !== postId) {
        fetchPost(postIdParam);
      }
    }
  };

  const fetchPost = async postId => {
    setLoading(true);
    try {
      const postResult = await API.graphql(
        graphqlOperation(getPost, {
          id: postId,
        }),
      );
      if (isMounted.current) {
        setNewPost(postResult.data.getPost);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId || deepLinkUrl) {
      fetchPost(postId || deepLinkUrl);
    }
  }, [postId, deepLinkUrl]);

  useEffect(() => {
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
      fetchPost(deepLinkUrl);
    }
  }, [deepLinkUrl]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <SkeletonContent
          containerStyle={{flex: 1, width: '100%'}}
          animationDirection="horizontalLeft"
          layout={[
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
          ]}
        />
      </View>
    );
  }

  if (newPost) {
    return (
      <View style={{backgroundColor: 'white'}}>
        <DetailedPost post={newPost} />
      </View>
    );
  }
  return null;
};

export default PostScreen;
