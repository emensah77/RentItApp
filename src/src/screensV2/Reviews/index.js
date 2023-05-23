import React, {useCallback} from 'react';
import {View, Image, FlatList, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {styles} from './styles';

import CircleButton from '../../componentsV2/Inputs/CircleButton';
import Typography from '../../componentsV2/DataDisplay/Typography';
import InputField from '../../componentsV2/Inputs/InputField';
import RatingItem from '../../componentsV2/DataDisplay/RatingItem';

import Star from '../../../assets/data/images/icons/star.png';
import CommentItem from '../../componentsV2/DataDisplay/CommentItem';
import {offsets} from '../../styles/globalStyles';

const Reviews = ({route}) => {
  const data = route?.params?.data;
  const navigation = useNavigation();

  const goBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const renderCommentItem = useCallback(({item}) => {
    return (
      <CommentItem
        image={item.image}
        style={{marginBottom: 10}}
        currency={item?.currency?.[0]}
        newPrice={item.newPrice}
        title={item.title}
        locality={item.locality}
        subLocality={item.sublocality}
        onPress={() => {}}
      />
    );
  }, []);
  return (
    <ScrollView>
      <View style={styles.mainContent}>
        <CircleButton onPress={goBack} />
        <View style={styles.title}>
          <Image source={Star} width={19} height={19} style={{marginRight: 10}} />
          <Typography variant="xlarge" bold>
            4.76 - 28 Reviews
          </Typography>
        </View>
        <InputField />
        <RatingItem text="Cleanliness" raiting={4.7} />
        <RatingItem text="Accuracy" raiting={4.8} />
        <RatingItem text="Communication" raiting={4.8} />
        <RatingItem text="Location" raiting={4.5} />
        <RatingItem text="Check-in" raiting={4.9} />
        <RatingItem text="Value" raiting={4.7} />
        {/* Reviews components */}
        <FlatList style={{marginTop: offsets.offsetB}} data={data} renderItem={renderCommentItem} />
      </View>
    </ScrollView>
  );
};

export default Reviews;
