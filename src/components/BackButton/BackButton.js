import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Pressable} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {styles} from './BackButton.styles';

const BackButton = () => {
  const navigation = useNavigation();

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <Pressable style={styles.button} onPress={onBack}>
      <Fontisto name="angle-left" size={15} style={styles.icon} />
    </Pressable>
  );
};

export default BackButton;
