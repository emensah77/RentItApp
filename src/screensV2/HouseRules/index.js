import React, {useCallback} from 'react';
import {View, FlatList, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import CircleButton from '../../componentsV2/Inputs/CircleButton';
import RulesRow from '../../componentsV2/DataDisplay/RulesRow/index';
import Typography from '../../componentsV2/DataDisplay/Typography';

import {offsets} from '../../styles/globalStyles';
import {styles} from './styles';

import Icon1 from '../../../assets/data/images/icons/rules/icon1.png';
import Icon2 from '../../../assets/data/images/icons/rules/icon2.png';
import Icon3 from '../../../assets/data/images/icons/rules/icon3.png';
import Icon4 from '../../../assets/data/images/icons/rules/icon4.png';

const HouseRules = () => {
  const navigation = useNavigation();

  const data = [
    {
      image: 5,
      text: 'Check-in: After 15:00',
    },
    {
      image: 5,
      text: 'Check-out: 11:00',
    },
    {
      image: 6,
      text: 'Self check-in with lockbox',
    },
    {
      image: 7,
      text: 'No pets',
    },
    {
      image: 8,
      text: 'No parties',
    },
  ];

  const goBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const renderItem = useCallback(({item}) => {
    return (
      <>
        <RulesRow image={item.image} text={item.text} />
      </>
    );
  }, []);

  const keyExtractor = useCallback(item => item.id, []);

  return (
    <SafeAreaView>
      <View style={styles.mainContent}>
        <CircleButton onPress={goBack} />
        <Typography variant="xlarge" bold style={{marginTop: offsets.offsetC, marginBottom: 28}}>
          House rules
        </Typography>
        <FlatList data={data} renderItem={renderItem} keyExtractor={keyExtractor} />
      </View>
    </SafeAreaView>
  );
};

export default HouseRules;
