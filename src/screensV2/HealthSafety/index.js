import React, {useCallback} from 'react';
import {View, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import CircleButton from '../../componentsV2/Inputs/CircleButton';
import RulesRow from '../../componentsV2/DataDisplay/RulesRow/index';
import Typography from '../../componentsV2/DataDisplay/Typography';
import {offsets} from '../../styles/globalStyles';
import {styles} from './styles';
import Icon5 from '../../../assets/data/images/icons/rules/icon5.png';
import Icon6 from '../../../assets/data/images/icons/rules/icon6.png';
import Icon7 from '../../../assets/data/images/icons/rules/icon7.png';

const HealthSafety = () => {
  const navigation = useNavigation();
  const data = [
    {
      image: Icon5,
      text: 'Renit’s COVID-19 safety practices apply',
    },
    {
      image: Icon6,
      text: 'Carbon monoxide alarm',
    },
    {
      image: Icon7,
      text: 'Smoke alarm',
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
    <View style={styles.mainContent}>
      <CircleButton onPress={goBack} />
      <Typography variant="xlarge" bold style={{marginTop: offsets.offsetC, marginBottom: 28}}>
        House rules
      </Typography>
      <FlatList data={data} renderItem={renderItem} keyExtractor={keyExtractor} />
    </View>
  );
};

export default HealthSafety;
