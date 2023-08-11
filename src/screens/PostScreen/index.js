import React, {useEffect, useState, useRef} from 'react';
import {View, Text, Pressable, Linking} from 'react-native';
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
  } else {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 18, textAlign: 'center', margin: 20}}>
          We couldn't find the home you were looking for. Sometimes it happens.
        </Text>
        <Pressable
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: '#227C9D',
            borderRadius: 5,
          }}
          onPress={() => navigation.goBack()}>
          <Text style={{color: '#fff', fontSize: 16}}>Keep Searching</Text>
        </Pressable>
      </View>
    );
  }
};

export default PostScreen;
