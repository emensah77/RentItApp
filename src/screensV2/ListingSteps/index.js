import React from 'react';
import {Pressable, View, Image} from 'react-native';

import Typography from '../../componentsV2/DataDisplay/Typography';
import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import IconWoman from '../../../assets/data/images/woman-big.png';
import ExampleImage from '../../../assets/data/images/room-example.png';
import TopBar from '../../componentsV2/DataDisplay/TopBar';

const ListingSteps = () => {
  return (
    <View style={styles.mainContent}>
      <TopBar />
      <View style={styles.bottomFixedButtonBox}>
        <Pressable style={styles.bottomFixedTextButton}>
          <Typography style={styles.bottomFixedTextButtonText} bold>
            Back
          </Typography>
        </Pressable>
        <Pressable style={styles.bottomFixedButton}>
          <Typography style={styles.bottomFixedButtonText}>Next</Typography>
        </Pressable>
      </View>
    </View>
  );
};

export default ListingSteps;
