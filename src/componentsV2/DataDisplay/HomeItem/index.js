import React, {useCallback, useMemo} from 'react';
import {Pressable, Text, View} from 'react-native';

import {styles} from './styles';

import Carousel from '../Carousel';
import Typography from '../Typography';
import Star from '../../../../assets/data/images/icons/star.svg';
import {calculatePriceForDays, extractDate, formatCurrency} from '../../../utils/formatter';
import {setPost} from '../../../redux/post.slice';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const HomeItem = ({item}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const range = useMemo(() => {
    const today = new Date();

    const till = new Date();
    till.setDate(today.getDate() + 5);

    const startObj = extractDate(today);
    const tillObj = extractDate(till);
    const monthlyPrice =
      item.mode === 'For sale'
        ? Math.round((item.newPrice * 1.07) / 12)
        : Math.round((item.newPrice * 1.07) / 12);

    return {
      sameMonth: startObj.month === tillObj.month,
      startMonth: startObj.month,
      tillMonth: tillObj.month,
      start: startObj.day,
      till: tillObj.day,
      price: calculatePriceForDays(today, till, monthlyPrice),
    };
  }, [item]);

  const goToPostPage = useCallback(() => {
    dispatch(
      setPost({
        id: item.id,
        title: item.title,
        images: item.images,
        temp: true,
      }),
    );

    navigation.navigate('Post', {postId: item.id});
  }, [navigation, item.id]);

  return (
    <Pressable onPress={goToPostPage}>
      <Carousel minimal round square images={item.images} />
      <View style={styles.topInfo}>
        <View style={{width: '80%', overflow: 'hidden'}}>
          <Typography bold variant="large">
            {item.title}
          </Typography>
        </View>
        <View style={styles.starBlock}>
          <Star width={10} height={10} />
          <Typography style={{paddingLeft: 10}} variant="large">
            4.76
          </Typography>
        </View>
      </View>
      <Typography variant="large">
        {range.start} {range.startMonth} - {range.till} {range.tillMonth}
      </Typography>
      <View style={styles.prices}>
        <Typography bold variant="large">{`${formatCurrency(item.currency)} ${
          range.price
        } `}</Typography>
        <Typography variant="large">Total</Typography>
      </View>
    </Pressable>
  );
};

export default HomeItem;
