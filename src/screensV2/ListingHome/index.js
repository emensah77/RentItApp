import React, {useCallback} from 'react';
import {Pressable, View, Image} from 'react-native';

import Typography from '../../componentsV2/DataDisplay/Typography';
import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import Icon1 from '../../../assets/data/images/woman.png';
import Icon2 from '../../../assets/data/images/man-1.png';
import Icon3 from '../../../assets/data/images/man-2.png';

import ListingSteps from '../ListingSteps';
import {useNavigation} from '@react-navigation/native';

const ListingHome = () => {
  const navigation = useNavigation();
  const goListingStep = useCallback(() => {
    navigation.navigate('ListingStep');
  }, []);
  return (
    <View style={styles.mainContent}>
      <Pressable style={styles.backButton}>
        <Image source={BackArrow} />
      </Pressable>
      <Typography bold style={styles.title}>
        It's easy to get started on Rentit
      </Typography>
      <View style={styles.item}>
        <View style={styles.left}>
          <Typography style={styles.boldText}>1 Tell us about your place</Typography>
          <Typography style={styles.lightText}>
            Share some basic info like how many guest can stay.
          </Typography>
        </View>
        <Image source={Icon1} width={65} />
      </View>
      <View style={styles.item}>
        <View style={styles.left}>
          <Typography style={styles.boldText}>2 Make it stand out</Typography>
          <Typography style={styles.lightText}>
            Share some basic info like how many guest can stay.
          </Typography>
        </View>
        <Image source={Icon2} width={65} />
      </View>
      <View style={styles.item}>
        <View style={styles.left}>
          <Typography style={styles.boldText}>3 Finish up and publish</Typography>
          <Typography style={styles.lightText}>
            Set a starting price, and publish your listing.
          </Typography>
        </View>
        <Image source={Icon3} width={65} />
      </View>
      <View style={styles.bottomFixedButtonBox}>
        <Pressable style={styles.bottomFixedButton} onPress={goListingStep}>
          <Typography style={styles.bottomFixedButtonText} bold>
            Get Started
          </Typography>
        </Pressable>
      </View>
    </View>

    // <ListingSteps />
  );
};

export default ListingHome;
