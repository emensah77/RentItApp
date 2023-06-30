import React from 'react';
import {View, Pressable, Image} from 'react-native';

import Typography from '../Typography';
import {styles} from './styles';

import BackArrow from '../../../../assets/data/images/icons/back-arrow.png';

const TopBar = ({saveProgress, goFaqs}) => {
  return (
    <View style={styles.topBar}>
      <Pressable style={styles.backButton}>
        <Image source={BackArrow} />
      </Pressable>
      <View style={styles.topButtons}>
        <Pressable style={styles.topButton} onPress={saveProgress}>
          <Typography style={styles.topButtonText}>Save & exit</Typography>
        </Pressable>
        <Pressable style={styles.topButton} onPress={goFaqs}>
          <Typography style={styles.topButtonText}>FAQs</Typography>
        </Pressable>
      </View>
    </View>
  );
};
export default TopBar;
