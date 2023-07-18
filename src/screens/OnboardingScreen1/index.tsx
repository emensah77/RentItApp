/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Pressable, Image} from 'react-native';
import {Typography, Page, Icon, Text, SizedBox} from '@components';
import {offsets} from '@theme/spacing';
import {iconWoman} from '@images';
import {palette} from '@assets/styles';
import DividedProgress from '@components/DividedProgress';
import BottomActionsBar from '@components/BottomActionsBar';
import {styles} from './styles';

const OnboardingScreen1 = props => {
  const {navigation} = props;
  const goFaqs = () => {
    navigation.navigate('OnboardingScreen12');
  };

  const goBack = () => {
    navigation.goBack();
  };
  return (
    <>
      <Page safeAreaEdges={['top']} hasPadding={true} type="" backgroundColor={palette.textInverse}>
        <View style={styles.topBar}>
          <Icon icon="arrLeft" size={20} onPress={goBack} />
          <View style={styles.topButtons}>
            <Pressable
              style={styles.topButton}
              onPress={() => navigation.navigate('OnboardingScreen12')}>
              <Typography style={styles.topButtonText}>Save & exit</Typography>
            </Pressable>
            <Pressable style={styles.topButton} onPress={goFaqs}>
              <Typography style={styles.topButtonText}>FAQs</Typography>
            </Pressable>
          </View>
        </View>
        <View style={styles.mainContent}>
          <View style={{width: '100%', alignItems: 'center'}}>
            <Image source={iconWoman} />
          </View>
          <SizedBox height={20} />
          <Text text="Step 1" size="md" weight="bold" color={palette.textInverse500} />
          <SizedBox height={6} />
          <Text text="Tell us about your place" size="xl" weight="bold" />
          <SizedBox height={6} />
          <Text
            text="In this step, we’ll ask you which type of property you have and if guest will book the
          entire place or just a room."
            size="xs"
            weight="500"
            color={palette.textInverse500}
          />

          <SizedBox height={60} />
        </View>
      </Page>
      <DividedProgress total={6} progress={1} style={{marginBottom: offsets.offsetB}} />

      <BottomActionsBar
        leftText="Back"
        rightText="Next"
        rightAction={() => navigation.navigate('OnboardingScreen12')}
      />
    </>
  );
};

export default OnboardingScreen1;
