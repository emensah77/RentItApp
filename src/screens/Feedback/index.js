/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/core';
import {Button, Input, Layout} from '@ui-kitten/components';
import React, {useState} from 'react';
import {Image, StatusBar, Text} from 'react-native';
import {TextInput} from 'react-native';
import {
  ScrollView,
  View,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import StarRating from '../../components/StarRating';
import styles from './style';

const EFeedback = props => {
  const navigation = useNavigation();
  const [rate, setRate] = useState(4.5);
  const [review, setReview] = useState('');

  return (
    <View style={{flex: 1}} edges={['right', 'top', 'left']}>
      {/* <Header
        title={t('feedback')}
        renderLeft={() => {
          return (
            <Icon
              name="angle-left"
              size={20}
              color={colors.text}
              enableRTL={true}
            />
          );
        }}
        renderRight={() => {
          return (
            <Text body1 primaryColor numberOfLines={1}>
              {t('save')}
            </Text>
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          navigation.goBack();
        }}
      /> */}
      <StatusBar hidden={true} />
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
      <KeyboardAvoidingView behavior={'padding'} style={{flex: 1}}>
        <FlatList
          contentContainerStyle={{paddingHorizontal: 20}}
          ListHeaderComponent={
            <View style={{}}>
              <View style={{alignItems: 'center'}}>
                <Image
                  source={{uri: 'https://picsum.photos/300'}}
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
                    }}
                    fullStarColor={'orange'}
                    containerStyle={{padding: 5}}
                  />
                  <Text caption1 grayColor style={{textAlign: 'center'}}>
                    Tap to Rate
                  </Text>
                </View>
              </View>
              <View style={{marginVertical: 20}}>
                <Input
                  multiline={true}
                  style={styles.input}
                  value={review}
                  textStyle={{minHeight: 94}}
                  placeholder="Write a review here ..."
                  onChangeText={nextValue => setReview(nextValue)}
                />
              </View>
              <Button
                onPress={() => navigation.goBack()}
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
