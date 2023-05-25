import React from 'react';
import {Pressable, View, Image} from 'react-native';

import Typography from '../../componentsV2/DataDisplay/Typography';
import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import IconWoman from '../../../assets/data/images/woman-big.png';
import ExampleImage from '../../../assets/data/images/room-example.png';

const ListingSteps = () => {
  return (
    <View style={styles.mainContent}>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton}>
          <Image source={BackArrow} />
        </Pressable>
        <View style={styles.topButtons}>
          <Pressable style={styles.topButton}>
            <Typography style={styles.topButtonText}>Save & exit</Typography>
          </Pressable>
          <Pressable style={styles.topButton}>
            <Typography style={styles.topButtonText}>FAQs</Typography>
          </Pressable>
        </View>
      </View>

      {/* Step 1 */}
      <Image source={IconWoman} style={{marginBottom: 44}} />
      <Typography style={styles.stepText}>Step 1</Typography>
      <Typography bold style={styles.title}>
        Tell us about your place
      </Typography>
      <Typography style={styles.text}>
        In this step, we’ll ask you which type of property you have and if guest will book the
        entire place or just a room.{' '}
      </Typography>

      {/* Step 2 */}
      {/* <Typography bold style={styles.title}>Are you renting or selling your home?</Typography>
        <View style={styles.rentSaleStep}>
            <View style={styles.rentSaleStepOption}>
                <Typography style={styles.rentSaleStepBoldText}>For Rent</Typography>
                <Typography style={styles.rentSaleStepLightText}>You are renting your home to tenants, and require monthly payments and offering a stay limited by a time agreed upon.</Typography>
            </View>
            <View style={styles.rentSaleStepOption}>
                <Typography style={styles.rentSaleStepBoldText}>For Sale</Typography>
                <Typography style={styles.rentSaleStepLightText}>You are selling your home for a stipulated amount and are not offering a stay limited by time.</Typography>
            </View>
        </View> */}

      {/* Step 3 */}
      {/* <Typography bold style={styles.title}>Which of these best describe your place?</Typography>
        <View style={styles.placesList}>
            <View style={styles.placeItem}>
                <Typography style={styles.placeName}>Full Home</Typography>
                <Image source={ExampleImage} />
            </View>
            <View style={styles.placeItem}>
                <Typography style={styles.placeName}>Apartment</Typography>
                <Image source={ExampleImage} />
            </View>
            <View style={styles.placeItem}>
                <Typography style={styles.placeName}>Entire Flat</Typography>
                <Image source={ExampleImage} />
            </View>
            <View style={styles.placeItem}>
                <Typography style={styles.placeName}>Self-Contained </Typography>
                <Image source={ExampleImage} />
            </View>
        </View> */}

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
