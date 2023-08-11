import React, {useEffect, useState, useRef, useCallback} from 'react';
import {View, Linking} from 'react-native';
import {API, graphqlOperation} from 'aws-amplify';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

import {getPost} from '../../graphql/queries';
import DetailedPost from '../../components/DetailedPost';

const loadingContainerStyle = {
  flex: 1,
  justifyContent: 'center',
  alignContent: 'center',
};

const layout = [
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
];

const white = {backgroundColor: 'white'};

const containerStyle = {flex: 1, width: '100%'};

const PostScreen = ({route}) => {
  const isMounted = useRef(true);

  const params = route.params || {};
  const {postId} = params;
  const [newPost, setNewPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deepLinkUrl] = useState();

  const handleDeepLink = useCallback(
    event => {
      const {url} = event;
      if (url) {
        const path = url.replace(/.*?:\/\//g, '');
        const postIdParam = path.split('/')[2];
        if (postIdParam !== postId) {
          fetchPost(postIdParam);
        }
      }
    },
    [fetchPost, postId],
  );

  const fetchPost = useCallback(async id => {
    setLoading(true);
    try {
      const postResult = await API.graphql(
        graphqlOperation(getPost, {
          id,
        }),
      );
      if (isMounted.current) {
        setNewPost(postResult.data.getPost);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (postId || deepLinkUrl) {
      fetchPost(postId || deepLinkUrl);
    }
  }, [postId, deepLinkUrl, fetchPost]);

  useEffect(() => {
    const handleUrl = event => {
      handleDeepLink(event);
    };
    const subscription = Linking.addEventListener('url', handleUrl);
    return () => {
      subscription.remove();
    };
  }, [handleDeepLink]);

  useEffect(() => {
    if (deepLinkUrl) {
      fetchPost(deepLinkUrl);
    }
  }, [deepLinkUrl, fetchPost]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={loadingContainerStyle}>
        <SkeletonContent
          containerStyle={containerStyle}
          animationDirection="horizontalLeft"
          layout={layout}
        />
      </View>
    );
  }

  if (newPost) {
    return (
      <View style={white}>
        <DetailedPost post={newPost} />
      </View>
    );
  }
  return null;
};

export default PostScreen;
