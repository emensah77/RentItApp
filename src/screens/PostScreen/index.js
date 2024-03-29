import React, {useEffect, useState, useRef, useCallback} from 'react';
import {View, Linking, Text, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {API, graphqlOperation} from 'aws-amplify';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

import {getPost} from '../../graphql/queries';
import DetailedPost from '../../components/DetailedPost';

const loadingContainerStyle = {
  flex: 1,
  justifyContent: 'center',
  alignContent: 'center',
};

const containerStyle = {flex: 1, justifyContent: 'center', alignItems: 'center'};

const headingStyle = {fontSize: 18, textAlign: 'center', margin: 20};

const searchingText = {color: '#fff', fontSize: 16};

const pressableStyle = {
  paddingVertical: 10,
  paddingHorizontal: 20,
  backgroundColor: '#227C9D',
  borderRadius: 5,
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

const skeletonContainerStyle = {flex: 1, width: '100%'};

const PostScreen = ({route}) => {
  const isMounted = useRef(true);

  const params = route.params || {};
  const {postId} = params;
  const [newPost, setNewPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deepLinkUrl] = useState();

  const navigation = useNavigation();

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
          containerStyle={skeletonContainerStyle}
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
  } else {
    return (
      <View style={containerStyle}>
        <Text style={headingStyle}>
          We couldn&apos;t find the home you were looking for. Sometimes it happens.
        </Text>
        <Pressable style={pressableStyle} onPress={navigation.goBack}>
          <Text style={searchingText}>Keep Searching</Text>
        </Pressable>
      </View>
    );
  }
};

export default PostScreen;
