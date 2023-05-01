/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import CardCommentPhoto from './ReviewCard/CardCommentPhoto';

const EReviewsData = [
  {
    id: '1',
    source: 'https://picsum.photos/200',
    name: 'Steve Garrett',
    rate: 4,
    date: '2020 July 20',
    title: 'Nice Place',
    totalLike: 224,
    comment:
      'I especially love the grey sign to the left saying ’Dealer of good vibes’ 🌞What else…. ? 🤷‍♂️😊',
  },
  {
    id: '2',
    totalLike: 100,
    source: 'https://picsum.photos/300',
    name: 'Thai Nguyen',
    rate: 3,
    date: '2020 July 21',
    title: 'Nice Place',
    comment:
      '"BBBFE" for all buyers and the other variables are weighted depending on the age and needs of the buyer.',
    images: [],
  },
];

const Review = props => {
  const {navigation} = props;
  const [reviewList, setReviewList] = useState(EReviewsData);
  const searchBox = useRef(null);

  const writeReview = () => {
    if (searchBox) {
      searchBox.current.focus();
    }
  };

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
              Reviews
            </Text>
          </View>
        </View>
      </LinearGradient>
      <View style={{flex: 1}}>
        <FlatList
          contentContainerStyle={{padding: 20}}
          refreshControl={
            <RefreshControl
              colors={['blue']}
              tintColor="deeppink"
              refreshing={false}
              onRefresh={() => {}}
            />
          }
          data={reviewList}
          keyExtractor={(item, index) => item.id}
          ListHeaderComponent={() => (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 20,
                }}>
                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => navigation.navigate('Feedback')}>
                  <FontAwesomeIcon icon={faPlusCircle} size={18} color="blue" />
                  <Text
                    style={{
                      paddingHorizontal: 4,
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: 'blue',
                    }}>
                    Write a review
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          renderItem={({item}) => (
            <CardCommentPhoto
              style={{
                borderBottomWidth: 0.5,
                borderColor: 'deeppink',
              }}
              image={item.source}
              name={item.name}
              rate={item.rate}
              date={item.date}
              title={item.title}
              comment={item.comment}
            />
          )}
        />
      </View>
    </View>
  );
};

export default Review;
