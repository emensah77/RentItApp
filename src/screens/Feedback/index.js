/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/core';
import {Button, Input, Layout} from '@ui-kitten/components';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  StatusBar,
  Text,
  TextInput,
  ScrollView,
  View,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import uuid from 'react-native-uuid';
import {API, graphqlOperation} from 'aws-amplify';
import firestore from '@react-native-firebase/firestore';
import StarRating from '../../components/StarRating';
import {AuthContext} from '../../navigation/AuthProvider';
import styles from './style';
import {createReview} from '../../graphql/mutations';

const EFeedback = ({route}) => {
  const navigation = useNavigation();
  const {user} = useContext(AuthContext);
  const [rate, setRate] = useState(4);
  const [review, setReview] = useState('');
  const [error, setError] = useState(false);
  const [bookings, setBookings] = useState();

  const checkHomeBooking = useCallback(async () => {
    try {
      const data = await firestore()
        .collection('homeorders')
        .where(
          'homeid',
          '==',
          route?.params?.postID ? route?.params?.postID : '',
        )
        .get();
      setBookings(data.docs);
      return data.docs;
    } catch (error) {
      console.log(error, 'Error');
    }
  }, [route?.params?.postID]);

  useEffect(() => {
    checkHomeBooking();
  }, [checkHomeBooking]);

  const uploadReview = useCallback(
    async data => {
      const randomID = uuid.v4();
      const input = {
        review: data?.reply,
        postId: route?.params?.postID,
        id: randomID,
        rating: data?.rating,
        userID: user?.uid,
        // parentReviewId: reviewPost?.id,
      };

      try {
        await API.graphql(graphqlOperation(createReview, {input}));
        navigation.goBack();
        Alert.alert('Review has been added.');
      } catch (e) {
        console.log(e);
      }
    },
    [navigation, route?.params?.postID, user?.uid],
  );

  const submitHandler = useCallback(() => {
    if (!review || !rate) {
      setError(true);
      return;
    }
    const userInfo = bookings?.filter(single => single?.userId === user?.uid);
    const isFound = userInfo?.length !== 0;
    if (!isFound) {
      Alert.alert('You cannot review this home.');
      navigation.goBack();
      return;
    }

    uploadReview({
      reply: review,
      rating: rate,
    });
  }, [bookings, navigation, rate, review, uploadReview, user?.uid]);

  return (
    <View style={{flex: 1}} edges={['right', 'top', 'left']}>
      <StatusBar hidden />
      <LinearGradient
        colors={['purple', 'deeppink']}
        start={{x: 0.1, y: 0.2}}
        end={{x: 1, y: 0.5}}
        style={[
          {
            backgroundColor: 'blue',
            height: '15%',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            paddingHorizontal: 20,
            justifyContent: 'center',
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: Platform.OS === 'ios' ? 50 : 25,
            width: '100%',
          }}>
          <View>
            <Text
              style={{
                fontSize: 24,
                color: '#fff',
                fontWeight: 'bold',
              }}>
              Feedback
            </Text>
          </View>
        </View>
      </LinearGradient>
      <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
        <FlatList
          contentContainerStyle={{paddingHorizontal: 20}}
          ListHeaderComponent={
            <View style={{}}>
              <View style={{alignItems: 'center'}}>
                <Image
                  source={{uri: user?.photoURL}}
                  style={{
                    width: 62,
                    height: 62,
                    borderRadius: 31,
                  }}
                />
                <View style={{width: 160}}>
                  <StarRating
                    starSize={26}
                    maxStars={5}
                    rating={rate}
                    selectedStar={rating => {
                      setRate(rating);
                      setError(false);
                    }}
                    fullStarColor="orange"
                    containerStyle={{padding: 5}}
                  />
                  <Text caption1 grayColor style={{textAlign: 'center'}}>
                    Tap to Rate
                  </Text>
                </View>
              </View>
              <View style={{marginVertical: 20}}>
                <Input
                  multiline
                  style={styles.input}
                  value={review}
                  textStyle={{minHeight: 94}}
                  placeholder="Write a review here ..."
                  onChangeText={nextValue => {
                    setReview(nextValue);
                    setError(false);
                  }}
                />
                {error && (
                  <Text style={{color: 'red', fontSize: 12}}>
                    Review can not be empty
                  </Text>
                )}
              </View>
              <Button
                // onPress={() => navigation.goBack()}
                onPress={submitHandler}
                style={{margin: 2, marginBottom: 40}}
                appearance="outline"
                status="primary">
                Submit
              </Button>
            </View>
          }
          style={{marginTop: 20}}
          numColumns={4}
          data={[]}
          keyExtractor={(item, index) => index.toString()}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default EFeedback;
